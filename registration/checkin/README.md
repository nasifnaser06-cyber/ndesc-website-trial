# NESS X summit check-in

Two staff phones scan each participant's QR code (from their pass email) at the registration desk. The scanner page is **ndesc.com/scan/** and only works from the secret scanner link.

| File | What it is |
| --- | --- |
| `CheckIn.gs` | Apps Script for the **NESS X Summit** spreadsheet. Looks codes up in the registration sheet (read only) and logs every scan. |
| `../../components/Scanner.tsx` | The scanner page (camera, results, typing a Participant ID). |
| `../tests/checkin.test.js` | 16 checks of the script with fake Google services. |

## What the scanner shows

- **Registered** (green): first scan of a verified registration, with the pass (Solo pass, Team pass, Online segments), name and Participant ID.
- **Already scanned** (amber): scanned before; shows when and on which phone.
- **Not registered** (red): no registration with that code. If the registration exists but the payment is not verified, it adds "Payment not confirmed yet".

Every scan, repeats included, is a row in the **Check-ins** tab. The **Participants** tab copies the Registrations tab (IMPORTRANGE formula in A1) and column J shows "Checked in at".

## Setting it up (in ndesc.organizers.2027@gmail.com)

1. Spreadsheet **NESS X Summit**, tab **Participants**, with this in A1 (registration sheet address in place of the link):
   `=QUERY(IMPORTRANGE("LINK","Registrations!A1:V"),"select Col18, Col3, Col5, Col4, Col10, Col8, Col9, Col7, Col2 where Col5 is not null label Col18 'Participant ID', Col2 'Registered'",1)` and press Allow access.
2. Extensions > Apps Script: paste `CheckIn.gs` as the only file, save, run `setup`, allow the permissions.
3. Settings tab: paste the registration sheet address into **Registration sheet link**.
4. Deploy > New deployment > Web app, Execute as Me, Who has access Anyone. Copy the Web app URL (ends in /exec) into Settings > **Web app link**.
5. Back in the sheet: menu **NESS X check-in > Show the scanner link**. Open that link on each phone, name the phone, tap Start scanning.

To stop old links working, change the **Scanner key** in Settings and share the new link.
