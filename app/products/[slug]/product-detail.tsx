"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Expand, ShoppingBag, X } from "lucide-react";
import { Product, products } from "@/data/products";

type CartItem = { product: Product; color: string; size: string; quantity: number };

const money = (value: number) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
}).format(value);

export default function ProductDetail({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name ?? "");
  const [selectedSize, setSelectedSize] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [bagCount, setBagCount] = useState(0);
  const activeView = product.gallery[activeIndex] || product.gallery[0];
  const related = products.filter(item => item.id !== product.id).slice(0, 4);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem("dynoo-cart") ?? "[]") as CartItem[];
      setBagCount(saved.reduce((total, item) => total + item.quantity, 0));
    } catch {
      window.localStorage.removeItem("dynoo-cart");
    }
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowRight") setActiveIndex(index => (index + 1) % product.gallery.length);
      if (event.key === "ArrowLeft") setActiveIndex(index => (index - 1 + product.gallery.length) % product.gallery.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen, product.gallery.length]);

  const addToBag = () => {
    if (!selectedColor || !selectedSize) return;

    let cart: CartItem[] = [];
    try {
      cart = JSON.parse(window.localStorage.getItem("dynoo-cart") ?? "[]") as CartItem[];
    } catch {
      window.localStorage.removeItem("dynoo-cart");
    }

    const existing = cart.find(item =>
      item.product.id === product.id &&
      item.color === selectedColor &&
      item.size === selectedSize
    );
    const updated = existing
      ? cart.map(item => item === existing ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cart, { product, color: selectedColor, size: selectedSize, quantity: 1 }];

    window.localStorage.setItem("dynoo-cart", JSON.stringify(updated));
    setBagCount(updated.reduce((total, item) => total + item.quantity, 0));
    setAdded(true);
  };

  const changeView = (direction: -1 | 1) => {
    setActiveIndex(index => (index + direction + product.gallery.length) % product.gallery.length);
  };

  return (
    <main className="min-h-screen bg-paper pb-20 text-ink md:pb-0">
      <header className="border-b border-line bg-paper/95 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between px-5 md:px-9">
          <Link href="/" className="flex items-center" aria-label="Dynoo home">
            <img src="/logo.jpeg" alt="Dynoo" className="h-8 w-auto object-contain md:h-10" />
          </Link>
          <Link href="/?bag=1" className="relative flex items-center gap-2 text-sm font-bold transition hover:text-teal" aria-label={`View bag, ${bagCount} items`}>
            <ShoppingBag size={20} />
            <span className="hidden sm:inline">Bag</span>
            {bagCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-teal px-1 text-[12px] font-bold text-paper">{bagCount}</span>}
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-5 py-7 md:px-9 md:py-10">
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/50">
          <Link href="/" className="hover:text-teal transition-colors">Home</Link>
          <ChevronRight size={13} />
          <Link href="/#shop" className="hover:text-teal transition-colors">Collection</Link>
          <ChevronRight size={13} />
          <span className="truncate text-ink font-bold">{product.name}</span>
        </nav>

        <div className="grid gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)] lg:gap-16">
          {/* Gallery Area */}
          <section aria-label={`${product.name} image gallery`} className="fade-up min-w-0">
            <div className="grid gap-4 md:grid-cols-[84px_minmax(0,1fr)]">
              {/* Main Photo Display */}
              <button
                type="button"
                className="product-detail-photo group relative order-1 aspect-[3/4] cursor-zoom-in overflow-hidden rounded-2xl bg-stone shadow-sm md:order-2"
                onClick={() => setLightboxOpen(true)}
                aria-label={`Enlarge image: ${activeView.label}`}
              >
                <Image
                  priority
                  fill
                  quality={95}
                  sizes="(max-width: 768px) 100vw, 60vw"
                  src={activeView.src}
                  alt={activeView.alt}
                  className={`product-detail-image transition-transform duration-700 ${activeView.label.toLowerCase().includes("artwork") ? "object-contain p-8" : "object-cover"}`}
                />
                <span className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-2 rounded-xl bg-paper/90 backdrop-blur-sm px-3.5 py-2 text-xs font-bold text-ink shadow-sm transition group-hover:bg-paper">
                  <Expand size={14} />
                  Click to enlarge
                </span>
                <span className="pointer-events-none absolute top-4 left-4 rounded-lg bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-white">
                  {activeView.label}
                </span>
              </button>

              {/* Thumbnails */}
              <div className="order-2 flex flex-wrap gap-2.5 pb-1 md:order-1 md:max-h-[720px] md:flex-col md:flex-nowrap md:overflow-y-auto md:pb-0">
                {product.gallery.map((view, index) => (
                  <button
                    type="button"
                    key={view.src}
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show ${view.label}`}
                    aria-pressed={activeIndex === index}
                    className={`relative h-[72px] w-[60px] shrink-0 overflow-hidden rounded-xl bg-stone transition-all md:h-[96px] md:w-[80px] ${activeIndex === index ? "ring-2 ring-teal ring-offset-2 ring-offset-paper scale-105" : "opacity-60 hover:opacity-100"}`}
                  >
                    <Image
                      fill
                      sizes="80px"
                      src={view.src}
                      alt=""
                      className={view.label.toLowerCase().includes("artwork") ? "object-contain p-2" : "object-cover"}
                    />
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Product Details Section */}
          <section className="fade-up md:sticky md:top-28 md:self-start">
            {/* Badges & Drop info */}
            <div className="fade-up mb-4 flex flex-wrap items-center gap-2.5">
              {product.dropNumber && (
                <span className="rounded-lg bg-black px-3 py-1 text-[11px] font-black tracking-wider text-white">
                  {product.dropNumber}
                </span>
              )}
              {product.originalPrice && (
                <span className="rounded-lg bg-red-600 px-3 py-1 text-[11px] font-black tracking-wider text-white shadow-md shadow-red-600/20">
                  SPECIAL OFFER
                </span>
              )}
              <span className="rounded-lg bg-stone px-2.5 py-1 text-[11px] font-bold text-ink/70">
                {product.category}
              </span>
            </div>

            <h1 className="fade-up text-3xl font-black leading-[1.05] tracking-[-.05em] md:text-4xl lg:text-5xl">{product.name}</h1>
            
            {product.quote && (
              <p className="fade-up mt-2 text-sm font-semibold italic text-ink/60">
                &ldquo;{product.quote}&rdquo;
              </p>
            )}

            {/* Price display */}
            <div className="fade-up mt-6 flex items-baseline gap-3">
              <span className={`text-4xl font-black ${product.originalPrice ? "text-red-600" : "text-ink"}`}>{money(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-ink/40 line-through font-normal">{money(product.originalPrice)}</span>
                  <span className="rounded-full bg-red-100 px-3.5 py-1 text-xs font-black text-red-700">
                    SAVE {money(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>

            {/* Specifications Card */}
            {product.specs && (
              <div className="fade-up mt-6 rounded-xl border border-line bg-stone/40 p-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-bold text-ink/40 uppercase tracking-wider text-[10px]">Front Print</span>
                    <p className="mt-1 font-bold text-ink text-sm">{product.specs.front}</p>
                  </div>
                  <div>
                    <span className="font-bold text-ink/40 uppercase tracking-wider text-[10px]">Back Print</span>
                    <p className="mt-1 font-bold text-ink text-sm">{product.specs.back}</p>
                  </div>
                </div>
                <div className="mt-3.5 flex items-center justify-between border-t border-line/60 pt-3">
                  <span className="rounded-md bg-[#e8fc47] px-2.5 py-1 text-[10px] font-black tracking-wide text-black">
                    ★ AVAILABLE IN OVERSIZED ALSO
                  </span>
                  <span className="font-semibold text-ink/50 text-[11px]">240 GSM Combed Cotton</span>
                </div>
              </div>
            )}

            <p className="fade-up mt-6 text-sm leading-7 text-ink/75">{product.description}</p>

            {/* Color Selector */}
            <div className="fade-up mt-8">
              <p className="text-xs font-bold uppercase tracking-wider text-ink/60">Colour <span className="text-ink font-bold">— {selectedColor}</span></p>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.colors.map(color => (
                  <button
                    type="button"
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    aria-label={`Select ${color.name}`}
                    aria-pressed={selectedColor === color.name}
                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-xs font-bold transition ${selectedColor === color.name ? "border-teal bg-teal/5 text-teal" : "border-line text-ink/75 hover:border-ink"}`}
                  >
                    <span className="h-4 w-4 rounded-full border border-ink/20" style={{ backgroundColor: color.hex }} />
                    {color.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div id="choose-size" className="fade-up mt-7 scroll-mt-8">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-ink/60">Select size {selectedSize && <span className="text-teal font-bold">— {selectedSize}</span>}</p>
                <span className="text-[11px] text-ink/40">Standard Indian Fit</span>
              </div>
              <div className="mt-3 grid grid-cols-5 gap-2.5">
                {product.sizes.map(size => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    aria-pressed={selectedSize === size}
                    className={`rounded-xl py-3.5 text-xs font-bold transition-all ${selectedSize === size ? "bg-teal text-paper shadow-md shadow-teal/20 scale-105" : "bg-stone/80 text-ink hover:bg-line"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Bag CTA */}
            <button
              type="button"
              disabled={!selectedColor || !selectedSize}
              onClick={addToBag}
              className={`fade-up mt-8 flex w-full items-center justify-center gap-2.5 rounded-xl py-4 text-xs font-black tracking-widest uppercase transition-all ${
                added
                  ? "bg-green-600 text-white"
                  : selectedSize
                    ? "bg-teal text-paper hover:bg-ink shadow-lg shadow-teal/20"
                    : "bg-teal/40 text-paper/60 cursor-not-allowed"
              }`}
            >
              {added ? <><Check size={18} /> Added to bag</> : <>Add to bag — {money(product.price)} <ShoppingBag size={16} /></>}
            </button>
            {added ? (
              <Link href="/?bag=1" className="mt-3.5 flex items-center justify-center gap-2 text-xs font-bold text-teal hover:underline">
                View your bag & checkout <ArrowRight size={15} />
              </Link>
            ) : (
              <p className="mt-3 text-center text-xs text-ink/45">Choose a size to proceed with order.</p>
            )}

            {/* Guarantees */}
            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-line pt-6 text-center text-[11px] font-semibold text-ink/60">
              <div className="rounded-lg bg-stone/40 p-2.5">Free Shipping Pan-India</div>
              <div className="rounded-lg bg-stone/40 p-2.5">COD Available</div>
              <div className="rounded-lg bg-stone/40 p-2.5">7-Day Easy Exchange</div>
            </div>
          </section>
        </div>

        {/* Related Products Section */}
        {related.length > 0 && (
          <section className="mt-28 border-t border-line pt-16 md:mt-36">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-teal">More from Dynoo</p>
                <h2 className="display mt-2 text-3xl font-bold md:text-5xl">OTHER DROPS & CLASSICS.</h2>
              </div>
              <Link href="/#shop" className="flex items-center gap-2 text-xs font-bold tracking-wider text-teal hover:underline">
                VIEW ALL <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {related.map(item => (
                <Link key={item.id} href={`/products/${item.slug}`} className="group block">
                  <div className="image-zoom relative aspect-[3/4] overflow-hidden rounded-xl bg-stone">
                    <Image fill sizes="(max-width: 768px) 50vw, 25vw" quality={90} src={item.image} alt={item.name} className="object-cover" />
                    {item.dropNumber && (
                      <span className="absolute top-3 left-3 rounded-md bg-black/80 px-2 py-0.5 text-[9px] font-black text-white backdrop-blur-sm">
                        {item.dropNumber}
                      </span>
                    )}
                    {item.originalPrice && (
                      <span className="absolute top-3 right-3 rounded-md bg-red-600 px-2 py-0.5 text-[9px] font-black text-white">
                        ₹{item.originalPrice - item.price} OFF
                      </span>
                    )}
                  </div>
                  <div className="pt-3">
                    <h3 className="text-xs font-bold text-ink group-hover:text-teal transition-colors line-clamp-1">{item.name}</h3>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-sm font-black text-ink">{money(item.price)}</span>
                      {item.originalPrice && (
                        <span className="text-xs text-ink/40 line-through">{money(item.originalPrice)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <footer className="mt-20 border-t border-line bg-stone px-5 py-12 md:px-9">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-6 sm:flex-row">
          <Link href="/" className="flex items-center" aria-label="Dynoo home">
            <img src="/logo.jpeg" alt="Dynoo" className="h-8 w-auto object-contain" />
          </Link>
          <Link href="/#shop" className="flex items-center gap-2 text-xs font-bold tracking-wider text-teal hover:underline">
            <ArrowLeft size={14} /> BACK TO THE COLLECTION
          </Link>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 backdrop-blur-md p-3 md:hidden">
        <a href="#choose-size" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal px-5 text-xs font-black tracking-wider uppercase text-paper shadow-lg">
          Choose size · {money(product.price)}
        </a>
      </div>

      {/* Lightbox Viewer */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} image viewer`}
          className="fixed inset-0 z-[70] grid place-items-center bg-black/95 p-4 backdrop-blur-md md:p-10"
          onMouseDown={event => {
            if (event.target === event.currentTarget) setLightboxOpen(false);
          }}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close image viewer"
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
          >
            <X size={20} />
          </button>
          {product.gallery.length > 1 && (
            <>
              <button type="button" onClick={() => changeView(-1)} aria-label="Previous image" className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 md:left-8">
                <ChevronLeft size={22} />
              </button>
              <button type="button" onClick={() => changeView(1)} aria-label="Next image" className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 md:right-8">
                <ChevronRight size={22} />
              </button>
            </>
          )}
          <div className="relative h-[85vh] w-full max-w-6xl">
            <Image src={activeView.src} alt={activeView.alt} fill sizes="95vw" quality={98} className="object-contain" priority />
          </div>
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-md">
            {activeView.label} ({activeIndex + 1} / {product.gallery.length})
          </p>
        </div>
      )}
    </main>
  );
}
