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
import { optimise } from "./images";

const reader = createReader(process.cwd(), keystaticConfig);

// Values that aren't client-editable live here.
const CONST = {
  name: "Take The Lead Services",
  shortName: "Take The Lead",
  url: "https://www.taketheleadservices.co.uk",
  credentials: [
    "5★ Licensed Daycare",
    "Petplan Sanctuary Insured",
    "DBS Checked",
    "Vet-Nurse Led",
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
  seoArea: string;
  prices: { label: string; price: string; detail: string }[];
  areas: string[];
  notes: string[];
  bookingUrl: string;
  gallery: { src: string; caption: string }[];
  workshop: Workshop | null;
};

export type Workshop = {
  title: string;
  subtitle: string;
  intro: string;
  date: string;
  time: string;
  price: string;
  places: string;
  location: string;
  points: string[];
  tagline: string;
  bookingLabel: string;
  photo: string;
  logo: string;
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
  training: { phoneDisplay: string; phoneHref: string; email: string; emailHref: string };
  address: string;
  salonAddress: string;
  boardingLicence: string;
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
    whatsappHref: s?.whatsappNumber
      ? `https://wa.me/${s.whatsappNumber.replace(/\D/g, "")}`
      : "",
    email: s?.email || "",
    emailHref: `mailto:${s?.email || ""}`,
    training: {
      phoneDisplay: s?.trainingPhoneDisplay || "",
      phoneHref: `tel:${(s?.trainingPhoneNumber || "").replace(/\s+/g, "")}`,
      email: s?.trainingEmail || "",
      emailHref: `mailto:${s?.trainingEmail || ""}`,
    },
    address: s?.address || "",
    salonAddress: s?.salonAddress || "",
    boardingLicence: s?.boardingLicence || "",
    areasLabel: s?.areasLabel || "",
    hours: (s?.hours || []).map((h) => ({ day: h.day, time: h.time })),
    credentials: CONST.credentials,
    social: {
      facebook: s?.facebook || "",
      instagram: s?.instagram || "",
    },
  };
  return _settings;
}

let _services: Service[] | null = null;

export async function getServices(): Promise<Service[]> {
  if (_services) return _services;
  const entries = await reader.collections.services.all();
  const withPhotos = await Promise.all(
    entries.map(async ({ slug, entry }) => ({
      slug,
      entry,
      photo: await optimise(entry.photo, 1000),
      workshop: entry.workshop?.title
        ? {
            title: entry.workshop.title,
            subtitle: entry.workshop.subtitle || "",
            intro: entry.workshop.intro || "",
            date: entry.workshop.date || "",
            time: entry.workshop.time || "",
            price: entry.workshop.price || "",
            places: entry.workshop.places || "",
            location: entry.workshop.location || "",
            points: [...(entry.workshop.points || [])],
            tagline: entry.workshop.tagline || "",
            bookingLabel: entry.workshop.bookingLabel || "Book your spot",
            photo: await optimise(entry.workshop.photo, 900),
            logo: await optimise(entry.workshop.logo, 240),
          }
        : null,
      gallery: await Promise.all(
        (entry.gallery || [])
          .filter((g) => g.src)
          .map(async (g) => ({ src: await optimise(g.src, 600), caption: g.caption || "" }))
      ),
    }))
  );
  _services = withPhotos
    .map(({ slug, entry, photo, gallery, workshop }) => ({
      slug,
      title: entry.title,
      short: entry.short || entry.title,
      tagline: entry.tagline || "",
      excerpt: entry.excerpt || "",
      feature: Boolean(entry.feature),
      icon: entry.icon || "paw",
      intro: entry.intro || "",
      highlights: [...(entry.highlights || [])],
      photo,
      pricingNote: entry.pricingNote || "",
      seoArea: entry.seoArea || "",
      prices: (entry.prices || []).map((p) => ({
        label: p.label,
        price: p.price,
        detail: p.detail || "",
      })),
      areas: [...(entry.areas || [])],
      notes: [...(entry.notes || [])],
      bookingUrl: entry.bookingUrl || "",
      gallery,
      workshop,
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
  const withPhotos = await Promise.all(
    entries.map(async ({ entry }) => ({ entry, photo: await optimise(entry.photo, 700) }))
  );
  _teamMembers = withPhotos
    .map(({ entry, photo }) => ({
      name: entry.name,
      role: entry.role || "",
      bio: entry.bio || "",
      photo,
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
    { label: "Reviews", href: "/reviews/" },
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

export type Faq = { q: string; a: string; category: string };

export async function getFaqs(): Promise<Faq[]> {
  const entries = await reader.collections.faqs.all();
  return entries
    .map(({ entry }) => ({
      q: entry.question,
      a: entry.answer,
      category: entry.category || "General",
      order: entry.order ?? 50,
    }))
    .sort(byOrder)
    .map(({ order, ...rest }) => rest);
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
export async function getFaqsPage() {
  return await reader.singletons.faqsPage.read();
}
export async function getStylishDog() {
  return await reader.singletons.stylishDog.read();
}
export async function getTerms() {
  return await reader.singletons.terms.read();
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
    heroMain: await optimise(pick(cms?.heroMain, defaultImages.heroMain), 1200),
    whyTall: await optimise(pick(cms?.whyTall, defaultImages.whyTall), 800),
    whySquare1: await optimise(pick(cms?.whySquare1, defaultImages.whySquare1), 600),
    whySquare2: await optimise(pick(cms?.whySquare2, defaultImages.whySquare2), 600),
    about: await optimise(pick(cms?.about, defaultImages.about), 1000),
    // Social networks are pickiest about formats, so keep the share image a JPEG.
    og: await optimise(pick(cms?.og, defaultImages.og), 1200, "jpg"),
  };
}
