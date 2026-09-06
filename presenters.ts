/**
 * PLACEHOLDER DATA — replace with your real presenter roster.
 * This is not RadioCast data; it's local content you control.
 */
export interface Presenter {
  id: string;
  name: string;
  photo: string;
  bio: string;
  showIds: string[];
  socials: { label: string; href: string }[];
}

export const presenters: Presenter[] = [
  {
    id: "ade-morgan",
    name: "Ade Morgan",
    photo: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop",
    bio: "Ade opens the day on Luma with a mix of new releases and certified favourites. Ten years behind the mic, still first in the building.",
    showIds: ["luma-drive"],
    socials: [
      { label: "Instagram", href: "https://instagram.com/" },
      { label: "X", href: "https://x.com/" },
    ],
  },
  {
    id: "priya-shah",
    name: "Priya Shah",
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop",
    bio: "Priya hosts The Night Shift, Luma's home for deep cuts, unsigned artists and the songs your other stations won't play yet.",
    showIds: ["the-night-shift"],
    socials: [
      { label: "Instagram", href: "https://instagram.com/" },
      { label: "TikTok", href: "https://tiktok.com/" },
    ],
  },
  {
    id: "leo-osei",
    name: "Leo Osei",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
    bio: "Leo brings the energy back after lunch — request-led, fast-paced, and always up for a chat with whoever's listening.",
    showIds: ["afternoon-rush"],
    socials: [{ label: "Instagram", href: "https://instagram.com/" }],
  },
  {
    id: "freya-lang",
    name: "Freya Lang",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    bio: "Freya closes out the week with Weekend Warm Up — a slower, sunnier hour to ease into Saturday.",
    showIds: ["weekend-warm-up"],
    socials: [
      { label: "Instagram", href: "https://instagram.com/" },
      { label: "YouTube", href: "https://youtube.com/" },
    ],
  },
];
