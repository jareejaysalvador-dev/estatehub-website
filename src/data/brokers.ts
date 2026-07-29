// ============================================================
// SAMPLE DATA - replace with the real roster before launch.
// Source of truth: intake workbook (Broker Roster tab) at
// estatehub_handoff/intake/launch-content-intake.xlsx.
// Names and license numbers below are placeholders, not real people;
// the About page renders roster slots as pending until this is filled.
// ============================================================

export interface Broker {
  id: string;
  name: string;
  /** PRC real estate broker license number */
  prcLicense: string;
  phone: string;
  email: string;
  areas: string;
  isSample: true;
}

export const BROKERS: Broker[] = [
  {
    id: "sample-broker-1",
    name: "Sample Broker A",
    prcLicense: "PRC No. pending intake",
    phone: "+63 900 000 0000",
    email: "hello@estatehub.ph",
    areas: "South Luzon",
    isSample: true,
  },
  {
    id: "sample-broker-2",
    name: "Sample Broker B",
    prcLicense: "PRC No. pending intake",
    phone: "+63 900 000 0000",
    email: "hello@estatehub.ph",
    areas: "Metro Manila and Cebu",
    isSample: true,
  },
];

export function getBroker(id: string): Broker | undefined {
  return BROKERS.find((b) => b.id === id);
}
