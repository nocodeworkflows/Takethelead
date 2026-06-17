// ---------------------------------------------------------------------------
// Build-time content read layer.
//
// Reads content authored in Keystatic (files under /content) via the Keystatic
// Reader and returns the same shapes the components already expect, so the
// rest of the site barely changed when the CMS was added.
//
// These run at build time (marketing pages are prerendered), so node fs access
// via the Reader is fine.
// ---------------------------------------------------------------------------
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";
import { images as defaultImages } from "../data/images";

const reader = createReader(process.cwd(), keystaticConfig);

// Values that aren't client-editable live here.
const CONST = {
  name: "Take The Lead Services",
  shortName: "Take The Lead",
  url: "https://www.taketheleadservices.co.uk",
  credentials: [
    "Fully Licensed",
    "Fully Insured",
    "DBS Checked",
    "Vet-Nurse Led",
    "5★ Rated",
  ],
};

export type Service = {
  slug: string;
  title: string;
  short: string;
  tagline: string;
  excerpt: string;
  feature: boolean;
  icon: string;
  intro: string;
  highlights: string[];
  photo: string;
  pricingNote: string;
};

export type SiteSettings = {
  name: string;
  shortName: string;
  url: string;
  tagline: string;
  description: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsappHref: string;
  email: string;
  emailHref: string;
  areasLabel: string;
  hours: { day: string; time: string }[];
  credentials: string[];
  social: { facebook: string; instagram: string };
};

let _settings: SiteSettings | null = null;

export async function getSiteSettings(): Promise<SiteSettings> {
  if (_settings) return _settings;
  const s = await reader.singletons.settings.read();
  const phoneNumber = (s?.phoneNumber || "").replace(/\s+/g, "");
  _settings = {
    name: CONST.name,
    shortName: CONST.shortName,
    url: CONST.url,
    tagline: s?.tagline || "",
    description: s?.description || "",
    phoneDisplay: s?.phoneDisplay || "",
    phoneHref: `tel:${phoneNumber}`,
    whatsappHref: `https://wa.me/${(s?.whatsappNumber || "").replace(/\D/g, "")}`,
    email: s?.email || "",
    emailHref: `mailto:${s?.email || ""}`,
    areasLabel: s?.areasLabel || "",
    hours: (s?.hours || []).map((h) => ({ day: h.day, time: h.time })),
    credentials: CONST.credentials,
    social: {
      facebook: s?.facebook || "#",
      instagram: s?.instagram || "#",
    },
  };
  return _settings;
}

let _services: Service[] | null = null;

export async function getServices(): Promise<Service[]> {
  if (_services) return _services;
  const entries = await reader.collections.services.all();
  _services = entries
    .map(({ slug, entry }) => ({
      slug,
      title: entry.title,
      short: entry.short || entry.title,
      tagline: entry.tagline || "",
      excerpt: entry.excerpt || "",
      feature: Boolean(entry.feature),
      icon: entry.icon || "paw",
      intro: entry.intro || "",
      highlights: [...(entry.highlights || [])],
      photo: entry.photo || "",
      pricingNote: entry.pricingNote || "",
      order: entry.order ?? 99,
    }))
    .sort((a, b) => a.order - b.order)
    .map(({ order, ...rest }) => rest);
  return _services;
}

export async function getService(slug: string): Promise<Service | undefined> {
  return (await getServices()).find((s) => s.slug === slug);
}

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  photo: string;
};

let _teamMembers: TeamMember[] | null = null;

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (_teamMembers) return _teamMembers;
  const entries = await reader.collections.teamMembers.all();
  _teamMembers = entries
    .map(({ entry }) => ({
      name: entry.name,
      role: entry.role || "",
      bio: entry.bio || "",
      photo: entry.photo || "",
      order: entry.order ?? 99,
    }))
    .sort((a, b) => a.order - b.order)
    .map(({ order, ...rest }) => rest);
  return _teamMembers;
}

export type NavLink = { label: string; href: string };
export type NavItem = NavLink & { children?: NavLink[] };

export async function getNav(): Promise<NavItem[]> {
  const services = await getServices();
  return [
    {
      label: "Services",
      href: "/#services",
      children: services.map((s) => ({ label: s.short, href: `/${s.slug}/` })),
    },
    { label: "About", href: "/about/" },
    { label: "Facilities", href: "/facilities/" },
    { label: "Team", href: "/team/" },
    { label: "FAQs", href: "/faqs/" },
  ];
}

export async function getAreas(): Promise<string[]> {
  const a = await reader.singletons.areas.read();
  return [...(a?.list || [])];
}

export type Review = { text: string; name: string; where: string; initial: string };

export async function getReviews(): Promise<Review[]> {
  const entries = await reader.collections.reviews.all();
  return entries.map(({ entry }) => ({
    name: entry.name,
    where: entry.where || "",
    text: entry.text,
    initial: (entry.name || "?").trim().charAt(0).toUpperCase(),
  }));
}

export type Faq = { q: string; a: string };

export async function getFaqs(): Promise<Faq[]> {
  const entries = await reader.collections.faqs.all();
  return entries.map(({ entry }) => ({ q: entry.question, a: entry.answer }));
}

// --- Icon + text collections (trust badges, steps, why features) ----------
export type IconText = { icon: string; title: string; text: string };

const byOrder = <T extends { order?: number | null }>(a: T, b: T) =>
  (a.order ?? 99) - (b.order ?? 99);

export async function getTrustItems(): Promise<{ icon: string; label: string }[]> {
  const entries = await reader.collections.trustItems.all();
  return entries
    .map(({ entry }) => ({ icon: entry.icon || "check", label: entry.label, order: entry.order }))
    .sort(byOrder)
    .map(({ order, ...rest }) => rest);
}

export async function getSteps(): Promise<IconText[]> {
  const entries = await reader.collections.steps.all();
  return entries
    .map(({ entry }) => ({ icon: entry.icon || "paw", title: entry.title, text: entry.text || "", order: entry.order }))
    .sort(byOrder)
    .map(({ order, ...rest }) => rest);
}

export async function getWhyFeatures(): Promise<IconText[]> {
  const entries = await reader.collections.whyFeatures.all();
  return entries
    .map(({ entry }) => ({ icon: entry.icon || "heart", title: entry.title, text: entry.text || "", order: entry.order }))
    .sort(byOrder)
    .map(({ order, ...rest }) => rest);
}

// --- Page singletons ------------------------------------------------------
export async function getHomepage() {
  return await reader.singletons.homepage.read();
}
export async function getAboutPage() {
  return await reader.singletons.about.read();
}
export async function getContactPage() {
  return await reader.singletons.contactPage.read();
}
export async function getFacilitiesPage() {
  return await reader.singletons.facilities.read();
}
export async function getTeamPage() {
  return await reader.singletons.teamPage.read();
}
export async function getCta() {
  return await reader.singletons.cta.read();
}

// --- Images: CMS override merged over the code defaults --------------------
export async function getImages() {
  const cms = await reader.singletons.images.read();
  const pick = (override: string | null | undefined, fallback: string) =>
    override && override.trim() ? override.trim() : fallback;
  return {
    ...defaultImages,
    heroMain: pick(cms?.heroMain, defaultImages.heroMain),
    whyTall: pick(cms?.whyTall, defaultImages.whyTall),
    whySquare1: pick(cms?.whySquare1, defaultImages.whySquare1),
    whySquare2: pick(cms?.whySquare2, defaultImages.whySquare2),
    about: pick(cms?.about, defaultImages.about),
    og: pick(cms?.og, defaultImages.og),
  };
}
