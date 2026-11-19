# Trial copy of the NDESC website

This repository is a copy of the live site (nasifnaser06-cyber/ndesc-website, ndesc.com).
Design tests and trial changes are made here first. The live site only changes when the
club asks for a change to be copied across.

Two differences from the live site, kept on purpose:

1. The NESS registration form is disconnected (`content/site.ts`, `registration.endpoint` is
   `null`), so test sign-ups never reach the real registration sheet.
2. Every page tells search engines not to index it (`app/(site)/layout.tsx`), so this copy
   never competes with ndesc.com in search results.

When a change is copied to the live site, leave these two out.
