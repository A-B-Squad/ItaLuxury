import type { Config } from "tailwindcss";
import withMT from "@material-tailwind/react/utils/withMT";
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/@material-tailwind/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/@material-tailwind/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      screens: {
        sm: "1700px",
      },
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primaryColor: "#212E53",
        secondaryColor: "#BEC4D4",
        lightBeige: "#F0EDD4",
        lightBlack: "#22222280",
        TopBanner: "#53366e",
        blueColor: "#7C88A9",
        pinkColor: "#CE6A6B",
        lightBlue: "#BED3C3"
      },
    },
  },
  plugins: [],
};
const withMaterialTailwind = withMT(config);

export default withMaterialTailwind;
