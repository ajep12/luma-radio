/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#08090b",
          raised: "#111318",
          panel: "#16181e",
          line: "#24262d",
        },
        // Dedicated alias for the same near-black used as text color on lime
        // buttons/badges — kept separate from `base` because Tailwind's
        // built-in font-size scale already defines `text-base` (1rem), and
        // reusing that name for a color would collide with it.
        coal: "#08090b",
        ink: {
          DEFAULT: "#f4f5f1",
          soft: "#c8cad2",
          faint: "#82858f",
        },
        lime: {
          DEFAULT: "#c8f24d",
          dim: "#93b93a",
          glow: "#e4ff8a",
        },
      },
      fontFamily: {
        display: ["'Unbounded'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      backgroundImage: {
        "lume-radial":
          "radial-gradient(60% 60% at 50% 0%, rgba(200,242,77,0.16) 0%, rgba(8,9,11,0) 70%)",
        "lume-fade": "linear-gradient(180deg, rgba(8,9,11,0) 0%, #08090b 100%)",
      },
      boxShadow: {
        lime: "0 0 40px rgba(200,242,77,0.25)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        rise: "rise 0.7s cubic-bezier(0.16,1,0.3,1) both",
        marquee: "marquee 22s linear infinite",
        "pulse-dot": "pulseDot 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
