export type TourCta = { label: string; href: string };

export type TourStep = {
  title: string;
  text: string;
  /** data-tour value of the real element to spotlight, if any exists on a reachable page. */
  highlight?: string;
  /** Path to navigate to before this step is shown (only if not already there). */
  navigateTo?: string;
  ctas?: TourCta[];
};

export const FARMER_STEPS: TourStep[] = [
  {
    title: "Make your free account",
    text: "Tap “List Your Farm” up top to get started.",
    highlight: "nav-list-farm",
  },
  {
    title: "Fill in your details",
    text: "Add your name, email, and a password. Then tap Sign Up.",
    navigateTo: "/signup",
    highlight: "signup-submit",
  },
  {
    title: "Say you're a farmer",
    text: "Once you're signed in, tap “Become a Model Farmer” on your dashboard. Add your WhatsApp number so visitors can reach you.",
  },
  {
    title: "Add your farm & prices",
    text: "Give your farm a name and a few photos. Set a price for a visit and a price for training.",
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
    text: "Tap “Find a Farm” up top to see what's out there.",
    highlight: "nav-find-farm",
  },
  {
    title: "Search & filter",
    text: "Search by name, or pick a category like School Farm or Family Farm.",
    navigateTo: "/farms",
    highlight: "farms-search",
  },
  {
    title: "Pick a farm",
    text: "Tap any farm card to see its photos, videos, prices, and hours.",
    highlight: "farms-results",
  },
  {
    title: "Book your visit",
    text: "On a farm's page, tap “Book a Visit.” It opens WhatsApp with a message all ready to send!",
  },
  {
    title: "Learn and have fun",
    text: "Go meet real farmers and see how they grow food. Have fun out there!",
    ctas: [{ label: "Browse Farms", href: "/farms" }],
  },
];

export const BOTH_STEPS: TourStep[] = [
  {
    title: "Two ways to use Shamba Spot",
    text: "You can list your own farm, or go visit other farms. You can even do both!",
  },
  {
    title: "List your farm",
    text: "Tap “List Your Farm,” sign up, add your farm, and set your prices.",
    highlight: "nav-list-farm",
  },
  {
    title: "Visit a farm",
    text: "Search or filter by category, then pick a farm and book on WhatsApp.",
    navigateTo: "/farms",
    highlight: "farms-search",
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
