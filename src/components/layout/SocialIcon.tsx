type Icon = "instagram" | "x" | "tiktok" | "youtube";

const paths: Record<Icon, JSX.Element> = {
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="7" r="1" fill="currentColor" />
    </>
  ),
  x: (
    <path
      d="M5 5l14 14M19 5 5 19"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  ),
  tiktok: (
    <path
      d="M14 3v10.5a3.5 3.5 0 1 1-3.5-3.5c.3 0 .6.02.9.07M14 3c.4 2.2 2 3.9 4 4.3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
  ),
  youtube: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5z" fill="currentColor" />
    </>
  ),
};

export function SocialIcon({ icon }: { icon: Icon }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      {paths[icon]}
    </svg>
  );
}
