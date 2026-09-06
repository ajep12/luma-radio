/**
 * PLACEHOLDER DATA — replace with your real show lineup.
 * This is not RadioCast data; it's local content you control.
 */
export interface Show {
  id: string;
  name: string;
  artwork: string;
  description: string;
  time: string;
  days: string[];
  presenterId: string;
}

export const shows: Show[] = [
  {
    id: "luma-drive",
    name: "Luma Drive",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop",
    description:
      "Your morning soundtrack. New music, big anthems, and everything you need to get out the door on time.",
    time: "07:00 – 10:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    presenterId: "ade-morgan",
  },
  {
    id: "afternoon-rush",
    name: "Afternoon Rush",
    artwork: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=800&fit=crop",
    description:
      "Two hours of non-stop energy, request-led and always moving. Send your song in and hear it live.",
    time: "13:00 – 15:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    presenterId: "leo-osei",
  },
  {
    id: "the-night-shift",
    name: "The Night Shift",
    artwork: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=800&fit=crop",
    description:
      "Deep cuts, unsigned talent, and the songs that deserve a second listen. Luma after dark.",
    time: "20:00 – 22:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sun"],
    presenterId: "priya-shah",
  },
  {
    id: "weekend-warm-up",
    name: "Weekend Warm Up",
    artwork: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&h=800&fit=crop",
    description:
      "A slower, sunnier start to the weekend. Feel-good favourites and the odd surprise.",
    time: "09:00 – 11:00",
    days: ["Sat"],
    presenterId: "freya-lang",
  },
];
