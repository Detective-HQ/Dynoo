export type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  dropNumber?: string;
  quote?: string;
  specs?: { front: string; back: string };
  posterImage?: string;
  category: "Graphic Tees" | "Oversized Tees" | "Everyday Essentials" | "New Arrivals";
  image: string;
  altImage: string;
  gallery: { src: string; label: string; alt: string }[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  description: string;
};

export const products: Product[] = [
  {
    id: 101,
    slug: "vanquisher-gods-plan",
    name: "Vanquisher — God's Plan Tee",
    price: 699,
    originalPrice: 799,
    badge: "DROP 01 · OFFER",
    dropNumber: "DROP 01",
    quote: "GOD'S PLAN",
    specs: { front: "GOD'S PLAN SCRIPT", back: "VANQUISHER RCB 2026" },
    posterImage: "/drops/drop-01-vanquisher-poster.jpg",
    category: "Graphic Tees",
    image: "/drops/drop-01-vanquisher-front.jpg",
    altImage: "/drops/drop-01-vanquisher-back.jpg",
    gallery: [
      { src: "/drops/drop-01-vanquisher-front.jpg", label: "Front View", alt: "Vanquisher Front with God's Plan cursive script" },
      { src: "/drops/drop-01-vanquisher-back.jpg", label: "Back View", alt: "Vanquisher Back with RCB 2026 collage artwork" },
      { src: "/drops/drop-01-vanquisher-poster.jpg", label: "Official Poster", alt: "Dynoo Drop 01 Vanquisher Official Poster" },
      { src: "/gods-plan-tee-front.jpg", label: "Oversized Front", alt: "God's Plan Oversized Streetwear Fit Front" },
      { src: "/gods-plan-tee-back.jpg", label: "Oversized Back", alt: "Vanquisher Oversized Streetwear Fit Back" },
      { src: "/gods-plan-tee-lifestyle.jpg", label: "Street Lifestyle", alt: "God's Plan Tee on model editorial photoshoot" },
      { src: "/gods-plan-design.png", label: "Front Art", alt: "Gods Plan front artwork typography" },
      { src: "/vanquisher-design.png", label: "Back Art", alt: "Vanquisher back artwork graphics" },
    ],
    colors: [{ name: "Shadow Black", hex: "#0A0A0A" }],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Dynoo Drop 01: Vanquisher. Front: Elegant 'God's Plan' script placed with intention. Back: Full-scale 'VANQUISHER RCB 2026' collage celebrating cricket passion and unwavering legacy. 240 GSM combed cotton in an oversized drop-shoulder fit."
  },
  {
    id: 102,
    slug: "scorpion-developer-tee",
    name: "Scorpion — Developer Edition Tee",
    price: 699,
    originalPrice: 799,
    badge: "DROP 02 · OFFER",
    dropNumber: "DROP 02",
    quote: "// NO BUGS. JUST FEATURES.",
    specs: { front: "m. SCORPIO CREST", back: "SCORPION 01.01.26 CODE GRAPHIC" },
    posterImage: "/drops/drop-02-scorpion-poster.jpg",
    category: "Graphic Tees",
    image: "/drops/drop-02-scorpion-front.jpg",
    altImage: "/drops/drop-02-scorpion-back.jpg",
    gallery: [
      { src: "/drops/drop-02-scorpion-front.jpg", label: "Front View", alt: "Scorpion Front with m. Scorpio crest" },
      { src: "/drops/drop-02-scorpion-back.jpg", label: "Back View", alt: "Scorpion Back with constellation code graphic" },
      { src: "/drops/drop-02-scorpion-poster.jpg", label: "Official Poster", alt: "Dynoo Drop 02 Scorpion Official Poster" },
    ],
    colors: [{ name: "Deep Ink Black", hex: "#0B0C10" }],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Dynoo Drop 02: Scorpion. // NO BUGS. JUST FEATURES. 'A mind built on curiosity, a soul driven by knowledge, and hands that turn ideas into code.' Front: Minimalist 'm.' Scorpio symbol. Back: Detailed botanical scorpion & code coordinate blueprint. 240 GSM heavy cotton."
  },
  {
    id: 103,
    slug: "hyrox-athlete-tee",
    name: "Hyrox Athlete — Training Tee",
    price: 699,
    originalPrice: 799,
    badge: "DROP 03 · OFFER",
    dropNumber: "DROP 03",
    quote: "BUILT DIFFERENT",
    specs: { front: "PUMA × HYROX", back: "HYROX ATHLETE — BUILT DIFFERENT" },
    posterImage: "/drops/drop-03-hyrox-poster.jpg",
    category: "Graphic Tees",
    image: "/drops/drop-03-hyrox-front.jpg",
    altImage: "/drops/drop-03-hyrox-back.jpg",
    gallery: [
      { src: "/drops/drop-03-hyrox-front.jpg", label: "Front View", alt: "Hyrox Athlete Front with Puma x Hyrox logo" },
      { src: "/drops/drop-03-hyrox-back.jpg", label: "Back View", alt: "Hyrox Athlete Back with Built Different print" },
      { src: "/drops/drop-03-hyrox-poster.jpg", label: "Official Poster", alt: "Dynoo Drop 03 Hyrox Athlete Official Poster" },
    ],
    colors: [{ name: "Carbon Black", hex: "#111111" }],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Dynoo Drop 03: Hyrox Athlete. BUILT DIFFERENT. Engineered for discipline, athletic grit, and functional training. Front: Clean centered Puma × Hyrox chest logo. Back: High-impact 'HYROX ATHLETE — BUILT DIFFERENT' boxed graphic. 240 GSM heavy cotton with drop shoulder."
  },
  {
    id: 104,
    slug: "messi-10-legacy-tee",
    name: "Messi 10 — Champions Tee",
    price: 699,
    originalPrice: 799,
    badge: "DROP 04 · OFFER",
    dropNumber: "DROP 04",
    quote: "Més que un club",
    specs: { front: "GOLD CREST", back: "THE NUMBER 10" },
    posterImage: "/drops/drop-04-messi-poster.jpg",
    category: "Graphic Tees",
    image: "/drops/drop-04-messi-front.jpg",
    altImage: "/drops/drop-04-messi-back.jpg",
    gallery: [
      { src: "/drops/drop-04-messi-front.jpg", label: "Front View", alt: "Messi 10 Front with metallic gold crest" },
      { src: "/drops/drop-04-messi-back.jpg", label: "Back View", alt: "Messi 10 Back with Barcelona celebration collage" },
      { src: "/drops/drop-04-messi-poster.jpg", label: "Official Poster", alt: "Dynoo Drop 04 Messi 10 Official Poster" },
    ],
    colors: [{ name: "Pitch Black", hex: "#08080A" }],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Dynoo Drop 04: Messi 10. Més que un club. An homage to football royalty and the legendary Number 10. Front: Clean metallic gold chest emblem. Back: Epic championship glory collage featuring Barcelona colors and the golden #10. 240 GSM premium combed cotton."
  },
  {
    id: 105,
    slug: "deadpool-antihero-tee",
    name: "Deadpool — Antihero Tee",
    price: 699,
    originalPrice: 799,
    badge: "DROP 05 · OFFER",
    dropNumber: "DROP 05",
    quote: "Wear red so bad guys won't see me bleed",
    specs: { front: "MANDALA MASK PATCH", back: "DEADPOOL COMIC GRAPHIC" },
    posterImage: "/drops/drop-05-deadpool-poster.jpg",
    category: "Graphic Tees",
    image: "/drops/drop-05-deadpool-front.jpg",
    altImage: "/drops/drop-05-deadpool-back.jpg",
    gallery: [
      { src: "/drops/drop-05-deadpool-front.jpg", label: "Front View", alt: "Deadpool Front with circular mandala mask patch" },
      { src: "/drops/drop-05-deadpool-back.jpg", label: "Back View", alt: "Deadpool Back with Marvel comic collage" },
      { src: "/drops/drop-05-deadpool-poster.jpg", label: "Official Poster", alt: "Dynoo Drop 05 Deadpool Official Poster" },
    ],
    colors: [{ name: "Mercenary Black", hex: "#0D0D0D" }],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Dynoo Drop 05: Deadpool. 'Wear red so bad guys won't see me bleed.' Front: Intricate mandala Deadpool mask circular chest graphic. Back: Bold Marvel Deadpool comic book collage with signature humor. Premium 240 GSM streetwear cotton."
  },
  {
    id: 1,
    slug: "legacy-graphic-tee",
    name: "Legacy Graphic Tee",
    price: 899,
    badge: "ESSENTIAL",
    category: "Graphic Tees",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1100&q=85",
    altImage: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1100&q=85",
    gallery: [
      { src: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1500&q=90", label: "View one", alt: "Legacy Graphic Tee product view" },
      { src: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1500&q=90", label: "View two", alt: "Legacy Graphic Tee alternate product view" },
    ],
    colors: [{ name: "Natural", hex: "#E5E0D3" }, { name: "Teal", hex: "#045357" }],
    sizes: ["S", "M", "L", "XL"],
    description: "An everyday graphic tee built around the Dynoo mark."
  },
  {
    id: 2,
    slug: "dino-club-tee",
    name: "Dino Club Tee",
    price: 799,
    badge: "BESTSELLER",
    category: "Graphic Tees",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1100&q=85",
    altImage: "https://images.unsplash.com/photo-1627225924765-552d49cf47ad?auto=format&fit=crop&w=1100&q=85",
    gallery: [
      { src: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1500&q=90", label: "View one", alt: "Dino Club Tee product view" },
      { src: "https://images.unsplash.com/photo-1627225924765-552d49cf47ad?auto=format&fit=crop&w=1500&q=90", label: "View two", alt: "Dino Club Tee alternate product view" },
    ],
    colors: [{ name: "Soft White", hex: "#F8F8F5" }, { name: "Charcoal", hex: "#202C2C" }],
    sizes: ["S", "M", "L", "XL"],
    description: "A clean canvas for an emblem that does all the talking."
  },
  {
    id: 3,
    slug: "essential-oversized-tee",
    name: "Essential Oversized Tee",
    price: 999,
    category: "Oversized Tees",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1100&q=85",
    altImage: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=1100&q=85",
    gallery: [
      { src: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1500&q=90", label: "View one", alt: "Essential Oversized Tee product view" },
      { src: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=1500&q=90", label: "View two", alt: "Essential Oversized Tee alternate product view" },
    ],
    colors: [{ name: "Moss", hex: "#6B7561" }, { name: "Ink", hex: "#202C2C" }],
    sizes: ["S", "M", "L", "XL"],
    description: "Relaxed proportions for repeat wear and easy layers."
  },
  {
    id: 4,
    slug: "origin-statement-tee",
    name: "Origin Statement Tee",
    price: 899,
    badge: "NEW",
    category: "New Arrivals",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1100&q=85",
    altImage: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1100&q=85",
    gallery: [
      { src: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1500&q=90", label: "View one", alt: "Origin Statement Tee product view" },
      { src: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1500&q=90", label: "View two", alt: "Origin Statement Tee alternate product view" },
    ],
    colors: [{ name: "Stone", hex: "#BBB8AD" }, { name: "Teal", hex: "#045357" }],
    sizes: ["S", "M", "L", "XL"],
    description: "A considered essential with a distinctive point of view."
  },
];

export const categories = [
  { name: "Graphic Tees", image: "/drops/drop-01-vanquisher-poster.jpg" },
  { name: "Oversized Tees", image: "/drops/drop-04-messi-poster.jpg" },
  { name: "Everyday Essentials", image: "/drops/drop-02-scorpion-poster.jpg" },
  { name: "New Arrivals", image: "/drops/drop-05-deadpool-poster.jpg" },
];
