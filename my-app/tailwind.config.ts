import type { Config } from "tailwindcss";
import withMT from "@material-tailwind/react/utils/withMT";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./**/@material-tailwind/**/*.{html,js,ts,jsx,tsx,mdx}"

  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
          'TopBanner-gradient': 'linear-gradient(90deg, rgba(245,230,203,1) 0%, rgba(129,97,84,1) 38%, rgba(124,103,63,1) 100%) ',

      },
      colors: {
        lightBeige: "#F0EDD4",
        mediumBeige: "#ECCDB4",
        strongBeige: "#f17e7e",
        lightBlack: "#00000030"
      }
    },
  },
  plugins: [],
};
const withMaterialTailwind = withMT(config);

export default withMaterialTailwind;