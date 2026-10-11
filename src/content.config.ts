import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const loc = z
  .object({
    en: z.string(),
    he: z.string(),
  })
  .loose();

const locList = z
  .object({
    en: z.array(z.string()),
    he: z.array(z.string()),
  })
  .loose();

const site = defineCollection({
  loader: glob({ pattern: "settings.json", base: "./src/content/site" }),
  schema: z.object({
    brandName: loc,
    siteUrl: z.string().url(),
    booking: z.object({
      url: z.string().url(),
      utm: z.record(z.string(), z.string()),
      placements: z.array(z.string()),
    }),
    analytics: z.object({
      cloudflareToken: z.string(),
      endpoint: z.string(),
    }),
    pool: z.object({
      seasonal: z.boolean(),
      openMonths: z.array(z.number().int().min(1).max(12)),
      seasonLabel: loc,
      hoursNote: loc,
    }),
    listing: z.object({
      airbnbId: z.string(),
      guests: z.number(),
      bedrooms: z.number(),
      bedsHeadline: z.number(),
      baths: z.number(),
      publishedBedroomCount: z.number(),
      ratingValue: z.number(),
      reviewCount: z.number(),
      ratingAsOf: z.string(),
      hostingYears: z.number(),
      hostReviewCount: z.number(),
      hostRatingValue: z.number(),
      responseRate: z.string(),
      locality: loc,
      region: loc,
      country: z.string(),
      jerusalemDrive: loc,
    }),
    rules: z.object({
      checkIn: loc,
      checkOut: loc,
      quietHours: loc,
    }),
    map: z.object({
      bbox: z.string(),
      openStreetMap: z.string().url(),
    }),
    heroPhoto: z.string(),
    ogImage: z.string(),
  }),
});

const ui = defineCollection({
  loader: glob({ pattern: "strings.json", base: "./src/content/ui" }),
  schema: z.object({}).loose(),
});

const photos = defineCollection({
  loader: glob({ pattern: "gallery.json", base: "./src/content/photos" }),
  schema: z.object({
    items: z.array(
      z.object({
        id: z.string(),
        file: z.string(),
        category: z.enum([
          "entry",
          "living",
          "dining",
          "kitchen",
          "bedroom",
          "bathroom",
          "outdoor",
          "laundry",
          "workspace",
        ]),
        order: z.number(),
        featured: z.boolean(),
        labelUnverified: z.boolean(),
        alt: loc,
        caption: loc,
      }),
    ),
  }),
});

const amenities = defineCollection({
  loader: glob({ pattern: "list.json", base: "./src/content/amenities" }),
  schema: z.object({
    groups: z.array(
      z.object({
        id: z.string(),
        included: z.boolean(),
        title: loc,
        items: z.array(
          z.object({
            id: z.string(),
            name: loc,
            noteKey: z.string().optional(),
          }),
        ),
      }),
    ),
  }),
});

const rooms = defineCollection({
  loader: glob({ pattern: "list.json", base: "./src/content/rooms" }),
  schema: z.object({
    items: z.array(
      z.object({
        id: z.string(),
        published: z.boolean(),
        name: loc,
        beds: z.array(
          z.object({
            count: z.number(),
            label: loc,
          }),
        ),
        note: loc.optional(),
      }),
    ),
  }),
});

const reviews = defineCollection({
  loader: glob({ pattern: "list.json", base: "./src/content/reviews" }),
  schema: z.object({
    sourceNote: loc,
    linkLabel: loc,
    items: z.array(
      z.object({
        id: z.string(),
        name: loc,
        dateLabel: loc,
        datePublished: z.string(),
        context: loc,
        quote: loc,
      }),
    ),
  }),
});

const faqs = defineCollection({
  loader: glob({ pattern: "list.json", base: "./src/content/faqs" }),
  schema: z.object({
    items: z.array(
      z.object({
        id: z.string(),
        order: z.number(),
        home: z.boolean(),
        question: loc,
        answer: locList,
      }),
    ),
  }),
});

const attractions = defineCollection({
  loader: glob({ pattern: "list.json", base: "./src/content/attractions" }),
  schema: z.object({
    items: z.array(
      z.object({
        id: z.string(),
        order: z.number(),
        category: z.enum(["jerusalem", "gush", "wine", "family", "practical"]),
        name: loc,
        summary: loc,
        drive: loc,
        url: z.string().url().optional(),
        linkLabel: loc,
      }),
    ),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/pages" }),
  schema: z
    .object({
      seo: z.object({
        title: loc,
        description: loc,
      }),
    })
    .loose(),
});

export const collections = {
  site,
  ui,
  photos,
  amenities,
  rooms,
  reviews,
  faqs,
  attractions,
  pages,
};
