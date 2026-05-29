// ---------------------------------------------------------------------------
// Central site configuration. Edit business details, nav, and services here.
// ---------------------------------------------------------------------------

export const site = {
  name: "Take The Lead Services",
  shortName: "Take The Lead",
  tagline: "Premium Dog Day Care, Boarding & Walking in Surrey & Hampshire",
  description:
    "Vet-nurse-led, fully licensed dog day care, home boarding, walking, training and grooming across Surrey & Hampshire. Secure 4-acre private woodland. Book a free trial day.",
  url: "https://www.taketheleadservices.co.uk",

  // --- Contact details --------------------------------------------------
  phoneDisplay: "07903 555424",
  phoneHref: "tel:07903555424",
  // WhatsApp uses the international format without the leading 0.
  whatsappHref: "https://wa.me/447903555424",
  email: "hello@taketheleadservices.co.uk",
  emailHref: "mailto:hello@taketheleadservices.co.uk",

  areasLabel: "Surrey & Hampshire",
  hours: [
    { day: "Monday – Friday", time: "7:00am – 7:00pm" },
    { day: "Saturday", time: "8:00am – 5:00pm" },
    { day: "Sunday", time: "By arrangement" },
  ],

  // --- Trust / credentials ---------------------------------------------
  credentials: [
    "Fully Licensed",
    "Fully Insured",
    "DBS Checked",
    "Vet-Nurse Led",
    "5★ Rated",
  ],

  // --- Social ----------------------------------------------------------
  social: {
    facebook: "https://www.facebook.com/taketheleadservices",
    instagram: "https://www.instagram.com/taketheleadservices",
  },
} as const;

// --- Areas covered (chips) ----------------------------------------------
export const areas: string[] = [
  "Farnham",
  "Aldershot",
  "Fleet",
  "Farnborough",
  "Camberley",
  "Guildford",
  "Godalming",
  "Haslemere",
  "Frimley",
  "Yateley",
  "Hindhead",
  "Surrounding villages",
];

// --- Services -----------------------------------------------------------
export type Service = {
  slug: string;
  title: string;
  short: string; // card / nav label
  tagline: string; // small uppercase tag on the card
  excerpt: string; // card description
  feature?: boolean; // highlight card on the homepage
  icon: string; // key into Icon component
  intro: string; // hero paragraph on the service page
  highlights: string[]; // bullet benefits on the service page
};

export const services: Service[] = [
  {
    slug: "dog-day-care",
    title: "Dog Day Care",
    short: "Day Care",
    tagline: "Most popular",
    feature: true,
    icon: "sun",
    excerpt:
      "Supervised, social days out on our secure 4-acre private woodland — so your dog comes home happy and tired, not bored and lonely.",
    intro:
      "A proper day out for your dog. Small, carefully matched groups, constant supervision and acres of secure woodland to explore, sniff and play. Vet-nurse led, so health and safety come first — every single day.",
    highlights: [
      "Secure 4-acre private woodland",
      "Small, temperament-matched groups",
      "Constant qualified supervision",
      "Free collection & drop-off in our local areas",
      "Photo updates so you never miss a moment",
      "Free trial day to see if it's the right fit",
    ],
  },
  {
    slug: "home-boarding",
    title: "Home Boarding",
    short: "Home Boarding",
    tagline: "Holidays sorted",
    icon: "home",
    excerpt:
      "A real home from home while you're away — no kennels, no cages, just a warm bed, familiar routine and a family that dotes on your dog.",
    intro:
      "Licensed home boarding in a genuine family home, not a kennel. Your dog keeps their routine, sleeps somewhere cosy and is treated as one of the family — so you can relax knowing they're safe, settled and loved.",
    highlights: [
      "Licensed home boarding — no kennels",
      "One family, fully focused on your dog",
      "Familiar routines, walks and feeding kept the same",
      "Daily photo & video updates",
      "Meet & greet before every stay",
      "Fully insured and DBS checked",
    ],
  },
  {
    slug: "dog-walking",
    title: "Dog Walking",
    short: "Dog Walking",
    tagline: "Rain or shine",
    icon: "paw",
    excerpt:
      "Reliable solo and small-group walks that keep your dog fit, stimulated and content while you're at work or busy.",
    intro:
      "Dependable, insured dog walking tailored to your dog. Whether they need a calm solo stroll or a sociable group adventure, we keep them active, happy and safe — with a key-safe service so it fits seamlessly around your day.",
    highlights: [
      "Solo or small-group walks to suit your dog",
      "Flexible scheduling around your work day",
      "Secure key handling & lock-up service",
      "GPS-tracked routes on request",
      "Towel-dry and fresh water on return",
      "Fully insured & DBS checked walkers",
    ],
  },
  {
    slug: "dog-training",
    title: "Dog Training",
    short: "Training",
    icon: "star",
    excerpt:
      "Kind, reward-based training that builds confidence and good manners — from playful puppies to dogs who need a little extra help.",
    intro:
      "Positive, reward-based training that works with your dog, not against them. From puppy foundations and recall to lead manners and confidence building, we give you practical, lasting results — and a calmer, happier dog.",
    highlights: [
      "Reward-based, force-free methods",
      "Puppy foundations & socialisation",
      "Recall, lead walking & manners",
      "Confidence building for nervous dogs",
      "1-to-1 sessions tailored to your goals",
      "Support and guidance between sessions",
    ],
  },
  {
    slug: "dog-grooming",
    title: "Dog Grooming",
    short: "Grooming",
    icon: "scissors",
    excerpt:
      "Gentle, stress-free grooming that leaves your dog looking and feeling their best — from a quick tidy to a full spa day.",
    intro:
      "Calm, caring grooming at a pace your dog is comfortable with. Bath, brush, nails, ears and full breed-standard styling — all delivered with patience and plenty of fuss, so grooming day becomes something to look forward to.",
    highlights: [
      "Bath, brush, blow-dry & de-shed",
      "Nail trim, ear clean & sanitary tidy",
      "Full breed-standard styling",
      "Gentle handling for anxious dogs",
      "Premium, skin-kind products",
      "Flexible appointments to suit you",
    ],
  },
];

export const getService = (slug: string) =>
  services.find((s) => s.slug === slug);

// --- Primary navigation -------------------------------------------------
export const nav = [
  { label: "Day Care", href: "/dog-day-care/" },
  { label: "Home Boarding", href: "/home-boarding/" },
  { label: "Walking", href: "/dog-walking/" },
  { label: "Training", href: "/dog-training/" },
  { label: "Grooming", href: "/dog-grooming/" },
  { label: "About", href: "/about/" },
];
