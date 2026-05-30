import { mkdirSync, writeFileSync, rmSync } from "node:fs";

// Match Keystatic / @sindresorhus/slugify closely enough for seed filenames.
const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const write = (path, obj) =>
  writeFileSync(path, JSON.stringify(obj, null, 2) + "\n");

rmSync("content", { recursive: true, force: true });
mkdirSync("content/services", { recursive: true });
mkdirSync("content/reviews", { recursive: true });
mkdirSync("content/faqs", { recursive: true });

// --- Services (order preserves the original display order) ----------------
const services = [
  { title: "Dog Day Care", short: "Day Care", tagline: "Most popular", feature: true, icon: "sun",
    excerpt: "Supervised, social days out on our secure 4-acre private woodland — so your dog comes home happy and tired, not bored and lonely.",
    intro: "A proper day out for your dog. Small, carefully matched groups, constant supervision and acres of secure woodland to explore, sniff and play. Vet-nurse led, so health and safety come first — every single day.",
    highlights: ["Secure 4-acre private woodland","Small, temperament-matched groups","Constant qualified supervision","Free collection & drop-off in our local areas","Photo updates so you never miss a moment","Free trial day to see if it's the right fit"] },
  { title: "Home Boarding", short: "Home Boarding", tagline: "Holidays sorted", feature: false, icon: "home",
    excerpt: "A real home from home while you're away — no kennels, no cages, just a warm bed, familiar routine and a family that dotes on your dog.",
    intro: "Licensed home boarding in a genuine family home, not a kennel. Your dog keeps their routine, sleeps somewhere cosy and is treated as one of the family — so you can relax knowing they're safe, settled and loved.",
    highlights: ["Licensed home boarding — no kennels","One family, fully focused on your dog","Familiar routines, walks and feeding kept the same","Daily photo & video updates","Meet & greet before every stay","Fully insured and DBS checked"] },
  { title: "Dog Walking", short: "Dog Walking", tagline: "Rain or shine", feature: false, icon: "paw",
    excerpt: "Reliable solo and small-group walks that keep your dog fit, stimulated and content while you're at work or busy.",
    intro: "Dependable, insured dog walking tailored to your dog. Whether they need a calm solo stroll or a sociable group adventure, we keep them active, happy and safe — with a key-safe service so it fits seamlessly around your day.",
    highlights: ["Solo or small-group walks to suit your dog","Flexible scheduling around your work day","Secure key handling & lock-up service","GPS-tracked routes on request","Towel-dry and fresh water on return","Fully insured & DBS checked walkers"] },
  { title: "Dog Training", short: "Training", tagline: "", feature: false, icon: "star",
    excerpt: "Kind, reward-based training that builds confidence and good manners — from playful puppies to dogs who need a little extra help.",
    intro: "Positive, reward-based training that works with your dog, not against them. From puppy foundations and recall to lead manners and confidence building, we give you practical, lasting results — and a calmer, happier dog.",
    highlights: ["Reward-based, force-free methods","Puppy foundations & socialisation","Recall, lead walking & manners","Confidence building for nervous dogs","1-to-1 sessions tailored to your goals","Support and guidance between sessions"] },
  { title: "Dog Grooming", short: "Grooming", tagline: "", feature: false, icon: "scissors",
    excerpt: "Gentle, stress-free grooming that leaves your dog looking and feeling their best — from a quick tidy to a full spa day.",
    intro: "Calm, caring grooming at a pace your dog is comfortable with. Bath, brush, nails, ears and full breed-standard styling — all delivered with patience and plenty of fuss, so grooming day becomes something to look forward to.",
    highlights: ["Bath, brush, blow-dry & de-shed","Nail trim, ear clean & sanitary tidy","Full breed-standard styling","Gentle handling for anxious dogs","Premium, skin-kind products","Flexible appointments to suit you"] },
];
services.forEach((s, i) => {
  write(`content/services/${slugify(s.title)}.json`, { ...s, order: i + 1 });
});

// --- Reviews --------------------------------------------------------------
const reviews = [
  { name: "Sarah & Bramble", where: "Farnham", text: "Our cockapoo absolutely bolts to the door on day care mornings. He comes home happy, tired and so well looked after. The photo updates make my day every time." },
  { name: "James & Luna", where: "Fleet", text: "We were so nervous leaving our rescue for boarding, but the meet & greet put us at ease. He was treated like one of the family — no kennels, just a real home." },
  { name: "Priya & Otis", where: "Guildford", text: "Reliable, professional and genuinely lovely with the dogs. The 4-acre woodland walks are a world away from a quick lead walk round the block. Couldn't recommend more." },
  { name: "Mark & Daisy", where: "Aldershot", text: "Vet-nurse led really shows — they spotted a sore paw before we even noticed. That peace of mind is worth everything. Five stars isn't enough." },
  { name: "Hannah & Bear", where: "Camberley", text: "The training sessions transformed our pup's recall in weeks. Kind, patient and full of practical tips we still use every day." },
  { name: "Tom & Willow", where: "Godalming", text: "Grooming day used to be stressful — now our anxious spaniel is calm and comes back looking gorgeous. They take it at her pace, every time." },
];
reviews.forEach((r) => write(`content/reviews/${slugify(r.name)}.json`, r));

// --- FAQs -----------------------------------------------------------------
const faqs = [
  { question: "Do you offer a free trial day?", answer: "Yes. Every new dog starts with a free meet & greet and trial day so we can make sure day care is the right fit — with no pressure and no cost." },
  { question: "Are you licensed and insured?", answer: "Absolutely. We're fully licensed for day care and home boarding, fully insured, and DBS checked. We're happy to share our paperwork at any time." },
  { question: "Which areas do you cover?", answer: "We cover Surrey & Hampshire including Farnham, Aldershot, Fleet, Farnborough, Camberley, Guildford, Godalming and surrounding villages. Free collection & drop-off is available in our local area." },
  { question: "What vaccinations does my dog need?", answer: "Dogs need to be up to date with their core vaccinations (and we recommend kennel cough). We'll confirm everything during your meet & greet." },
  { question: "Do you take puppies and older dogs?", answer: "We welcome dogs of all ages. Groups are matched by temperament and energy, and our quieter spaces suit older dogs or those who prefer a calmer day." },
  { question: "How do I book?", answer: "Call or message us, or fill in the booking form and we'll be in touch the same day to arrange your free meet & greet." },
];
faqs.forEach((f) => write(`content/faqs/${slugify(f.question)}.json`, f));

// --- Singletons -----------------------------------------------------------
write("content/settings.json", {
  tagline: "Premium Dog Day Care, Boarding & Walking in Surrey & Hampshire",
  description: "Vet-nurse-led, fully licensed dog day care, home boarding, walking, training and grooming across Surrey & Hampshire. Secure 4-acre private woodland. Book a free trial day.",
  phoneDisplay: "07903 555424",
  phoneNumber: "07903555424",
  whatsappNumber: "447903555424",
  email: "hello@taketheleadservices.co.uk",
  facebook: "https://www.facebook.com/taketheleadservices",
  instagram: "https://www.instagram.com/taketheleadservices",
  areasLabel: "Surrey & Hampshire",
  hours: [
    { day: "Monday – Friday", time: "7:00am – 7:00pm" },
    { day: "Saturday", time: "8:00am – 5:00pm" },
    { day: "Sunday", time: "By arrangement" },
  ],
});

write("content/areas.json", {
  list: ["Farnham","Aldershot","Fleet","Farnborough","Camberley","Guildford","Godalming","Haslemere","Frimley","Yateley","Hindhead","Surrounding villages"],
});

console.log("Content files generated.");
