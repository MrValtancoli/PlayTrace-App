# Security Policy

## Supported versions

Security fixes are released for the latest published version only. Please
update to the newest release before reporting.

| Version | Supported |
|---|---|
| Latest release | ✅ |
| Older releases | ❌ |

## Scope

PlayTrace is an offline app: it has no backend, no user accounts and makes
no network calls. Match data stays on the device until the user exports it
through the system share sheet.

Relevant reports include, for example:

- a way for another app or a crafted file to read or alter PlayTrace's stored
  match data;
- exported JSON or CSV files that can carry injected content (e.g. formula
  injection when opened in a spreadsheet);
- a dependency with a known vulnerability that affects the app as shipped.

Out of scope: issues that require a rooted or jailbroken device, physical
access to an unlocked phone, or a modified build of the app.

## Reporting a vulnerability

**Please do not open a public issue for security problems.**

Report it privately through GitHub:
[Report a vulnerability](https://github.com/MrValtancoli/PlayTrace-App/security/advisories/new).

Include the app version, device and OS version, and the steps to reproduce.

## What to expect

PlayTrace is maintained by a single person in their spare time, so
response times are best effort:

- an acknowledgement within 7 days;
- an assessment and, if confirmed, a planned fix;
- credit in the release notes once the fix is published, unless you prefer
  to stay anonymous.
