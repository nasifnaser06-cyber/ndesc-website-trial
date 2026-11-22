import Scanner from "@/components/Scanner";

// ndesc.com/scan/ : the NESS X check-in scanner for the two staff phones.
// It only works when opened with the scanner link from the NESS X Summit sheet
// (the link carries the check-in web app and its secret key after the #).
export default function ScanPage() {
  return <Scanner />;
}
