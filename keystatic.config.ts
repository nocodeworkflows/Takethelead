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
  { label: "Key", value: "key" },
];

// Photo upload helper. Files are committed to src/assets/images/<folder>
// (collections add an <entry-slug>/ subfolder) and resized at build time,
// so full-size phone photos are fine to upload.
const photo = (label: string, folder: string, description?: string) =>
  fields.image({
    label,
    description,
    directory: `src/assets/images/${folder}`,
    publicPath: `/src/assets/images/${folder}/`,
  });

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
        photo: photo("Service photo", "services", "Leave blank to use the homepage hero photo."),
        pricingNote: fields.text({
          label: "Pricing note (optional)",
          multiline: true,
          description: "Leave blank to use the standard pricing message.",
        }),
        seoArea: fields.text({
          label: "Area for page title",
          description:
            'Shown as "<Service> in <area>". Only list places this service really covers. Blank uses the site-wide areas label.',
        }),
        prices: fields.array(
          fields.object({
            label: fields.text({ label: "Item" }),
            price: fields.text({ label: "Price", description: 'e.g. "£18" or "From £35"' }),
            detail: fields.text({ label: "Details (optional)", multiline: true }),
          }),
          { label: "Price list", itemLabel: (p) => `${p.fields.label.value} — ${p.fields.price.value}` }
        ),
        areas: fields.array(fields.text({ label: "Area" }), {
          label: "Areas covered for this service",
          itemLabel: (p) => p.value,
        }),
        notes: fields.array(fields.text({ label: "Note", multiline: true }), {
          label: "Please note (eligibility, conditions)",
          itemLabel: (p) => p.value.slice(0, 60),
        }),
        bookingUrl: fields.text({
          label: "Online booking form URL (optional)",
          description: "Adds a 'Book online' button. Blank uses the site-wide booking form.",
        }),
        workshop: fields.object(
          {
            title: fields.text({
              label: "Title",
              description: "Leave blank to hide. Wrap words in *asterisks* to make them red, e.g. Have a Go *Dog Agility* Workshop",
            }),
            subtitle: fields.text({ label: "Subtitle strip", description: "e.g. Introduction to agility" }),
            intro: fields.text({ label: "Description", multiline: true }),
            date: fields.date({
              label: "Date",
              description: "After this date the section says the next date is coming soon and hides the places badge.",
            }),
            time: fields.text({ label: "Time", description: "e.g. 12:15 – 13:45" }),
            price: fields.text({ label: "Price", description: "e.g. £35" }),
            places: fields.text({ label: "Places badge (optional)", description: "e.g. 4 handler places remaining!" }),
            location: fields.text({ label: "Location" }),
            points: fields.array(fields.text({ label: "Point" }), {
              label: "Key points",
              itemLabel: (p) => p.value,
            }),
            tagline: fields.text({ label: "Tagline (optional)", description: "e.g. Fun · Learn · Connect" }),
            bookingLabel: fields.text({ label: "Booking button label", defaultValue: "Book your spot" }),
            photo: photo("Photo", "services"),
            logo: photo("Logo (optional)", "services"),
          },
          { label: "Workshop / event (optional)" }
        ),
        gallery: fields.array(
          fields.object({
            src: photo("Photo", "services"),
            caption: fields.text({ label: "Caption (optional)" }),
          }),
          {
            label: "Photo gallery",
            itemLabel: (p) => p.fields.caption.value || p.fields.src.value?.filename || "Photo",
          }
        ),
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
        category: fields.select({
          label: "Category",
          options: [
            { label: "General", value: "General" },
            { label: "Day care", value: "Day care" },
            { label: "Home boarding", value: "Home boarding" },
            { label: "Dog walking", value: "Dog walking" },
          ],
          defaultValue: "General",
        }),
        order: fields.integer({
          label: "Order",
          description: "Lower numbers appear first. The first six also show on the homepage and contact page.",
          defaultValue: 50,
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
        photo: photo("Photo", "team", "Leave blank for a paw-icon placeholder."),
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
        trainingPhoneDisplay: fields.text({ label: "Training phone (display)" }),
        trainingPhoneNumber: fields.text({ label: "Training phone (digits only)" }),
        trainingEmail: fields.text({ label: "Training email" }),
        salonAddress: fields.text({ label: "Grooming salon address", description: "Shown in the footer and on the contact page." }),
        boardingLicence: fields.text({ label: "Home boarding licence number", description: "Shown in the footer." }),
        address: fields.text({
          label: "Business town (for Google)",
          description: "Used in structured data, e.g. Aldershot.",
        }),
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
        floatTopNumber: fields.text({ label: "Float badge — number", defaultValue: "10+" }),
        floatTopLabel: fields.text({ label: "Float badge — label", defaultValue: "Years of local care" }),
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
        bookingHeading: fields.text({ label: "Booking CTA — heading" }),
        bookingText: fields.text({ label: "Booking CTA — text", multiline: true }),
        bookingButtonLabel: fields.text({
          label: "Booking CTA — button label",
          defaultValue: "Book via our portal →",
        }),
        bookingUrl: fields.text({
          label: "Booking CTA — general booking form URL",
          description: "The online booking form (currently Cognito Forms).",
        }),
        trainingBookingUrl: fields.text({ label: "Training booking form URL" }),
        vaccinationUrl: fields.text({ label: "Vaccination records form URL" }),
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
        heroMain: photo("Homepage hero photo", "site"),
        whyTall: photo("Why us — tall photo", "site"),
        whySquare1: photo("Why us — square photo 1", "site"),
        whySquare2: photo("Why us — square photo 2", "site"),
        about: photo("About page photo", "site"),
        og: photo("Social share image", "site", "Shown when the site is shared on Facebook, WhatsApp etc."),
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

        woodlandEyebrow: fields.text({ label: "Second section — eyebrow (leave heading blank to hide)" }),
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

        moreSections: fields.array(
          fields.object({
            eyebrow: fields.text({ label: "Eyebrow" }),
            heading: fields.text({ label: "Heading" }),
            intro: fields.text({ label: "Intro", multiline: true }),
            photo: photo("Photo (optional)", "facilities"),
            features: fields.array(
              fields.object({
                title: fields.text({ label: "Title" }),
                text: fields.text({ label: "Text", multiline: true }),
              }),
              { label: "Features", itemLabel: (p) => p.fields.title.value }
            ),
          }),
          { label: "More sections (home, salon, training field, table rental…)", itemLabel: (p) => p.fields.heading.value }
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

    terms: singleton({
      label: "Terms & Conditions",
      path: "content/terms",
      format: { data: "json" },
      schema: {
        heroLead: fields.text({ label: "Intro", multiline: true }),
        generalHeading: fields.text({ label: "General terms — heading", defaultValue: "General terms" }),
        general: fields.array(fields.text({ label: "Term", multiline: true }), {
          label: "General terms",
          itemLabel: (p) => p.value.slice(0, 70),
        }),
        groomingHeading: fields.text({ label: "Grooming terms — heading", defaultValue: "Dog grooming terms (The Stylish Dog)" }),
        grooming: fields.array(fields.text({ label: "Term", multiline: true }), {
          label: "Grooming terms",
          itemLabel: (p) => p.value.slice(0, 70),
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

    stylishDog: singleton({
      label: "The Stylish Dog band (grooming)",
      path: "content/stylish-dog",
      format: { data: "json" },
      schema: {
        eyebrow: fields.text({ label: "Eyebrow" }),
        heading: fields.text({ label: "Heading" }),
        tagline: fields.text({ label: "Tagline", multiline: true }),
      },
    }),
  },
});
