---
title: Sharing Files with macOS from FreeBSD with SMB and mDNS Service Discovery
---

This is an explanation
of one way of sharing files
with Mac OS X 10.11 El Capitan
from FreeBSD 11.0.
It uses [Samba],
an implementation of the [SMB] protocol,
and Apple's [mDNSResponder]
for service discovery.
Alternatives are listed at the end.

[Samba]: https://en.wikipedia.org/wiki/Samba_(software)
[SMB]: https://en.wikipedia.org/wiki/Server_Message_Block
[mDNSResponder]: https://opensource.apple.com/tarballs/mDNSResponder/

## Background

SMB is the protocol
used for file sharing
between Windows systems.
Mac systems previously used
their own [Apple Filing Protocol],
but [deprecated] it in favour of SMB
with Mac OS X 10.9 Mavericks.

[mDNS], or multicast DNS,
is a technology for resolving host names
in a local network.
On top of this,
[DNS service discovery], or DNS-SD,
can be used to broadcast available services,
such as SMB.
This is how Finder discovers
hosts to show in "Shared" or "Network."

[Apple Filing Protocol]: https://en.wikipedia.org/wiki/Apple_Filing_Protocol
[deprecated]: http://appleinsider.com/articles/13/06/11/apple-shifts-from-afp-file-sharing-to-smb2-in-os-x-109-mavericks
[mDNS]: https://en.wikipedia.org/wiki/Multicast_DNS
[DNS service discovery]: https://en.wikipedia.org/wiki/Zero-configuration_networking#DNS-based_service_discovery

## Samba

First, install Samba.
There are two versions available in FreeBSD.
This is the newer one.

    pkg install samba42

Next, configure it
with `/usr/local/etc/smb4.conf`.
The manual page `smb.conf(5)`
suggests a basic configuration
allowing users to access their home directories.

    [homes]
    read only = no

Additional shared directories can be added,
such as the downloads directory
of the [Transmission] daemon.

    [Downloads]
    path = /usr/local/etc/transmission/home/Downloads
    read only = yes

In order to allow users to log in over SMB,
give them a password with `smbpasswd` as root.

    smbpasswd -a curtis

Now, enable and start the Samba server.

    echo 'samba_server_enable="YES"' >> /etc/rc.conf
    service samba_service start

At this point,
it should be possible
to connect manually
from Finder's "Connect to Server..."
by typing, for example,
`smb://192.168.0.101/Downloads`
and authenticating with username and password.

[Transmission]: https://transmissionbt.com

## mDNSResponder

Install mDNSResponder,
Apple's implementation of mDNS and DNS-SD.

    pkg install mDNSResponder

Unfortunately, this software is poorly documented
and the `mdnsd` binary does not seem to work.
However, the package also provides `mDNSResponderPosix`,
which is targeted at embedded systems
and is a bit less opaque.

Given no arguments,
`mDNSResponderPosix` exits with an error,
so configure `/etc/rc.conf` to pass it a configuration file.

    mdnsresponderposix_enable="YES"
    mdnsresponderposix_flags="-f /usr/local/etc/mdnsresponderposix.conf"

The format of the file
does not seem to be documented,
but it can be inferred by reading
`RegisterServicesInFile` in `mDNSPosix/Responder.c`.
The function reads newline-separated
service name, type, port, and optional text records.
Each service is separated by a blank line.

To broadcast the SMB service
from a host named "thursday",
add the following to `/usr/local/etc/mdnsresponderposix.conf`.

    thursday
    _smb._tcp
    445

Now start the service
and Finder should *find* the shared directories.
You may have to click "Connect As..."
to enter your credentials the first time.[^1]

    service mdnsresponderposix start

[![Finder showing shared directories](/image/finder-smb.png)](/image/finder-smb.png)

As a bonus,
it should now be possible
to `ssh thursday.local`.

[^1]: I'm not sure why both `curtis` and `homes` appear in Finder.

## Alternatives

Samba alternatives:

- [Netatalk], an AFP implementation:
    - AFP is deprecated.
    - Litters files and folders everywhere to support [resource forks].
    - `netatalk3` depends on Avahi, see below.
- [NFS]:
    - Supported natively by FreeBSD.
    - Supported by Finder, but seemingly not through service discovery.

mDNSResponder alternatives:

- [Avahi]:
    - Bloated, with runtime dependencies such as [DBus].
- [OpenMDNS]:
    - From the [OpenBSD] crowd.
    - Can only be configured at runtime with `mdnsctl`.

[Netatalk]: http://netatalk.sourceforge.net
[resource forks]: https://en.wikipedia.org/wiki/Resource_fork
[NFS]: https://en.wikipedia.org/wiki/Network_File_System
[Avahi]: https://en.wikipedia.org/wiki/Avahi_(software)
[DBus]: https://www.freedesktop.org/wiki/Software/dbus/
[OpenMDNS]: http://www.haesbaert.org/openmdns/
[OpenBSD]: http://www.openbsd.org
