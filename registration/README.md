# NESSX automatic registration

Participants register on the website's Register page (`/ness/register/`), pay by bKash Send Money, and type the TrxID. A Google Sheet owned by the club receives the form and the payment SMS, matches them, and emails the pass. Only mismatches reach a person.

The full process and the risks are in the "NESSX automated registration and payment: process and risks" doc.

## What is here

| File | What it is |
| --- | --- |
| `apps-script/Logic.gs` | The rules: reads bKash SMS, checks forms, decides verify or review. No Google services, so it can be tested on a computer. |
| `apps-script/Code.gs` | The web app around the rules: sheets, form and SMS handling, emails, alerts, setup. |
| `tests/logic.test.js` | 35 checks of the rules. |
| `tests/flow.test.js` | 35 checks of the whole flow, with fake Google services. |
| `tests/email.test.js` | 5 checks of the pass email for online and team passes and when the QR service is down. |
| `tests/mock-server.js` | A stand-in for the web app at `http://localhost:8078`, to try the Register page locally. |

Run the tests: `node registration/tests/logic.test.js && node registration/tests/flow.test.js && node registration/tests/email.test.js && node registration/tests/checkin.test.js`

The summit check-in (scanner) is in `checkin/`, with its own README.

## Participant IDs

Verified registrations get NESSX-10000, NESSX-10001, ... in the order they are verified, one counter for every category and pass. The script also checks the IDs already in the sheet, so a number is never given twice.

## Emails

Sent from the account that owns the sheet (ndesc.organizers.2027@gmail.com, sender name from Settings, "NESS X Organizers"):

- **Pass email** when a registration is verified: the QR code inside the email (fetched once when sending, also attached as `NESSX-pass-qr.png`), name, Participant ID, pass, category, institution, date and venue, what to do on the day. The check code itself is never shown as text.
- **We're checking your payment** when a registration goes to Needs review.

There is no "registration received" email: the Register page already says the payment is being matched.

## Setting it up (about 30 minutes, once)

1. **Sheet.** Signed in as the club account (ndesc.organizers.2027@gmail.com), create a Google Sheet called "NESSX registrations". Share it only with the organizers who need it.
2. **Script.** In the sheet: Extensions > Apps Script. Delete the sample code. Make two files, `Logic.gs` and `Code.gs`, and paste in the files from `apps-script/`.
3. **Setup.** In the editor choose `setup` and press Run. Allow the permissions it asks for (Sheets, sending email, triggers). It creates the tabs, a 5-minute backup matcher and a secret SMS key.
4. **Settings tab.** Fill in the bKash number, the Nagad number (or leave blank) and the alert email. Check the prices. "Registration open" is the on/off switch.
5. **Publish.** Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone. Copy the web app address (it ends in `/exec`).
6. **Website.** In `content/site.ts`, put that address in `registration.endpoint`. The Register page stops being a draft and shows the live numbers and prices from the Settings tab.
7. **Payment phone.** Install the club's own app, **NESSX Payments** (`android-app/`, guide in `android-app/README.md`). Paste the web app address and the SMS key, tap "Save and check". It forwards only bKash (and Nagad) messages that carry a TrxID. Send 10 Tk from another phone and check that a row appears in the Payments tab.
   Any other SMS forwarder also works if it POSTs `{"action":"sms","key":"<SMS key>","text":"<message>"}`, or sends `action`, `key` and `text` as form or query fields.
8. **Test** every case in the doc's Step 5 checklist with 10 Tk payments, setting the prices to 10 in Settings first, then back.

After changing the script, use Deploy > Manage deployments > Edit > New version, so the same web address keeps working.

## Day to day

- **Needs review** tab lists everything a person must look at, with the reason.
- To retry a row after fixing it (for example a corrected TrxID), set its Status back to `Waiting`.
- To approve a row by hand, select it in Registrations and use the **NESSX > Approve the selected row by hand** menu.
- **Unread SMS** tab holds any bKash message with a TrxID that the reader could not understand.

## Known limits

- A free Gmail account can send about 100 emails a day from a script. Passes over the limit are marked `Queued` and go out on the next run after the limit resets.
- Nagad's SMS format is not in the reader yet. Send one real "money received" SMS and it will be added.
- The pass QR image is fetched from a free QR service when the email is sent; the service sees only the random check code. If it fails, the pass still goes out with a note to use "Check my registration" to get it again.
