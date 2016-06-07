---
title: Configuring PF and Fail2ban on FreeBSD
discussions:
  - site: Lobsters
    href: https://lobste.rs/s/3lf8vn/configuring_pf_fail2ban_on_freebsd<Paste>
---

I recently created
a new [DigitalOcean droplet][droplet]
using the [FreeBSD][freebsd] 10.2 image
and have been learning
how to administer it.
After setting up some basics,
it seemed like a good idea
to set up a firewall
and [Fail2ban][fail2ban].
It doesn't take long
to start seeing failed login attempts
in `/var/log/auth.log`.

[droplet]: https://www.digitalocean.com/features/linux-distribution/freebsd/
[freebsd]: https://www.freebsd.org
[fail2ban]: http://www.fail2ban.org/wiki/index.php/Main_Page

The first thing to do
was choose a firewall.
FreeBSD provides [several][firewalls],
among which is [Packet Filter][pf] (PF)
from [OpenBSD][openbsd].
This seemed like a good choice to learn,
since the knowledge is transferable between systems.

[firewalls]: https://www.freebsd.org/doc/handbook/firewalls.html
[pf]: http://www.openbsd.org/faq/pf/
[openbsd]: http://www.openbsd.org

To get started,
I created a simple `pf.conf`
by reading the excellent [man page][pf.conf].

    block in all
    pass out all

This configuration will
drop all incoming packets
and allow all outgoing packets.
To enable the firewall, I ran...

    echo 'pf_enable="YES"' >> /etc/rc.conf
    service pf start

...and then my SSH connection dropped.
Always finish configuring the firewall
before starting it over SSH.

[pf.conf]: https://www.freebsd.org/cgi/man.cgi?query=pf.conf&sektion=5

After logging in to the console
through DigitalOcean
and disabling PF again,
I expanded my configuration.

    tcp_services = "{ ssh, http, https }"
    block in all
    pass in proto tcp from any to any port $tcp_services
    pass out all

The `tcp_services` macro is used
to list ports for which
to allow incoming packets.
These can be numbers or names,
which will be looked up
in `/etc/services`.

After re-enabling PF,
everything seemed to work
at first.
SSH still worked,
and I could load the default [NGINX][nginx] page.
However,
outgoing connections from my [ZNC][znc] instance
to IRC networks
began dropping.
I also noticed that attempts
to [curl][curl] Google
took upwards of 10 seconds
with the firewall enabled.

[nginx]: http://nginx.org
[znc]: http://wiki.znc.in/ZNC
[curl]: https://curl.haxx.se

The output of `curl -v` revealed a clue:
with PF disabled,
the connection was made over IPv6.
With it enabled,
`curl` attempted to make the same connection,
before timing out
and falling back to IPv4.

It turns out that in IPv6,
the [Address Resolution Protocol][arp] (ARP)
was replaced with the [Neighbor Discovery Protocol][ndp] (NDP),
which is part of [ICMPv6][icmpv6].
This means that ICMPv6
is essential for IPv6 to work,
and I had inadvertently blocked it
with `block in all`.

[arp]: https://en.wikipedia.org/wiki/Address_Resolution_Protocol
[ndp]: https://en.wikipedia.org/wiki/Neighbor_Discovery_Protocol
[icmpv6]: https://en.wikipedia.org/wiki/Internet_Control_Message_Protocol_version_6

To allow ICMP traffic,
I added two new rules to my `pf.conf`.

    pass in quick inet proto icmp all
    pass in quick inet6 proto icmp6 all

Adding `quick` to these rules
means that PF won't evaluate
any further rules if these match.

---

With the firewall configured,
it was time to set up Fail2ban.
It can be installed from [pkg][pkg],
along with `pyinotify` for [kqueue][kqueue] support.

    pkg install py27-fail2ban
    pkg install py27-pyinotify

[pkg]: https://www.freebsd.org/doc/handbook/pkgng-intro.html
[kqueue]: https://www.freebsd.org/cgi/man.cgi?kqueue

The default configuration is in `/usr/local/etc/fail2ban/jail.conf`,
and overrides should be put in `jail.local`.
First I needed to tell Fail2ban
to use PF.

    [DEFAULT]
    banaction = pf

This refers to the file `/usr/local/etc/fail2ban/action.d/pf.conf`,
which adds banned IP addresses to a [PF table][table]
called `fail2ban`.
This on its own doesn't do anything
but register the address with PF,
so I needed to add a rule
to `pf.conf` to block the traffic.

    table <fail2ban> persist
    block in quick from <fail2ban>

I added this rule directly below `block in all`
so that it took precedence
over my ICMP rules.

[table]: http://www.openbsd.org/faq/pf/tables.html

Back to Fail2ban,
I enabled the SSH jail,
which watches for failed logins
in `/var/log/auth.log`.

    [sshd]
    enabled = true

Then I reloaded the PF configuration
and started Fail2ban.

    service pf reload
    echo 'fail2ban_enable="YES"' >> /etc/rc.conf
    service fail2ban start

To see it in action,
I can tail the Fail2ban log,
list the addresses in the `fail2ban` table,
and inspect the statistics
for my PF rules.

    tail /var/log/fail2ban.log
    pfctl -t fail2ban -T show
    pfctl -v -s rules

---

My final `pf.conf` looks like this:

    set skip on lo0
    pass out quick all

    tcp_services = "{ ssh, http, https }"
    table <fail2ban> persist

    block in all
    block in quick from <fail2ban>
    pass in quick inet proto icmp all
    pass in quick inet6 proto icmp6 all
    pass in proto tcp from any to any port $tcp_services

I added the first line
so that none of the rules
apply to the loopback interface.

My final `jail.local` looks like this:

    [DEFAULT]
    bantime = 86400
    findtime = 3600
    maxretry = 3
    banaction = pf

    [sshd]
    enabled = true

I tweaked the settings
so that three failed logins
in one hour
results in a 24-hour ban.
