export type CaseStudy = {
  id: string;
  name: string;
  tags: readonly string[];
  headline: string;
  description: string;
  capabilities: readonly string[];
  category: string;
  logo: string;
  liveUrl: string;
  screenshots?: readonly string[];
  coverImage?: string;
  showcaseImage?: string;
  operationsImage?: string;
  workspaceImage?: string;
  story?: readonly {
    headline: string;
    quote: string;
    name: string;
    role: string;
    portrait: string;
    team?: boolean;
  }[];
  feedback: {
    quote: string;
    name: string;
    role: string;
    rating: number;
    isSample: boolean;
    portraitPosition: "left" | "right";
    portrait?: string;
  };
};

export const caseStudies: readonly CaseStudy[] = [
  {
    id: "furniture-odyssey",
    coverImage: "/cases/furniture-odyssey-wide.png",
    showcaseImage: "/cases/furniture-odyssey-cart-showcase.png",
    operationsImage: "/cases/furniture-odyssey-operations.png",
    workspaceImage: "/cases/furniture-odyssey-workspace.png",
    name: "Furniture Odyssey",
    story: [
      {
        headline: "Great Online Business. Chaotic Work.",
        quote: "Before, pag kakausap ako ng client, kailangan kong maghanap ng pic para maka send sakanila ng catalog, madalas hiwa-hiwalay ito ng file or picture. Making quotations naman meant switching between multiple tabs, ang hassle at time consuming.",
        name: "Jane Escobia", role: "Owner, Furniture Odyssey", portrait: "/cases/jane-escobia.jpg",
      },
      {
        headline: "We brought their showroom online.",
        quote: "Gumawa kami ng digital furniture catalog kung saan madaling ma-explore ng customers ang products, collections, at designs. Hindi na kailangang mag-send ng pictures isa-isa sa bawat customer. Now, customers can browse their furniture anytime, anywhere, making it easier to attract more clients and showcase their products. The owner can also easily add, edit, and manage products anytime.",
        name: "Prometheus", role: "Team", portrait: "/favicons/prometheus-cursor.png", team: true,
      },
      {
        headline: "From endless scattered tabs to one powerful system used with just clicks.",
        quote: "Ginawa naming centralized ang buong operations nila. Quotations, orders, inventory, payments, deliveries, at sales reports, nasa iisang system na lang. Wala nang palipat-lipat ng tabs at manual tracking. A few clicks na lang, kita na agad ang status ng lahat.",
        name: "Prometheus", role: "Team", portrait: "/favicons/prometheus-cursor.png", team: true,
      },
      {
        headline: "90% less work. Focused on getting more clients instead of managing.",
        quote: "Dati, sobrang hassle mag-manage ng business, lalo na sa quotations, orders, at payments. Ngayon, everything is centralized in one system, a few clicks na lang! With our digital showroom, mas madali na rin ma-discover ng customers ang products namin. Sobrang laki ng nabawas sa workload ko, kaya mas nakakapag-focus na ako sa pagkuha ng new clients at pag-grow ng business. Mas marami na akong naa-accommodate.",
        name: "Jane Escobia", role: "Owner, Furniture Odyssey", portrait: "/cases/jane-escobia.jpg",
      },
    ],
    tags: ["Website", "Business System"],
    headline: "A digital showroom to attract customers. A business system that eliminated 90% of manual work.",
    description: "A public-facing furniture website paired with a business platform for products, quotations, orders, payments, and deliveries. Customer-facing pages and daily operations come together in one solution.",
    capabilities: ["Product catalog", "Quotations & orders", "Payments & deliveries"],
    category: "Furniture business platform",
    logo: "/partners/furniture-odyssey-original.png",
    liveUrl: "https://furniture-odyssey-catalog-website.vercel.app/",
    feedback: {
      quote: "Before, making quotations meant switching between multiple tabs, ang hassle at time-consuming. Now, everything is just a few clicks away! From quotations to orders and payments to deliveries, everything is centralized and organized. Sobrang laki ng nabawas sa workload ko, and now I can focus more on getting new clients. :)",
      name: "Jane Escobia",
      role: "Owner, Furniture Odyssey",
      portrait: "/cases/jane-escobia.jpg",
      rating: 5,
      isSample: false,
      portraitPosition: "left",
    },
  },
];
