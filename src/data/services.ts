export interface ServiceContent {
  slug: string;
  label: string;
  metaDescription: string;
  heroLine: string;
  intro: string;
  steps: string[];
  whoFor: { title: string; detail: string }[];
  faq: { question: string; answer: string }[];
  showOverseasLink: boolean;
}

// Response to "what does it cost" questions deliberately stays generic:
// exact commission/fee models are one of the open business questions in
// estatehub_handoff/intake/launch-content-intake.xlsx (Policies tab) and
// must not be invented here.
export const SERVICES: Record<string, ServiceContent> = {
  sales: {
    slug: "sales",
    label: "Sales",
    metaDescription:
      "Buy or sell property in the Philippines with a licensed broker handling valuation, marketing, negotiation, and closing.",
    heroLine: "We sell it for you.",
    intro:
      "EstateHub does not offer a self-listing tool. When you sell through us, a licensed broker manages the entire process, from pricing to closing. When you buy, that same broker represents your interests, not just the listing.",
    steps: [
      "A free valuation and pricing strategy for your property",
      "Professional marketing and pre-qualified viewings",
      "Offer negotiation on your behalf",
      "Paperwork and closing, from reservation through title transfer",
    ],
    whoFor: [
      {
        title: "Sellers who want a hands-off sale",
        detail:
          "You will not need to field calls, screen buyers, or negotiate alone. Your broker does that.",
      },
      {
        title: "Buyers who want representation",
        detail:
          "A broker who works for you, not the seller, from your first shortlist to your signed contract.",
      },
    ],
    faq: [
      {
        question: "Do I need to list my property myself?",
        answer:
          "No. There is no self-listing tool on this site. Tell us about your property and a broker takes it from there.",
      },
      {
        question: "What does it cost to sell through EstateHub?",
        answer:
          "Commission and fees are agreed with your broker in writing before anything is signed. Ask us for specifics for your property.",
      },
      {
        question: "How long does a sale typically take?",
        answer:
          "It depends on the property, price point, and market. Your broker will give you a realistic estimate after the valuation.",
      },
      {
        question: "Can EstateHub represent me if I am buying, not selling?",
        answer:
          "Yes. Buyer representation works the same way: one broker, on your side, through the whole purchase.",
      },
    ],
    showOverseasLink: true,
  },
  lease: {
    slug: "lease",
    label: "Lease",
    metaDescription:
      "Lease property in the Philippines through EstateHub: vetted rentals for tenants, reliable tenants for landlords.",
    heroLine: "Renting, without the guesswork.",
    intro:
      "For tenants, we vet listings before they reach you. For landlords, we screen tenants before they move in. Either way, one broker manages the lease from viewing to signed contract.",
    steps: [
      "Tell us what you need, or list your unit with us",
      "We match tenants to properties and screen every application",
      "Viewing and lease terms are agreed by both sides",
      "Move-in handled and the lease signed",
    ],
    whoFor: [
      {
        title: "Renters looking for a home",
        detail:
          "Vetted listings and a broker who answers questions quickly, not a call center queue.",
      },
      {
        title: "Landlords who want reliable tenants",
        detail:
          "Screening, lease drafting, and a single point of contact for the life of the tenancy.",
      },
    ],
    faq: [
      {
        question: "Do tenants pay a fee to lease through EstateHub?",
        answer:
          "Our team will walk you through any applicable fees when you inquire, before you commit to anything.",
      },
      {
        question: "How are tenants screened?",
        answer:
          "Your broker will explain the verification steps used for your specific property when you list with us.",
      },
    ],
    showOverseasLink: false,
  },
  "property-management": {
    slug: "property-management",
    label: "Property Management",
    metaDescription:
      "Property management in the Philippines for local and overseas owners: tenants, maintenance, collections, and payouts handled.",
    heroLine: "Hands-off ownership.",
    intro:
      "We manage tenants, maintenance, rent collection, and reporting, so owning a rental property does not become a second job. Built especially for owners who are not based near their property, including overseas Filipinos.",
    steps: [
      "A property assessment and a written management agreement",
      "Tenant placement and screening",
      "Ongoing maintenance, rent collection, and reporting",
      "Monthly payouts to you, wherever you are",
    ],
    whoFor: [
      {
        title: "Owners tired of self-managing",
        detail:
          "Hand off tenant calls, repair coordination, and collections to a licensed broker.",
      },
      {
        title: "Remote and overseas owners",
        detail:
          "Full oversight and reporting without needing to be in the country.",
      },
    ],
    faq: [
      {
        question: "What is included in the management fee?",
        answer:
          "Scope and fees are set out in your management agreement before you sign anything, tailored to your property.",
      },
      {
        question: "Can you manage my property if I live abroad?",
        answer:
          "Yes, this is one of our most common arrangements. See our page for overseas Filipino owners and buyers for how remote oversight works.",
      },
    ],
    showOverseasLink: true,
  },
  "business-solutions": {
    slug: "business-solutions",
    label: "Business Solutions",
    metaDescription:
      "Commercial real estate and investment advisory for companies and investors across the Philippines.",
    heroLine: "Commercial space, handled by a broker who knows business.",
    intro:
      "Office, retail, and industrial space for growing companies, plus investment advisory for portfolio-minded clients. One broker manages the search, negotiation, and paperwork.",
    steps: [
      "Understand your space or investment requirements",
      "Shortlist options and arrange site visits",
      "Negotiate lease or purchase terms",
      "Ongoing portfolio advisory, if you need it",
    ],
    whoFor: [
      {
        title: "Companies seeking commercial space",
        detail:
          "Office, retail, or industrial, sized and located to how your business actually operates.",
      },
      {
        title: "Investors building a portfolio",
        detail:
          "Advisory on acquisitions across residential and commercial property.",
      },
    ],
    faq: [
      {
        question: "What types of commercial space do you handle?",
        answer:
          "Office, retail, and industrial space, sourced and negotiated by a single broker for your company.",
      },
      {
        question: "Do you work with investors as well as tenants?",
        answer:
          "Yes. Advisory engagements are scoped individually depending on your portfolio and goals.",
      },
    ],
    showOverseasLink: false,
  },
};

export function getService(slug: string): ServiceContent | undefined {
  return SERVICES[slug];
}
