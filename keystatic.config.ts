import { config, fields, collection, singleton } from "@keystatic/core";

// Local file editing in dev; GitHub-backed editing in production so the
// client can log in at /keystatic with GitHub and commit changes.
const storage =
  process.env.NODE_ENV === "development"
    ? ({ kind: "local" } as const)
    : ({
        kind: "github",
        repo: "nocodeworkflows/Takethelead",
      } as const);

const iconOptions = [
  { label: "Check / tick", value: "check" },
  { label: "Phone", value: "phone" },
  { label: "Mail", value: "mail" },
  { label: "Paw print (filled)", value: "pawprint" },
  { label: "Sun (day care)", value: "sun" },
  { label: "Home (boarding)", value: "home" },
  { label: "Paw", value: "paw" },
  { label: "Star (training)", value: "star" },
  { label: "Cat (cat sitting)", value: "cat" },
  { label: "Scissors (grooming)", value: "scissors" },
  { label: "Heart", value: "heart" },
  { label: "Tree / woodland", value: "tree" },
  { label: "Camera", value: "camera" },
  { label: "Leaf", value: "leaf" },
  { label: "Shield", value: "shield" },
  { label: "Clock", value: "clock" },
  { label: "Pin / location", value: "pin" },
];

const iconField = (label = "Icon", defaultValue = "paw") =>
  fields.select({ label, options: iconOptions, defaultValue });

