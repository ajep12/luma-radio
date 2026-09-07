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
    id: "breakfast",
    name: "Luma Breakfast",
    artwork: "/images/shows/breakfast.jpg",
    description: "Start your day with Luma.",
    time: "07:00 - 10:00",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    presenterId: "",
  },
  {
    id: "drive",
    name: "Luma Drive",
    artwork: "/images/shows/drive.jpg",
    description: "The perfect soundtrack for your afternoon.",
    time: "16:00 - 19:00",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    presenterId: "",
  },
];
