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
  { label: "Sun (day care)", value: "sun" },
  { label: "Home (boarding)", value: "home" },
  { label: "Paw", value: "paw" },
  { label: "Star (training)", value: "star" },
  { label: "Scissors (grooming)", value: "scissors" },
  { label: "Heart", value: "heart" },
  { label: "Tree / woodland", value: "tree" },
  { label: "Camera", value: "camera" },
  { label: "Leaf", value: "leaf" },
  { label: "Shield", value: "shield" },
  { label: "Clock", value: "clock" },
  { label: "Pin / location", value: "pin" },
];

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
  },
});
