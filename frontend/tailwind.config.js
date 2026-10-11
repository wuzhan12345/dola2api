import animate from "tailwindcss-animate";

// RGB channels let opacity utilities work without OKLCH or color-mix support.
const tokens = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "border",
  "input",
  "ring",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "quota-product-0",
  "quota-product-1",
  "quota-product-2",
  "quota-product-3",
  "quota-product-4",
  "quota-product-5",
  "quota-product-6",
];

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: Object.fromEntries(
        tokens.map((name) => [name, `rgb(var(--${name}-rgb) / <alpha-value>)`]),
      ),
      opacity: Object.fromEntries(Array.from({ length: 101 }, (_, n) => [n, String(n / 100)])),
      borderRadius: {
        sm: "calc(var(--radius) - 2px)",
        md: "var(--radius)",
        lg: "calc(var(--radius) + 2px)",
      },
    },
  },
  plugins: [animate],
};
