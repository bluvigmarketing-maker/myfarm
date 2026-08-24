export type TourCta = { label: string; href: string };

export type TourStep = {
  title: string;
  text: string;
  ctas?: TourCta[];
};

export const FARMER_STEPS: TourStep[] = [
  {
    title: "Make your free account",
    text: "First, sign up. It only takes a minute!",
  },
  {
    title: "Say you're a farmer",
    text: "In your dashboard, tap “Become a Model Farmer.” Add your WhatsApp number so visitors can reach you.",
  },
  {
    title: "Add your farm",
    text: "Give your farm a name and a few photos. Pick a category too, like School Farm or Family Farm.",
  },
  {
    title: "Set your prices",
    text: "Pick a price for a visit and a price for training. Flip your farm Open or Closed any time you like.",
  },
  {
    title: "You're ready!",
    text: "Visitors can now find your farm and message you on WhatsApp. Let's get you online!",
    ctas: [{ label: "Sign Up Now", href: "/signup" }],
  },
];

export const LEARNER_STEPS: TourStep[] = [
  {
    title: "Find a farm",
    text: "Tap “Find a Farm” to see farms near you. You can search by name or pick a category.",
  },
  {
    title: "Open a farm page",
    text: "Click any farm to see its photos, videos, prices, and open hours.",
  },
  {
    title: "Book your visit",
    text: "Tap “Book a Visit.” It opens WhatsApp with a message all ready to send!",
  },
  {
    title: "Learn and have fun",
    text: "Go meet real farmers and see how they grow food. Have fun out there!",
    ctas: [{ label: "Browse Farms", href: "/farms" }],
  },
];

export const BOTH_STEPS: TourStep[] = [
  {
    title: "Two ways to use FarmVisit",
    text: "You can list your own farm, or go visit other farms. You can even do both!",
  },
  {
    title: "List your farm",
    text: "Sign up, add your farm, set your prices, and go Open when you're ready.",
  },
  {
    title: "Visit a farm",
    text: "Browse farms, pick one you like, and book a visit on WhatsApp.",
  },
  {
    title: "Ready to start?",
    text: "Pick whichever you want to do first. You can always try the other one later!",
    ctas: [
      { label: "Sign Up", href: "/signup" },
      { label: "Browse Farms", href: "/farms" },
    ],
  },
];

export type TourPath = "farmer" | "learner" | "both";

export function stepsForPath(path: TourPath): TourStep[] {
  if (path === "farmer") return FARMER_STEPS;
  if (path === "learner") return LEARNER_STEPS;
  return BOTH_STEPS;
}
