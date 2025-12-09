export const schemaData = [
  // ---------------------------------------------------
  // 1. ORGANIZATION SCHEMA (Enhanced)
  // ---------------------------------------------------
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://imdhardware.com/#organization",
    name: "IMD Hardware",
    url: "https://imdhardware.com",
    logo: "https://imdhardware.com/logo.jpeg",
    description:
      "IMD Hardware is a trusted manufacturer & supplier of locks, door handles, screws, bolts, basket stoppers, and premium hardware products.",
    foundingDate: "2010-05-15",
    founder: {
      "@type": "Person",
      name: "Rajesh Rathod",
    },
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: "150",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      postalCode: "400072",
      streetAddress: "123 Industrial Area, MIDC",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-XXXXXXXXXX",
      contactType: "customer service",
      email: "info@imdhardware.com",
      availableLanguage: ["English", "Hindi", "Marathi"],
      areaServed: "IN",
      contactOption: "TollFree",
    },
    sameAs: [
      "https://facebook.com/imdhardware",
      "https://instagram.com/imdhardware",
      "https://linkedin.com/company/imdhardware",
      "https://youtube.com/@imdhardware",
      "https://twitter.com/imdhardware",
      "https://pinterest.com/imdhardware",
    ],
    knowsAbout: [
      "Hardware Manufacturing",
      "Locks and Security Systems",
      "Door Handles",
      "Construction Hardware",
      "Industrial Fasteners",
    ],
    award: ["Best Hardware Manufacturer 2023", "Quality Excellence Award 2022"],
  },

  // ---------------------------------------------------
  // 2. LOCAL BUSINESS SCHEMA
  // ---------------------------------------------------
  {
    "@context": "https://schema.org",
    "@type": "HardwareStore",
    "@id": "https://imdhardware.com/#store",
    name: "IMD Hardware Store",
    image: [
      "https://imdhardware.com/store-front.jpg",
      "https://imdhardware.com/warehouse.jpg",
      "https://imdhardware.com/manufacturing-unit.jpg",
    ],
    url: "https://imdhardware.com",
    telephone: "+91-XXXXXXXXXX",
    email: "sales@imdhardware.com",
    priceRange: "₹₹",
    description:
      "Manufacturer and supplier of premium hardware products including locks, door handles, and construction hardware.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Industrial Area, MIDC",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      postalCode: "400072",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "19.0760",
      longitude: "72.8777",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "14:00",
      },
    ],
    paymentAccepted: [
      "Cash",
      "Credit Card",
      "Debit Card",
      "UPI",
      "Net Banking",
    ],
    currenciesAccepted: "INR",
    hasMap: "https://maps.google.com/?q=IMD+Hardware+Mumbai",
    isAccessibleForFree: false,
    publicAccess: true,
    slogan: "Quality Hardware, Trusted Nationwide",
  },

  // ---------------------------------------------------
  // 3. PRODUCT CATEGORY SCHEMA - LOCKS (NEW)
  // ---------------------------------------------------
  {
    "@context": "https://schema.org",
    "@type": ["ProductCollection", "ItemList"],
    "@id": "https://imdhardware.com/products/locks#collection",
    name: "Premium Door Locks - Manufacturer & Supplier",
    description:
      "IMD Hardware manufactures a wide range of high-security door locks, including mortise locks, padlocks, digital locks, and lever handles for residential, commercial, and industrial use. Made with grade 304 stainless steel and advanced security mechanisms.",
    url: "https://imdhardware.com/products/locks",
    brand: {
      "@type": "Brand",
      name: "IMD Hardware",
      logo: "https://imdhardware.com/logo.jpeg",
    },
    manufacturer: {
      "@type": "Organization",
      name: "IMD Hardware",
      url: "https://imdhardware.com",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: 50,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "Product",
            "@id": "https://imdhardware.com/products/mortise-lock-xl5#product",
            name: "IMD Mortise Lock XL5 - Heavy Duty",
            description:
              "High-security mortise lock for main doors, manufactured with brass internal mechanism and grade 304 stainless steel body. Suitable for residential and commercial buildings.",
            image: "https://imdhardware.com/images/locks/mortise-lock-xl5.jpg",
            sku: "IMD-LOCK-XL5",
            mpn: "ML-XL5-2024",
            category: "Door Locks/Mortise Locks",
            offers: {
              "@type": "Offer",
              url: "https://imdhardware.com/products/mortise-lock-xl5",
              priceCurrency: "INR",
              price: "1250",
              availability: "https://schema.org/InStock",
              itemCondition: "https://schema.org/NewCondition",
              seller: {
                "@type": "Organization",
                name: "IMD Hardware",
              },
              eligibleQuantity: {
                "@type": "QuantitativeValue",
                minValue: 1,
                maxValue: 1000,
              },
            },
            brand: {
              "@type": "Brand",
              name: "IMD Hardware",
            },
            additionalProperty: [
              {
                "@type": "PropertyValue",
                name: "Material",
                value: "Stainless Steel 304",
              },
              {
                "@type": "PropertyValue",
                name: "Finish",
                value: "Satin Nickel",
              },
              {
                "@type": "PropertyValue",
                name: "Lock Type",
                value: "Mortise Lock",
              },
            ],
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "Product",
            name: "IMD Digital Smart Lock Pro",
            description:
              "Advanced digital smart lock with fingerprint, PIN, and RFID access. IP65 waterproof rating for outdoor use.",
            image: "https://imdhardware.com/images/locks/digital-lock-pro.jpg",
            sku: "IMD-DIGI-PRO",
            category: "Digital Locks/Smart Locks",
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: "4500",
              availability: "https://schema.org/InStock",
              seller: {
                "@type": "Organization",
                name: "IMD Hardware",
              },
            },
            brand: {
              "@type": "Brand",
              name: "IMD Hardware",
            },
          },
        },
      ],
    },
  },

  // ---------------------------------------------------
  // 4. PRODUCT CATEGORY SCHEMA - DOOR HANDLES (NEW)
  // ---------------------------------------------------
  {
    "@context": "https://schema.org",
    "@type": ["ProductCollection", "ItemList"],
    name: "Premium Door Handles & Knobs Collection",
    description:
      "Manufacturer of premium door handles, lever handles, knobs, and pull handles in various finishes including stainless steel, brass, and powder-coated designs.",
    url: "https://imdhardware.com/products/door-handles",
    brand: {
      "@type": "Brand",
      name: "IMD Hardware",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "Product",
            name: "Stainless Steel Lever Handle Set",
            description:
              "Complete lever handle set with latch and screws, anti-corrosion coating.",
            image: "https://imdhardware.com/images/handles/lever-set.jpg",
            sku: "IMD-HANDLE-LS100",
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: "850",
              availability: "https://schema.org/InStock",
              seller: {
                "@type": "Organization",
                name: "IMD Hardware",
              },
            },
          },
        },
      ],
    },
  },

  // ---------------------------------------------------
  // 5. INDIVIDUAL PRODUCT SCHEMA EXAMPLE (NEW)
  // ---------------------------------------------------
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": "https://imdhardware.com/products/heavy-duty-padlock#product",
    name: "IMD Heavy Duty Security Padlock",
    description:
      "Industrial grade padlock with hardened boron steel shackle, anti-drill protection, and waterproof design. Ideal for warehouses, lockers, and industrial gates.",
    image: [
      "https://imdhardware.com/images/padlock-main.jpg",
      "https://imdhardware.com/images/padlock-side.jpg",
      "https://imdhardware.com/images/padlock-packaging.jpg",
    ],
    sku: "IMD-PADLOCK-HD50",
    mpn: "PD-HD50-2024",
    brand: {
      "@type": "Brand",
      name: "IMD Hardware",
      logo: "https://imdhardware.com/logo.jpeg",
    },
    manufacturer: {
      "@type": "Organization",
      name: "IMD Hardware",
    },
    category: "Security Locks/Padlocks",
    releaseDate: "2024-01-15",
    model: "HD-50",
    offers: {
      "@type": "Offer",
      url: "https://imdhardware.com/products/heavy-duty-padlock",
      priceCurrency: "INR",
      price: "650",
      priceValidUntil: "2024-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "IMD Hardware",
        url: "https://imdhardware.com",
      },
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        minValue: 1,
        maxValue: 500,
      },
      eligibleRegion: {
        "@type": "Country",
        name: "India",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.7",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "320",
      reviewCount: "89",
    },
    review: {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "Ramesh Patel",
      },
      datePublished: "2024-03-15",
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
      reviewBody:
        "Excellent quality padlock. Using it for our warehouse, very sturdy and reliable.",
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Material",
        value: "Hardened Boron Steel",
      },
      {
        "@type": "PropertyValue",
        name: "Shackle Diameter",
        value: "12mm",
        unitCode: "mm",
      },
      {
        "@type": "PropertyValue",
        name: "Weather Resistance",
        value: "IP67 Waterproof",
      },
      {
        "@type": "PropertyValue",
        name: "Weight",
        value: "450",
        unitCode: "GRM",
      },
    ],
    keywords:
      "imd , imd hardware , padlock, security lock, heavy duty lock, industrial padlock, warehouse lock",
    countryOfAssembly: "India",
    countryOfOrigin: "India",
    inProductGroupWithID: "Hardware-Locks",
    isRelatedTo: "https://imdhardware.com/products/locks",
  },

  // ---------------------------------------------------
  // 6. LOYALTY PROGRAM SCHEMA
  // ---------------------------------------------------
  {
    "@context": "https://schema.org",
    "@type": "LoyaltyProgram",
    "@id": "https://imdhardware.com/#loyalty-program",
    name: "IMD Hardware Rewards Program",
    url: "https://imdhardware.com/rewards",
    description:
      "Scan QR codes on IMD Hardware products to earn reward points. Redeem points for discounts, cashback, or free hardware products.",
    provider: {
      "@type": "Organization",
      name: "IMD Hardware",
      url: "https://imdhardware.com",
    },
    programType: "Points",
    membershipPointsEarned: {
      "@type": "QuantitativeValue",
      unitText: "Points",
      value: 10,
      description: "Earn 10 points for every product scanned",
    },
    termsOfService: "https://imdhardware.com/rewards/terms",
    startDate: "2024-01-01",
    awards: [
      "Discounts on future purchases",
      "Cashback rewards",
      "Free hardware products",
      "Exclusive access to new products",
      "Priority customer support",
    ],
    eligibleCustomerType: "B2B,B2C",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Reward Redemption Options",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "100 Points = 5% Discount",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "500 Points = Free Delivery",
          },
        },
      ],
    },
  },

  // ---------------------------------------------------
  // 7. ACTION SCHEMA (Scan QR Code)
  // ---------------------------------------------------
  {
    "@context": "https://schema.org",
    "@type": "Action",
    name: "Scan QR to Earn Points",
    description:
      "Users scan QR codes on IMD Hardware products to earn loyalty points.",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://imdhardware.com/scan",
      actionPlatform: [
        "https://schema.org/MobileWebPlatform",
        "https://schema.org/AndroidPlatform",
        "https://schema.org/IOSPlatform",
      ],
      contentType: "application/vnd.apple.pkpass",
    },
    result: {
      "@type": "Thing",
      name: "Reward Points Earned",
      description: "Points are credited to user's loyalty account instantly",
    },
    instrument: {
      "@type": "MobileApplication",
      name: "IMD Hardware App",
      operatingSystem: "Android, iOS",
      applicationCategory: "BusinessApplication",
      downloadUrl:
        "https://play.google.com/store/apps/details?id=com.imdhardware.app",
    },
  },

  // ---------------------------------------------------
  // 8. OFFER SCHEMA (Redeem Points)
  // ---------------------------------------------------
  {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: "Redeem IMD Hardware Reward Points",
    description:
      "Users can redeem reward points to get discounts, cashback, or free hardware products.",
    url: "https://imdhardware.com/rewards/redeem",
    price: "0",
    priceCurrency: "INR",
    eligibleCustomerType: "LoyaltyMember",
    availability: "https://schema.org/InStock",
    validFrom: "2024-01-01",
    priceValidUntil: "2025-12-31",
    eligibleQuantity: {
      "@type": "QuantitativeValue",
      minValue: 100,
      unitText: "points",
    },
    offeredBy: {
      "@type": "Organization",
      name: "IMD Hardware",
    },
    eligibleRegion: {
      "@type": "Country",
      name: "India",
    },
    includesObject: {
      "@type": "TypeAndQuantityNode",
      typeOfGood: "LoyaltyPoints",
      amountOfThisGood: "100",
    },
  },

  // ---------------------------------------------------
  // 9. WEBSITE + SITELINK SEARCHBOX
  // ---------------------------------------------------
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://imdhardware.com/#website",
    name: "IMD Hardware",
    url: "https://imdhardware.com",
    description:
      "Online store for premium hardware products including locks, door handles, screws, bolts, and construction hardware. Manufacturer and supplier based in Mumbai.",
    publisher: {
      "@type": "Organization",
      name: "IMD Hardware",
      logo: "https://imdhardware.com/logo.jpeg",
    },
    inLanguage: ["en-IN", "hi-IN", "mr-IN"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://imdhardware.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    keywords:
      "hardware manufacturer, locks supplier, door handles, construction hardware, Mumbai",
    copyrightYear: 2024,
  },

  // ---------------------------------------------------
  // 10. BREADCRUMB SCHEMA (NEW)
  // ---------------------------------------------------
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": "https://imdhardware.com/products/locks#breadcrumb",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://imdhardware.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: "https://imdhardware.com/products",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Locks",
        item: "https://imdhardware.com/products/locks",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Mortise Locks",
        item: "https://imdhardware.com/products/locks/mortise",
      },
    ],
  },

  // ---------------------------------------------------
  // 11. FAQ PAGE SCHEMA
  // ---------------------------------------------------
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I earn reward points?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Simply scan the QR code on any IMD Hardware product using our mobile app. Each scan earns you 10 reward points. You can also earn bonus points for bulk purchases and referrals.",
        },
      },
      {
        "@type": "Question",
        name: "How can I redeem my points?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Login to your IMD Hardware account, go to the Rewards section, and choose from available redemption options. Points can be redeemed for discounts on future purchases, cashback, or free hardware products.",
        },
      },
      {
        "@type": "Question",
        name: "What is the minimum points required for redemption?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You need a minimum of 100 points to start redeeming rewards. Different products and discounts have different point requirements.",
        },
      },
      {
        "@type": "Question",
        name: "Do points expire?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Reward points are valid for 12 months from the date they are earned. We send reminders before points are due to expire.",
        },
      },
      {
        "@type": "Question",
        name: "How do I track my points balance?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can track your points balance in the IMD Hardware mobile app or by logging into your account on our website. We also send monthly statements via email.",
        },
      },
      {
        "@type": "Question",
        name: "What types of locks do you manufacture?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We manufacture a wide range of locks including mortise locks, padlocks, digital smart locks, lever handle locks, and specialized security locks for residential, commercial, and industrial applications.",
        },
      },
      {
        "@type": "Question",
        name: "Do you offer bulk order discounts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we offer special pricing for bulk orders. Contact our sales team at sales@imdhardware.com or call +91-XXXXXXXXXX for customized quotes on large quantity orders.",
        },
      },
    ],
  },

  // ---------------------------------------------------
  // 12. SERVICE SCHEMA (Manufacturing Services)
  // ---------------------------------------------------
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Custom Hardware Manufacturing",
    serviceType: "Bulk Order Manufacturing",
    provider: {
      "@type": "Organization",
      name: "IMD Hardware",
      url: "https://imdhardware.com",
    },
    description:
      "Custom hardware manufacturing services for bulk orders. We specialize in producing locks, door handles, and specialized hardware components as per client specifications. OEM manufacturing available.",
    areaServed: {
      "@type": "Country",
      name: [
        "India",
        "Bangladesh",
        "Sri Lanka",
        "Nepal",
        "United Arab Emirates",
      ],
    },
    serviceOutput: {
      "@type": "Product",
      name: "Custom Hardware Products",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Manufacturing Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "OEM Manufacturing",
            description: "Original Equipment Manufacturing with your branding",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom Design Production",
            description:
              "Manufacturing hardware as per your custom designs and specifications",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Bulk Order Fulfillment",
            description:
              "Large quantity orders with special pricing and dedicated support",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Private Label Manufacturing",
            description:
              "Complete private label solutions with custom packaging",
          },
        },
      ],
    },
    termsOfService: "https://imdhardware.com/terms/manufacturing",
    providerMobility: "static",
  },

  // ---------------------------------------------------
  // 13. REVIEW SCHEMA (NEW)
  // ---------------------------------------------------
  {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Organization",
      name: "IMD Hardware",
      image: "https://imdhardware.com/logo.jpeg",
    },
    author: {
      "@type": "Person",
      name: "Sanjay Mehta",
    },
    publisher: {
      "@type": "Organization",
      name: "Hardware Business Magazine",
    },
    datePublished: "2024-02-20",
    reviewBody:
      "IMD Hardware has been our trusted supplier for 5 years. Their product quality is exceptional and their manufacturing capabilities are impressive.",
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
      worstRating: "1",
    },
  },

  // ---------------------------------------------------
  // 14. HOW-TO SCHEMA (NEW) - For Installation Guides
  // ---------------------------------------------------
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Install IMD Mortise Lock",
    description:
      "Step-by-step guide to install IMD Hardware mortise lock properly",
    image: {
      "@type": "ImageObject",
      url: "https://imdhardware.com/guides/mortise-installation.jpg",
      height: "405",
      width: "720",
    },
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: "0",
    },
    supply: [
      {
        "@type": "HowToSupply",
        name: "IMD Mortise Lock Kit",
      },
      {
        "@type": "HowToSupply",
        name: "Screwdriver Set",
      },
    ],
    tool: [
      {
        "@type": "HowToTool",
        name: "Measuring Tape",
      },
      {
        "@type": "HowToTool",
        name: "Chisel",
      },
    ],
    step: [
      {
        "@type": "HowToStep",
        name: "Measure and Mark",
        text: "Measure and mark the position for the lock on your door",
        image: "https://imdhardware.com/guides/step1.jpg",
      },
      {
        "@type": "HowToStep",
        name: "Create Mortise",
        text: "Use a chisel to create the mortise cavity for the lock body",
        image: "https://imdhardware.com/guides/step2.jpg",
      },
      {
        "@type": "HowToStep",
        name: "Install Lock Body",
        text: "Place the lock body into the mortise and secure with screws",
        image: "https://imdhardware.com/guides/step3.jpg",
      },
    ],
    totalTime: "PT30M",
  },
];
