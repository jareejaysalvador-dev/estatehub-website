// ============================================================
// Real roster, from intake (Broker Roster tab) at
// estatehub_handoff/intake/launch-content-intake.xlsx. Partial: one
// broker confirmed so far. isSample stays a real field (not removed)
// so any future stand-in entry is still labeled, not silently real.
// ============================================================

export interface Broker {
  id: string;
  name: string;
  /** PRC real estate broker license number */
  prcLicense: string;
  phone: string;
  email: string;
  areas: string;
  languages: string;
  bio: string;
  isSample: boolean;
}

export const BROKERS: Broker[] = [
  {
    id: "rosemarie-ramos",
    name: "Rosemarie A. Ramos",
    prcLicense: "PRC No. 0034576",
    phone: "+63 991 797 4412",
    email: "estatehub.ph@gmail.com",
    areas: "South Luzon",
    languages: "English, Filipino",
    bio: "Helping families plan their estate for generational wealth.",
    isSample: false,
  },
];

export function getBroker(id: string): Broker | undefined {
  return BROKERS.find((b) => b.id === id);
}
