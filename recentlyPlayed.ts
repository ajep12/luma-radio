/**
 * PLACEHOLDER DATA — sample "recently played" history so the interface has
 * something to show before RadioCast play-history data is connected.
 *
 * If your RadioCast plan exposes a play-history / now-playing-history API,
 * replace the array below with data fetched from that endpoint. Until then,
 * this is clearly local placeholder content, not live RadioCast data — see
 * `PlaceholderBadge` usage in `src/pages/RecentlyPlayed.tsx`.
 */
export interface PlayedTrack {
  id: string;
  artist: string;
  song: string;
  artwork: string;
  playedAt: string;
}

export const recentlyPlayed: PlayedTrack[] = [
  {
    id: "1",
    artist: "Nova Bloom",
    song: "Halfway Home",
    artwork: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop",
    playedAt: "18:42",
  },
  {
    id: "2",
    artist: "Kiro & Wren",
    song: "Static Light",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
    playedAt: "18:38",
  },
  {
    id: "3",
    artist: "Marigold",
    song: "Low Tide",
    artwork: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=200&h=200&fit=crop",
    playedAt: "18:33",
  },
  {
    id: "4",
    artist: "The Colour Set",
    song: "Paper Moons",
    artwork: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=200&h=200&fit=crop",
    playedAt: "18:29",
  },
  {
    id: "5",
    artist: "Ossie James",
    song: "Backseat Weather",
    artwork: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200&h=200&fit=crop",
    playedAt: "18:24",
  },
  {
    id: "6",
    artist: "Delphine",
    song: "Glasshouse",
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
    playedAt: "18:19",
  },
];
