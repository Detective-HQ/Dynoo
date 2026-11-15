export type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  badge?: string;
  category: "Graphic Tees" | "Oversized Tees" | "Everyday Essentials" | "New Arrivals";
  image: string;
  altImage: string;
  gallery: { src: string; label: string; alt: string }[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  description: string;
};

export const products: Product[] = [
  { id: 5, slug: "gods-plan-vanquisher", name: "Gods Plan × Vanquisher Tee", price: 799, badge: "🔥 DROP", category: "Graphic Tees", image: "/gods-plan-tee-front.jpg", altImage: "/gods-plan-tee-back.jpg", gallery: [
    { src: "/gods-plan-tee-front.jpg", label: "Front", alt: "Gods Plan script on the front of the black tee" },
    { src: "/gods-plan-tee-back.jpg", label: "Back", alt: "Vanquisher 2026 graphic on the back of the black tee" },
    { src: "/gods-plan-tee-lifestyle.jpg", label: "On model", alt: "Gods Plan and Vanquisher tee worn as a streetwear look" },
    { src: "/gods-plan-design.png", label: "Front artwork", alt: "Gods Plan front print artwork" },
    { src: "/vanquisher-design.png", label: "Back artwork", alt: "Vanquisher back print artwork" },
  ], colors: [{ name: "Shadow Black", hex: "#0A0A0A" }], sizes: ["S", "M", "L", "XL", "XXL"], description: "The statement piece you've been waiting for. Front: Elegant 'Gods Plan' cursive script — clean, minimal, powerful. Back: Full 'VANQUISHER 2026' collage art — a bold tribute to legacy, passion, and the spirit of cricket. Premium 240 GSM oversized drop-shoulder fit." },
  { id: 1, slug: "legacy-graphic-tee", name: "Legacy Graphic Tee", price: 899, badge: "NEW", category: "Graphic Tees", image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1100&q=85", altImage: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1100&q=85", gallery: [
    { src: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1500&q=90", label: "View one", alt: "Legacy Graphic Tee product view" },
    { src: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1500&q=90", label: "View two", alt: "Legacy Graphic Tee alternate product view" },
  ], colors: [{ name: "Natural", hex: "#E5E0D3" }, { name: "Teal", hex: "#045357" }], sizes: ["S", "M", "L", "XL"], description: "An everyday graphic tee built around the Dynoo mark." },
  { id: 2, slug: "dino-club-tee", name: "Dino Club Tee", price: 799, badge: "BESTSELLER", category: "Graphic Tees", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1100&q=85", altImage: "https://images.unsplash.com/photo-1627225924765-552d49cf47ad?auto=format&fit=crop&w=1100&q=85", gallery: [
    { src: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1500&q=90", label: "View one", alt: "Dino Club Tee product view" },
    { src: "https://images.unsplash.com/photo-1627225924765-552d49cf47ad?auto=format&fit=crop&w=1500&q=90", label: "View two", alt: "Dino Club Tee alternate product view" },
  ], colors: [{ name: "Soft White", hex: "#F8F8F5" }, { name: "Charcoal", hex: "#202C2C" }], sizes: ["S", "M", "L", "XL"], description: "A clean canvas for an emblem that does all the talking." },
  { id: 3, slug: "essential-oversized-tee", name: "Essential Oversized Tee", price: 999, category: "Oversized Tees", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1100&q=85", altImage: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=1100&q=85", gallery: [
    { src: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1500&q=90", label: "View one", alt: "Essential Oversized Tee product view" },
    { src: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=1500&q=90", label: "View two", alt: "Essential Oversized Tee alternate product view" },
  ], colors: [{ name: "Moss", hex: "#6B7561" }, { name: "Ink", hex: "#202C2C" }], sizes: ["S", "M", "L", "XL"], description: "Relaxed proportions for repeat wear and easy layers." },
  { id: 4, slug: "origin-statement-tee", name: "Origin Statement Tee", price: 899, badge: "NEW", category: "New Arrivals", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1100&q=85", altImage: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1100&q=85", gallery: [
    { src: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1500&q=90", label: "View one", alt: "Origin Statement Tee product view" },
    { src: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1500&q=90", label: "View two", alt: "Origin Statement Tee alternate product view" },
  ], colors: [{ name: "Stone", hex: "#BBB8AD" }, { name: "Teal", hex: "#045357" }], sizes: ["S", "M", "L", "XL"], description: "A considered essential with a distinctive point of view." },
];

export const categories = [
  { name: "Graphic Tees", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80" },
  { name: "Oversized Tees", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=80" },
  { name: "Everyday Essentials", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80" },
  { name: "New Arrivals", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80" },
];
