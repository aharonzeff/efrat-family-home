import { bookingHref } from "./booking";
import type { SiteContent } from "./content";
import { localePath, t, tList, type Locale, type PageId } from "./i18n";

function originOf(site: URL | undefined, fallback: string) {
  return (site?.origin || fallback).replace(/\/$/, "");
}

export function buildGraph(options: {
  content: SiteContent;
  locale: Locale;
  page: PageId;
  site: URL | undefined;
  title: string;
  description: string;
}) {
  const { content, locale, page, site, title, description } = options;
  const { settings, reviews, faqs, rooms, amenities } = content;
  const origin = originOf(site, settings.siteUrl);
  const path = localePath(locale, page);
  const pageUrl = new URL(path, `${origin}/`).href;
  const homeUrl = new URL(localePath(locale, "home"), `${origin}/`).href;
  const image = new URL(settings.ogImage, `${origin}/`).href;
  const brand = t(locale, settings.brandName);

  const amenityFeature = amenities.flatMap((group) =>
    group.items.map((item) => ({
      "@type": "LocationFeatureSpecification",
      name: t(locale, item.name),
      value: group.included,
    })),
  );

  const bedrooms = rooms
    .filter((room) => room.published)
    .map((room) => ({
      "@type": "Bedroom",
      name: t(locale, room.name),
      bed: room.beds.map((bed) => ({
        "@type": "BedDetails",
        typeOfBed: t(locale, bed.label),
        numberOfBeds: bed.count,
      })),
    }));

  const lodging = {
    "@type": ["VacationRental", "LodgingBusiness"],
    "@id": `${origin}/#lodging`,
    name: brand,
    description,
    url: homeUrl,
    image: [image],
    address: {
      "@type": "PostalAddress",
      addressLocality: t(locale, settings.listing.locality),
      addressRegion: t(locale, settings.listing.region),
      addressCountry: settings.listing.country,
    },
    numberOfBedrooms: settings.listing.bedrooms,
    numberOfBathroomsTotal: settings.listing.baths,
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: settings.listing.guests,
    },
    containsPlace: bedrooms,
    amenityFeature,
    checkinTime: "15:00",
    checkoutTime: "11:00",
    petsAllowed: false,
    smokingAllowed: false,
    knowsLanguage: ["en", "he"],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: settings.listing.ratingValue,
      reviewCount: settings.listing.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.items.map((review) => ({
      "@type": "Review",
      inLanguage: "en",
      datePublished: review.datePublished,
      reviewBody: review.quote.en,
      author: {
        "@type": "Person",
        name: t(locale, review.name),
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: 5,
        bestRating: 5,
      },
      publisher: {
        "@type": "Organization",
        name: "Airbnb",
      },
    })),
    sameAs: [settings.booking.url],
    potentialAction: {
      "@type": "ReserveAction",
      name: "Check Availability on Airbnb",
      target: bookingHref(settings, "schema"),
    },
  };

  const crumbs = [
    {
      "@type": "ListItem",
      position: 1,
      name: brand,
      item: homeUrl,
    },
  ];

  if (page !== "home") {
    crumbs.push({
      "@type": "ListItem",
      position: 2,
      name: title,
      item: pageUrl,
    });
  }

  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      name: brand,
      url: homeUrl,
      inLanguage: locale === "he" ? "he" : "en",
    },
    lodging,
    {
      "@type": "BreadcrumbList",
      itemListElement: crumbs,
    },
  ];

  if (page === "faq") {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: t(locale, item.question),
        acceptedAnswer: {
          "@type": "Answer",
          text: tList(locale, item.answer).join(" "),
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

