/**
 * PLACEHOLDER DATA — advertisement slots. In the admin dashboard these will
 * eventually be editable (see `src/pages/admin/AdvertisementsAdmin.tsx`).
 */
export interface AdSlotData {
  id: string;
  kind: "homepage-banner" | "sponsored-content" | "show-sponsorship";
  sponsor: string;
  headline: string;
  cta: string;
  href: string;
}

export const ads: AdSlotData[] = [
  {
    id: "banner-1",
    kind: "homepage-banner",
    sponsor: "Northside Coffee Co.",
    headline: "Fuelling Luma Drive every weekday morning.",
    cta: "Find your nearest cup",
    href: "#",
  },
  {
    id: "sponsor-night-shift",
    kind: "show-sponsorship",
    sponsor: "Half Light Records",
    headline: "The Night Shift is proudly supported by Half Light Records.",
    cta: "Discover new signings",
    href: "#",
  },
];
