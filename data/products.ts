export type Product = {
  id: number;
  name: string;
  price: number;
  badge?: string;
  category: "Graphic Tees" | "Oversized Tees" | "Everyday Essentials" | "New Arrivals";
  image: string;
  altImage: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  description: string;
};

export const products: Product[] = [
  { id: 1, name: "Legacy Graphic Tee", price: 899, badge: "NEW", category: "Graphic Tees", image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1100&q=85", altImage: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1100&q=85", colors: [{ name: "Natural", hex: "#E5E0D3" }, { name: "Teal", hex: "#045357" }], sizes: ["S", "M", "L", "XL"], description: "An everyday graphic tee built around the Dynoo mark." },
  { id: 2, name: "Dino Club Tee", price: 799, badge: "BESTSELLER", category: "Graphic Tees", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1100&q=85", altImage: "https://images.unsplash.com/photo-1627225924765-552d49cf47ad?auto=format&fit=crop&w=1100&q=85", colors: [{ name: "Soft White", hex: "#F8F8F5" }, { name: "Charcoal", hex: "#202C2C" }], sizes: ["S", "M", "L", "XL"], description: "A clean canvas for an emblem that does all the talking." },
  { id: 3, name: "Essential Oversized Tee", price: 999, category: "Oversized Tees", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1100&q=85", altImage: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=1100&q=85", colors: [{ name: "Moss", hex: "#6B7561" }, { name: "Ink", hex: "#202C2C" }], sizes: ["S", "M", "L", "XL"], description: "Relaxed proportions for repeat wear and easy layers." },
  { id: 4, name: "Origin Statement Tee", price: 899, badge: "NEW", category: "New Arrivals", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1100&q=85", altImage: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1100&q=85", colors: [{ name: "Stone", hex: "#BBB8AD" }, { name: "Teal", hex: "#045357" }], sizes: ["S", "M", "L", "XL"], description: "A considered essential with a distinctive point of view." },
];

export const categories = [
  { name: "Graphic Tees", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80" },
  { name: "Oversized Tees", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=80" },
  { name: "Everyday Essentials", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80" },
  { name: "New Arrivals", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80" },
];
