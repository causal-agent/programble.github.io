---
title: System V ABI Quick Reference
---

<figure style="margin-top: 0;">
    <table class="memory" style="width: 26ch; margin-top: 0;">
        <tr>
            <th rowspan="6">Parameters</th>
            <td><code>rdi</code></td>
        </tr>
        <tr><td><code>rsi</code></td></tr>
        <tr><td><code>rdx</code></td></tr>
        <tr><td><code>rcx</code></td></tr>
        <tr><td><code>r8</code></td></tr>
        <tr><td><code>r9</code></td></tr>

        <tr>
            <th rowspan="2">Caller-saved</th>
            <td><code>r10</code></td>
        </tr>
        <tr><td><code>r11</code></td></tr>

        <tr>
            <th rowspan="2">Return</th>
            <td><code>rax</code></td>
        </tr>
        <tr><td><code>rdx</code></td></tr>

        <tr>
            <th rowspan="7">Callee-saved</th>
            <td><code>rbx</code></td>
        </tr>
        <tr><td><code>rsp</code></td></tr>
        <tr><td><code>rbp</code></td></tr>
        <tr><td><code>r12</code></td></tr>
        <tr><td><code>r13</code></td></tr>
        <tr><td><code>r14</code></td></tr>
        <tr><td><code>r15</code></td></tr>
    </table>
</figure>

The [System V Application Binary Interface][abi]
is the calling convention
used almost universally
on x86_64.
This is a quick reference
of the registers used
in function calls,
since the official table
is a bit messy.

Before `call`,
the stack must be 16-byte aligned.
The direction flag `DF`
must also be clear.
The 128-byte "red zone"
below the current stack frame
can be used for temporary data
not preserved across function calls.

[abi]: https://software.intel.com/sites/default/files/article/402129/mpx-linux64-abi.pdf

<div style="clear: both;"></div>

## Linux system calls

<figure>
    <table class="memory" style="width: 26ch; margin-top: 0;">
        <tr>
            <th>Syscall number</th>
            <td><code>rax</code></td>
        </tr>

        <tr>
            <th rowspan="6">Parameters</th>
            <td><code>rdi</code></td>
        </tr>
        <tr><td><code>rsi</code></td></tr>
        <tr><td><code>rdx</code></td></tr>
        <tr><td><strong><code>r10</code></strong></td></tr>
        <tr><td><code>r8</code></td></tr>
        <tr><td><code>r9</code></td></tr>

        <tr>
            <th rowspan="2">Caller-saved</th>
            <td><strong><code>rcx</code></strong></td>
        </tr>
        <tr><td><code>r11</code></td></tr>

        <tr>
            <th rowspan="1">Return</th>
            <td><code>rax</code></td>
        </tr>

        <tr>
            <th rowspan="7">Callee-saved</th>
            <td><code>rbx</code></td>
        </tr>
        <tr><td><code>rsp</code></td></tr>
        <tr><td><code>rbp</code></td></tr>
        <tr><td><code>r12</code></td></tr>
        <tr><td><code>r13</code></td></tr>
        <tr><td><code>r14</code></td></tr>
        <tr><td><code>r15</code></td></tr>
    </table>
</figure>

For some reason
the roles of
`rcx` and `r10`
are swapped.
Calls are made
using the `syscall` instruction.

<div style="clear: both;"></div>