export default config({
  storage,
  ui: {
    brand: { name: "Take The Lead" },
  },
  collections: {
    services: collection({
      label: "Services",
      slugField: "title",
      path: "content/services/*",
      format: { data: "json" },
      // Slug is derived from the title (e.g. "Dog Day Care" -> "dog-day-care")
      // which is exactly the page URL, so editors only set the title.
      schema: {
        title: fields.slug({
          name: { label: "Title", validation: { isRequired: true } },
        }),
        order: fields.integer({
          label: "Display order",
          description: "Lower numbers appear first.",
          defaultValue: 1,
        }),
        short: fields.text({ label: "Short name (nav & footer)" }),
        tagline: fields.text({ label: "Card tag (optional)" }),
        feature: fields.checkbox({
          label: "Highlight on homepage",
          defaultValue: false,
        }),
        icon: fields.select({
          label: "Icon",
          options: iconOptions,
          defaultValue: "paw",
        }),
        excerpt: fields.text({ label: "Card description", multiline: true }),
        intro: fields.text({ label: "Service page intro", multiline: true }),
        highlights: fields.array(
          fields.text({ label: "Highlight" }),
          { label: "What's included", itemLabel: (p) => p.value }
        ),
        photo: fields.text({
          label: "Service photo URL (optional)",
          description:
            "Full image URL. Leave blank to use the default site photo.",
        }),
        pricingNote: fields.text({
          label: "Pricing note (optional)",
          multiline: true,
          description: "Leave blank to use the standard pricing message.",
        }),
      },
    }),

    reviews: collection({
      label: "Reviews",
      slugField: "name",
      path: "content/reviews/*",
      format: { data: "json" },
      schema: {
        name: fields.slug({
          name: {
            label: "Customer & dog",
            description: 'e.g. "Sarah & Bramble"',
            validation: { isRequired: true },
          },
        }),
        where: fields.text({ label: "Town / area" }),
        text: fields.text({
          label: "Review",
          multiline: true,
          validation: { isRequired: true },
        }),
      },
    }),

    faqs: collection({
      label: "FAQs",
      slugField: "question",
      path: "content/faqs/*",
      format: { data: "json" },
      schema: {
        question: fields.slug({
          name: { label: "Question", validation: { isRequired: true } },
        }),
        answer: fields.text({
          label: "Answer",
          multiline: true,
          validation: { isRequired: true },
        }),
      },
    }),

    trustItems: collection({
      label: "Trust badges (dark strip)",
      slugField: "label",
      path: "content/trust-items/*",
      format: { data: "json" },
      schema: {
        label: fields.slug({
          name: { label: "Label", validation: { isRequired: true } },
        }),
        order: fields.integer({ label: "Order", defaultValue: 1 }),
        icon: iconField("Icon", "check"),
      },
    }),

    steps: collection({
      label: "How it works (steps)",
      slugField: "title",
      path: "content/steps/*",
      format: { data: "json" },
      schema: {
        title: fields.slug({
          name: { label: "Step title", validation: { isRequired: true } },
        }),
        order: fields.integer({ label: "Order", defaultValue: 1 }),
        icon: iconField("Icon", "phone"),
        text: fields.text({ label: "Description", multiline: true }),
      },
    }),

    whyFeatures: collection({
      label: "Why us (feature tiles)",
      slugField: "title",
      path: "content/why-features/*",
      format: { data: "json" },
      schema: {
        title: fields.slug({
          name: { label: "Title", validation: { isRequired: true } },
        }),
        order: fields.integer({ label: "Order", defaultValue: 1 }),
        icon: iconField("Icon", "heart"),
        text: fields.text({ label: "Description", multiline: true }),
      },
    }),

    teamMembers: collection({
      label: "Team members",
      slugField: "name",
      path: "content/team-members/*",
      format: { data: "json" },
      schema: {
        name: fields.slug({
          name: { label: "Name", validation: { isRequired: true } },
        }),
        order: fields.integer({
          label: "Display order",
          description: "Lower numbers appear first.",
          defaultValue: 1,
        }),
        role: fields.text({ label: "Role" }),
        bio: fields.text({ label: "Bio", multiline: true }),
        photo: fields.text({
          label: "Photo URL (optional)",
          description: "Full image URL. Leave blank for a paw-icon placeholder.",
        }),
      },
    }),
  },

  singletons: {
    settings: singleton({
      label: "Site settings",
      path: "content/settings",
      format: { data: "json" },
      schema: {
        tagline: fields.text({ label: "Tagline" }),
        description: fields.text({ label: "Meta description", multiline: true }),
        phoneDisplay: fields.text({ label: "Phone (display)" }),
        phoneNumber: fields.text({
          label: "Phone (digits only)",
          description: "Used for tap-to-call, e.g. 07903555424",
        }),
        whatsappNumber: fields.text({
          label: "WhatsApp (international)",
          description: "No +, no leading 0, e.g. 447903555424",
        }),
        email: fields.text({ label: "Email" }),
        facebook: fields.url({ label: "Facebook URL" }),
        instagram: fields.url({ label: "Instagram URL" }),
        areasLabel: fields.text({ label: "Areas label" }),
        hours: fields.array(
          fields.object({
            day: fields.text({ label: "Day(s)" }),
            time: fields.text({ label: "Hours" }),
          }),
          { label: "Opening hours", itemLabel: (p) => p.fields.day.value }
        ),
      },
    }),

    areas: singleton({
      label: "Areas covered",
      path: "content/areas",
      format: { data: "json" },
      schema: {
        list: fields.array(fields.text({ label: "Area" }), {
          label: "Areas",
          itemLabel: (p) => p.value,
        }),
      },
    }),

    homepage: singleton({
      label: "Homepage content",
      path: "content/homepage",
      format: { data: "json" },
      schema: {
        heroEyebrow: fields.text({ label: "Hero eyebrow" }),
        heroHeading: fields.text({
          label: "Hero heading",
          description: "Wrap emphasised words in *asterisks*, e.g. Day care your dog *can't wait* to get to.",
          multiline: true,
        }),
        heroLead: fields.text({ label: "Hero lead paragraph", multiline: true }),
        heroBadges: fields.array(fields.text({ label: "Badge" }), {
          label: "Hero badges",
          itemLabel: (p) => p.value,
        }),
        ratingText: fields.text({ label: "Hero rating text" }),
        floatTopNumber: fields.text({ label: "Float badge — number", defaultValue: "4" }),
        floatTopLabel: fields.text({ label: "Float badge — label", defaultValue: "Acre Woodland" }),
        floatCardTitle: fields.text({ label: "Float card — title" }),
        floatCardText: fields.text({ label: "Float card — text" }),

        servicesEyebrow: fields.text({ label: "Services — eyebrow" }),
        servicesHeading: fields.text({ label: "Services — heading" }),
        servicesIntro: fields.text({ label: "Services — intro", multiline: true }),

        whyEyebrow: fields.text({ label: "Why us — eyebrow" }),
        whyHeading: fields.text({ label: "Why us — heading" }),
        whyIntro: fields.text({ label: "Why us — intro", multiline: true }),

        howEyebrow: fields.text({ label: "How it works — eyebrow" }),
        howHeading: fields.text({ label: "How it works — heading" }),
        howIntro: fields.text({ label: "How it works — intro", multiline: true }),

        areasEyebrow: fields.text({ label: "Areas — eyebrow" }),
        areasHeading: fields.text({ label: "Areas — heading" }),
        areasIntro: fields.text({ label: "Areas — intro", multiline: true }),
        areaCardTitle: fields.text({ label: "Areas card — title" }),
        areaCardText: fields.text({ label: "Areas card — text" }),
        areaCardRows: fields.array(
          fields.object({
            icon: iconField("Icon", "pin"),
            text: fields.text({ label: "Row text" }),
          }),
          { label: "Areas card — rows", itemLabel: (p) => p.fields.text.value }
        ),
      },
    }),

    about: singleton({
      label: "About page content",
      path: "content/about",
      format: { data: "json" },
      schema: {
        heroEyebrow: fields.text({ label: "Hero eyebrow" }),
        heroHeading: fields.text({
          label: "Hero heading",
          description: "Wrap emphasised words in *asterisks*.",
          multiline: true,
        }),
        heroLead: fields.text({ label: "Hero lead", multiline: true }),
        bodyEyebrow: fields.text({ label: "Body — eyebrow" }),
        bodyHeading: fields.text({ label: "Body — heading" }),
        bodyParagraphs: fields.array(
          fields.text({ label: "Paragraph", multiline: true }),
          { label: "Body paragraphs", itemLabel: (p) => p.value.slice(0, 50) }
        ),
        promiseEyebrow: fields.text({ label: "Promise — eyebrow" }),
        promiseHeading: fields.text({ label: "Promise — heading" }),
        ctaTitle: fields.text({ label: "Closing CTA — title" }),
        ctaText: fields.text({ label: "Closing CTA — text", multiline: true }),
      },
    }),

    contactPage: singleton({
      label: "Contact page content",
      path: "content/contact-page",
      format: { data: "json" },
      schema: {
        heroEyebrow: fields.text({ label: "Hero eyebrow" }),
        heroHeading: fields.text({
          label: "Hero heading",
          description: "Wrap emphasised words in *asterisks*.",
          multiline: true,
        }),
        heroLead: fields.text({ label: "Hero lead", multiline: true }),
        sideEyebrow: fields.text({ label: "Side column — eyebrow" }),
        sideHeading: fields.text({ label: "Side column — heading" }),
        sideText: fields.text({ label: "Side column — text", multiline: true }),
      },
    }),

    cta: singleton({
      label: "Call-to-action band",
      path: "content/cta",
      format: { data: "json" },
      schema: {
        title: fields.text({ label: "Default CTA title" }),
        text: fields.text({ label: "Default CTA text", multiline: true }),
        primaryLabel: fields.text({ label: "Primary button label", defaultValue: "Book a Free Trial" }),
      },
    }),

    images: singleton({
      label: "Photos",
      path: "content/images",
      format: { data: "json" },
      schema: {
        heroMain: fields.text({ label: "Homepage hero photo URL" }),
        whyTall: fields.text({ label: "Why us — tall photo URL" }),
        whySquare1: fields.text({ label: "Why us — square photo 1 URL" }),
        whySquare2: fields.text({ label: "Why us — square photo 2 URL" }),
        about: fields.text({ label: "About page photo URL" }),
        og: fields.text({ label: "Social share (Open Graph) image URL" }),
      },
    }),

    facilities: singleton({
      label: "Facilities page content",
      path: "content/facilities",
      format: { data: "json" },
      schema: {
        metaDescription: fields.text({ label: "Meta description", multiline: true }),

        heroEyebrow: fields.text({ label: "Hero — eyebrow" }),
        heroHeading: fields.text({ label: "Hero — heading" }),
        heroLead: fields.text({ label: "Hero — lead", multiline: true }),

        daycareEyebrow: fields.text({ label: "Daycare — eyebrow" }),
        daycareHeading: fields.text({ label: "Daycare — heading" }),
        daycareIntro: fields.text({ label: "Daycare — intro", multiline: true }),
        daycareFeatures: fields.array(
          fields.object({
            title: fields.text({ label: "Title" }),
            text: fields.text({ label: "Text", multiline: true }),
          }),
          { label: "Daycare — features", itemLabel: (p) => p.fields.title.value }
        ),

        woodlandEyebrow: fields.text({ label: "Woodland — eyebrow" }),
        woodlandHeading: fields.text({ label: "Woodland — heading" }),
        woodlandIntro: fields.text({
          label: "Woodland — intro",
          description: "Wrap emphasised words in *asterisks*, e.g. It is *not* the daycare area.",
          multiline: true,
        }),
        woodlandFeatures: fields.array(
          fields.object({
            title: fields.text({ label: "Title" }),
            text: fields.text({ label: "Text", multiline: true }),
          }),
          { label: "Woodland — features", itemLabel: (p) => p.fields.title.value }
        ),

        safetyEyebrow: fields.text({ label: "Safety — eyebrow" }),
        safetyHeading: fields.text({ label: "Safety — heading" }),
        safetyIntro: fields.text({ label: "Safety — intro", multiline: true }),

        ctaTitle: fields.text({ label: "Closing CTA — title" }),
        ctaText: fields.text({
          label: "Closing CTA — text",
          description: "Use {areasLabel} to insert the areas label.",
          multiline: true,
        }),
      },
    }),

    teamPage: singleton({
      label: "Team page content",
      path: "content/team-page",
      format: { data: "json" },
      schema: {
        metaDescription: fields.text({ label: "Meta description", multiline: true }),
        heroEyebrow: fields.text({ label: "Hero — eyebrow" }),
        heroHeading: fields.text({ label: "Hero — heading" }),
        heroLead: fields.text({ label: "Hero — lead", multiline: true }),
      },
    }),

    faqsPage: singleton({
      label: "FAQs page content",
      path: "content/faqs-page",
      format: { data: "json" },
      schema: {
        metaDescription: fields.text({ label: "Meta description", multiline: true }),
        heroEyebrow: fields.text({ label: "Hero — eyebrow" }),
        heroHeading: fields.text({ label: "Hero — heading" }),
        heroLead: fields.text({ label: "Hero — lead", multiline: true }),
      },
    }),
  },
});
