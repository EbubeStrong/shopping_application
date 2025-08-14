import shadcnPreset from "@shadcn/ui/tailwind-preset";

export default {
  presets: [shadcnPreset],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
};
