import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        "lime": "hsl(61, 70%, 52%)",
        "red": "hsl(4, 69%, 50%)",
        "slate-100": "hsl(202, 86%, 94%)",
        "slate-300": "hsl(203, 41%, 72%)",
        "slate-500": "hsl(200, 26%, 54%)",
        "slate-700": "hsl(200, 24%, 40%)",
        "slate-900": "hsl(202, 55%, 16%)",
      },
      fontFamily: {
        plusjakartasans: ["Plus Jakarta Sans", ...fontFamily.sans],
        plusjakartaserif: ["Plus Jakarta Serif", ...fontFamily.serif],
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
