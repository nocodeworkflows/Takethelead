import { mkdirSync, writeFileSync, existsSync } from "node:fs";

// ADDITIVE seed: only writes files that don't already exist, so it never
// overwrites content edited via the CMS. Safe to re-run.

const writeIfMissing = (path, obj) => {
  if (existsSync(path)) {
    console.log("skip (exists):", path);
    return;
  }
  writeFileSync(path, JSON.stringify(obj, null, 2) + "\n");
  console.log("created:", path);
};

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

for (const d of ["content/trust-items", "content/steps", "content/why-features"]) {
  mkdirSync(d, { recursive: true });
}

// --- Trust badges (dark strip) -------------------------------------------
[
  { label: "Fully Licensed & Insured", icon: "shield" },
  { label: "Vet-Nurse Led", icon: "heart" },
  { label: "DBS Checked", icon: "check" },
  { label: "Secure 4-Acre Woodland", icon: "tree" },
  { label: "5★ Rated Locally", icon: "star" },
].forEach((t, i) =>
  writeIfMissing(`content/trust-items/${slugify(t.label)}.json`, { ...t, order: i + 1 })
);

// --- How it works (steps) ------------------------------------------------
[
  { title: "Get in touch", icon: "phone", text: "Tell us about your dog and what you need. We'll answer your questions and recommend the right service." },
  { title: "Free meet & greet", icon: "heart", text: "We meet you and your dog so everyone's comfortable, then book a free trial day to make sure it's the perfect fit." },
  { title: "Relax — they're in safe hands", icon: "pawprint", text: "Your dog joins the family. You get photo updates and total peace of mind while they play, rest and thrive." },
].forEach((s, i) =>
  writeIfMissing(`content/steps/${slugify(s.title)}.json`, { ...s, order: i + 1 })
);

// --- Why us (feature tiles) ----------------------------------------------
[
  { title: "Vet-nurse led & fully licensed", icon: "shield", text: "Qualified, insured and DBS-checked. Your dog's health and safety always comes first." },
  { title: "Secure 4-acre private woodland", icon: "tree", text: "Acres of fully-enclosed space to explore, sniff and play — not a concrete yard." },
  { title: "Small, matched groups", icon: "heart", text: "We pair dogs by temperament and size so every day is calm, safe and genuinely fun." },
  { title: "Daily photo updates", icon: "camera", text: "See exactly how your dog's day is going. You'll never miss a happy muddy moment." },
].forEach((f, i) =>
  writeIfMissing(`content/why-features/${slugify(f.title)}.json`, { ...f, order: i + 1 })
);

// --- Homepage singleton --------------------------------------------------
writeIfMissing("content/homepage.json", {
  heroEyebrow: "Family-run · Vet-nurse led",
  heroHeading: "Day care your dog *can't wait* to get to.",
  heroLead:
    "Premium, fully-licensed dog day care, home boarding, walking, training & grooming across Surrey & Hampshire — with a secure 4-acre private woodland and a team that genuinely loves dogs.",
  heroBadges: ["5★ Licensed Daycare", "Fully Insured", "DBS Checked"],
  ratingText: "Loved by hundreds of local dog owners",
  floatTopNumber: "4",
  floatTopLabel: "Acre Woodland",
  floatCardTitle: "Free trial day",
  floatCardText: "See if it's the right fit — no cost",
  servicesEyebrow: "What we do",
  servicesHeading: "Everything your dog needs, all in one place",
  servicesIntro:
    "From day care and holidays to walks, training and grooming — premium care, delivered with genuine love.",
  whyEyebrow: "Why Take The Lead",
  whyHeading: "More than day care — a second family",
  whyIntro:
    "We treat every dog as if they were our own. That means proper space to run, qualified eyes watching over them, and small groups where everyone feels safe.",
  howEyebrow: "How it works",
  howHeading: "Getting started is easy",
  howIntro: "Three simple steps to a happier dog and a free trial day.",
  areasEyebrow: "Where we work",
  areasHeading: "Proudly serving Surrey & Hampshire",
  areasIntro:
    "Based in the heart of the Surrey–Hampshire border, with free collection & drop-off across our local area. Not sure if we cover you? Just ask.",
  areaCardTitle: "Free local collection & drop-off",
  areaCardText: "Save time on busy mornings — we'll come to you.",
  areaCardRows: [
    { icon: "pin", text: "Surrey & Hampshire border" },
    { icon: "clock", text: "Flexible morning & evening slots" },
    { icon: "tree", text: "Days out on secure 4-acre woodland" },
    { icon: "camera", text: "Daily photo updates included" },
  ],
});

// --- About singleton -----------------------------------------------------
writeIfMissing("content/about.json", {
  heroEyebrow: "Our story",
  heroHeading: "Dog people, *through and through*",
  heroLead:
    "Take The Lead Services is a family-run, vet-nurse-led dog care business on the Surrey–Hampshire border. We started with one simple belief: that every dog deserves to be treated like one of the family.",
  bodyEyebrow: "Who we are",
  bodyHeading: "Premium care, genuine love",
  bodyParagraphs: [
    "What began as a passion for dogs has grown into a fully-licensed home for day care, boarding, walking, training and grooming — all built around the wellbeing of the dogs in our care.",
    "Being vet-nurse led sets us apart. It means there's always a trained eye on health and safety, from spotting an early limp to managing medication with total confidence. Combined with our secure 4-acre private woodland, it's care you can genuinely trust.",
    "We keep our groups small and carefully matched, so every dog — whether a bouncy puppy or a wise older soul — has a calm, safe and happy day.",
  ],
  promiseEyebrow: "Our promise",
  promiseHeading: "What every dog gets with us",
  ctaTitle: "Come and meet us",
  ctaText:
    "The best way to see what makes us different is to visit. Book a free meet & greet today.",
});

// --- Contact page singleton ----------------------------------------------
writeIfMissing("content/contact-page.json", {
  heroEyebrow: "Let's chat",
  heroHeading: "Book a *free trial day*",
  heroLead:
    "Ready to give your dog the best day out? Send us a message or give us a call — we'll get back to you the same day to arrange your free meet & greet.",
  sideEyebrow: "Get in touch",
  sideHeading: "We'd love to hear about your dog",
  sideText:
    "However you like to chat, we're here. No pushy sales — just honest, friendly advice.",
});

// --- CTA band singleton --------------------------------------------------
writeIfMissing("content/cta.json", {
  title: "Ready to give your dog the best day out?",
  text: "Book a free meet & greet and trial day — no pressure, no cost. See why local dogs love it here.",
  primaryLabel: "Book a Free Trial",
});

// --- Images singleton ----------------------------------------------------
// Blank = use the code default in src/data/images.ts.
writeIfMissing("content/images.json", {
  heroMain: "",
  whyTall: "",
  whySquare1: "",
  whySquare2: "",
  about: "",
  og: "",
});

console.log("Additive seed complete.");
