// Single source of truth for every brand-specific value on the site.
// To onboard a new restaurant client, this is the only file that should
// need to change (plus swapping image assets in /public).

// Optional sections. Flip a flag to false to remove that section from the
// navbar + footer (the new-project tool sets these per client). The route
// still exists, it is simply not linked.
const FEATURES = {
  catering: true,
  giftCard: true,
  rewards: true,
  blog: true,
};
type FeatureKey = keyof typeof FEATURES;

type NavLink = { label: string; href: string; feature?: FeatureKey };

const ALL_NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/Menu" },
  { label: "Catering", href: "/catering", feature: "catering" },
  { label: "Gift Card", href: "/GiftCard", feature: "giftCard" },
  { label: "Rewards", href: "/rewards", feature: "rewards" },
  { label: "Press", href: "/Blog", feature: "blog" },
  { label: "Our Story", href: "/story" },
];

const ALL_FOOTER_LINKS: NavLink[] = [
  { label: "Menu", href: "/Menu" },
  { label: "Catering", href: "/catering", feature: "catering" },
  { label: "Gift Cards", href: "/GiftCard", feature: "giftCard" },
  { label: "Terms", href: "/terms" },
];

const enabled = (l: NavLink) => !l.feature || FEATURES[l.feature];
const pickLink = ({ label, href }: NavLink) => ({ label, href });

export const SITE_CONFIG = {
  // Brand
  name: "tintin persian food truck",
  tagline: "tintin persian food truck",
  subTagline:
    "Modern specialty coffee, handcrafted espresso drinks, premium matcha, hojicha, and fresh pastries in Diamond Bar, California.",
  legalName: "tintin persian food truck",
  trademark: "tintin persian food truck",

  // CTA
  menuCtaLabel: "Order Online",

  // Contact
  address: "123 Main St, Your City, ST 00000",
  street: "123 Main St",
  city: "Your City",
  state: "ST",
  zip: "00000",
  phone: "000-000-0000",
  email: "hello@tintin-persian-food-truck.com",
  cateringEmail: "hello@tintin-persian-food-truck.com",
  timezone: "America/Los_Angeles",

  lat: 0,
  lng: 0,

  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Grid+Coffee+Diamond+Bar",

  // Social
  instagram: "grid_coffee",
  instagramUrl: "https://www.instagram.com/grid_coffee/",
  facebookUrl: "https://www.facebook.com/GridcoffeeDB/",
  tiktokUrl: "",
  beholdFeedId: "",

  // SEO
  siteUrl: "https://tintin-persian-food-truck.vercel.app",

  seoTitle:
    "tintin persian food truck",

  seoDescription:
    "tintin persian food truck — order online.",

  seoKeywords: [
    "Grid Coffee",
    "Grid Coffee Diamond Bar",
    "Coffee Diamond Bar",
    "Specialty Coffee Diamond Bar",
    "Matcha Diamond Bar",
    "Hojicha Latte",
    "Cafe Diamond Bar",
    "Espresso Diamond Bar",
    "Coffee Shop Diamond Bar",
  ],

  ogImage: "/general/generalPages/mainImage.jpg",

  // Structured Data
  cuisines: ["Coffee", "Cafe", "Desserts", "Bakery"],
  priceRange: "$$",

  // Branding
  primaryColor: "#111111",
  secondaryColor: "#D8B26E",
  accentColor: "#7A5C3A",

  // Hours
  hours: [
    { day: "Sunday", open: 7, close: 17.5 },
    { day: "Monday", open: 7, close: 17.5 },
    { day: "Tuesday", open: 7, close: 17.5 },
    { day: "Wednesday", open: 7, close: 17.5 },
    { day: "Thursday", open: 7, close: 17.5 },
    { day: "Friday", open: 7, close: 20 },
    { day: "Saturday", open: 7, close: 20 },
  ] as { day: string; open: number | null; close: number | null }[],

  // Home
  home: {
    heroHeadline: "Specialty Coffee, Crafted Daily",

    heroSubHeadline:
      "",

    galleryTitle: "Grid Coffee",

    gallerySubtitle:
      "Modern Coffee Experience in Diamond Bar",

    distinctiveFeatures: [
      {
        title: "Specialty Coffee",
        description:
          "Every espresso shot is carefully extracted and every drink is handcrafted using premium beans and quality ingredients.",
        image: "/general/generalPages/enjoy.jpg",
      },
      {
        title: "Signature Drinks & Fresh Pastries",
        description:
          "Enjoy our handcrafted matcha, hojicha lattes, seasonal beverages, and freshly baked pastries in a modern minimalist café.",
        image: "/general/generalPages/vibe.jpg",
      },
    ],

    featuring: [
      {
        name: "Specialty Coffee",
        icon: "FaCoffee",
      },
      {
        name: "Fresh Pastries",
        icon: "GiCroissant",
      },
      {
        name: "Takeout",
        icon: "PiPackageFill",
      },
      {
        name: "Modern Café",
        icon: "MdOutlineStorefront",
      },
    ],

    faq: [
      {
        question: "What is Grid Coffee known for?",
        answer:
          "We're known for handcrafted specialty coffee, matcha, hojicha lattes, and our clean modern café experience.",
      },
      {
        question: "Do you serve food?",
        answer:
          "Yes. We offer a selection of freshly baked pastries that pair perfectly with our coffee and tea drinks.",
      },
      {
        question: "Do you offer takeout?",
        answer:
          "Absolutely. Every drink and pastry on our menu is available for takeout.",
      },
      {
        question: "Where are you located?",
        answer:
          "We're located in Diamond Bar, California, at 1139 S Diamond Bar Blvd Suite B.",
      },
    ],
  },

  features: FEATURES,

  navLinks: ALL_NAV_LINKS.filter(enabled).map(pickLink),

  footer: {
    get copyright() {
      return `© ${new Date().getFullYear()} Grid Coffee. All rights reserved.`;
    },

    links: ALL_FOOTER_LINKS.filter(enabled).map(pickLink),
  },
};
