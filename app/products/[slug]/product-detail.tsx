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
  const activeView = product.gallery[activeIndex];
  const related = products.filter(item => item.id !== product.id).slice(0, 3);

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
      <header className="bg-paper">
        <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between px-5 md:px-9">
          <Link href="/" className="flex items-center" aria-label="Dynoo home">
            <img src="/logo.jpeg" alt="Dynoo" className="h-8 w-auto object-contain md:h-10" />
          </Link>
          <Link href="/?bag=1" className="relative flex items-center gap-2 text-sm font-bold" aria-label={`View bag, ${bagCount} items`}>
            <ShoppingBag size={20} />
            <span className="hidden sm:inline">Bag</span>
            {bagCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-teal px-1 text-[13px] text-paper">{bagCount}</span>}
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-5 py-7 md:px-9 md:py-9">
        <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-[13px] text-ink/60">
          <Link href="/" className="hover:text-teal">Home</Link>
          <ChevronRight size={14} />
          <Link href="/#shop" className="hover:text-teal">Shop</Link>
          <ChevronRight size={14} />
          <span className="truncate text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-9 md:grid-cols-[minmax(0,1.12fr)_minmax(0,.88fr)] lg:gap-16">
          <section aria-label={`${product.name} image gallery`} className="fade-up min-w-0">
            <div className="grid gap-3 md:grid-cols-[76px_minmax(0,1fr)]">
              <button
                type="button"
                className="product-detail-photo group relative order-1 aspect-[.82] cursor-zoom-in overflow-hidden bg-stone md:order-2"
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
                  className={`product-detail-image ${activeView.label.toLowerCase().includes("artwork") ? "object-contain p-8" : "object-cover"}`}
                />
                <span className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-2 bg-paper px-3 py-2 text-[13px] font-semibold text-ink opacity-90">
                  <Expand size={14} />
                  Click to enlarge
                </span>
              </button>
              <div className="order-2 flex flex-wrap gap-2 pb-1 md:order-1 md:max-h-[680px] md:flex-col md:flex-nowrap md:overflow-y-auto md:pb-0">
                {product.gallery.map((view, index) => (
                  <button
                    type="button"
                    key={view.src}
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show ${view.label}`}
                    aria-pressed={activeIndex === index}
                    style={{ animationDelay: `${0.08 + index * 0.06}s` }}
                    className={`fade-up relative h-[70px] w-[56px] shrink-0 overflow-hidden bg-stone md:h-[100px] md:w-[76px] ${activeIndex === index ? "outline outline-2 outline-teal outline-offset-2" : "opacity-65 transition hover:opacity-100"}`}
                  >
                    <Image
                      fill
                      sizes="76px"
                      src={view.src}
                      alt=""
                      className={view.label.toLowerCase().includes("artwork") ? "object-contain p-2" : "object-cover"}
                    />
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="fade-up md:sticky md:top-8 md:self-start">
            {product.dropNumber && (
              <div className="fade-up mb-3 flex items-center gap-2">
                <span className="rounded bg-black px-2.5 py-1 text-[11px] font-black tracking-wider text-white">
                  {product.dropNumber}
                </span>
                {product.originalPrice && (
                  <span className="rounded bg-red-600 px-2.5 py-1 text-[11px] font-black tracking-wider text-white">
                    SPECIAL OFFER
                  </span>
                )}
                {product.quote && (
                  <span className="text-xs italic text-ink/60">
                    &ldquo;{product.quote}&rdquo;
                  </span>
                )}
              </div>
            )}
            <h1 className="fade-up max-w-xl text-4xl font-bold leading-[.98] tracking-[-.07em] md:text-4xl lg:text-6xl">{product.name}</h1>
            <div className="fade-up mt-5 flex items-baseline gap-3" style={{ animationDelay: "0.08s" }}>
              <span className={`text-3xl font-black ${product.originalPrice ? "text-red-600" : "text-ink"}`}>{money(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-ink/40 line-through font-normal">{money(product.originalPrice)}</span>
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                    SAVE {money(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>
            {product.specs && (
              <div className="fade-up mt-5 rounded-lg border border-line bg-stone/50 p-4 text-xs" style={{ animationDelay: "0.12s" }}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="font-bold text-ink/50 uppercase tracking-wider text-[10px]">Front Print</span>
                    <p className="mt-0.5 font-bold text-ink">{product.specs.front}</p>
                  </div>
                  <div>
                    <span className="font-bold text-ink/50 uppercase tracking-wider text-[10px]">Back Print</span>
                    <p className="mt-0.5 font-bold text-ink">{product.specs.back}</p>
                  </div>
                </div>
                <div className="mt-3 inline-block rounded bg-[#e8fc47] px-2.5 py-1 text-[11px] font-black tracking-wide text-black">
                  ★ AVAILABLE IN OVERSIZED ALSO
                </div>
              </div>
            )}
            <p className="fade-up mt-6 max-w-xl text-base leading-7 text-ink/75" style={{ animationDelay: "0.14s" }}>{product.description}</p>

            <div className="fade-up mt-9" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-bold">Colour <span className="font-normal text-ink/65">{selectedColor}</span></p>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {product.colors.map(color => (
                  <button
                    type="button"
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    aria-label={`Select ${color.name}`}
                    aria-pressed={selectedColor === color.name}
                    className={`flex items-center gap-2.5 py-1 pr-2 text-sm ${selectedColor === color.name ? "font-semibold" : "text-ink/65"}`}
                  >
                    <span className={`h-7 w-7 rounded-full border border-ink/20 ${selectedColor === color.name ? "ring-2 ring-teal ring-offset-2 ring-offset-paper" : ""}`} style={{ backgroundColor: color.hex }} />
                    {color.name}
                  </button>
                ))}
              </div>
            </div>

            <div id="choose-size" className="fade-up mt-8 scroll-mt-8" style={{ animationDelay: "0.26s" }}>
              <p className="text-sm font-bold">Select size</p>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {product.sizes.map(size => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    aria-pressed={selectedSize === size}
                    className={`py-3 text-sm font-bold transition ${selectedSize === size ? "bg-teal text-paper" : "bg-stone hover:bg-line"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={!selectedColor || !selectedSize}
              onClick={addToBag}
              style={{ animationDelay: "0.32s" }}
              className="fade-up mt-7 flex w-full items-center justify-center gap-2 bg-teal py-4 text-sm font-bold text-paper transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              {added ? <><Check size={18} /> Added to bag</> : <>Add to bag <ShoppingBag size={17} /></>}
            </button>
            {added ? (
              <Link href="/?bag=1" className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-teal hover:text-ink">
                View bag <ArrowRight size={16} />
              </Link>
            ) : (
              <p className="mt-3 text-center text-[13px] text-ink/55">Choose a colour and size to add this tee to your bag.</p>
            )}
          </section>
        </div>

        {related.length > 0 && (
          <section className="mt-24 pt-12 md:mt-32 md:pt-16">
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="text-3xl font-bold tracking-[-.06em] md:text-5xl">Keep looking.</h2>
              <Link href="/#shop" className="flex items-center gap-2 text-sm font-bold text-teal">Shop all <ArrowRight size={16} /></Link>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              {related.map(item => (
                <Link key={item.id} href={`/products/${item.slug}`} className="fade-up group" style={{ animationDelay: `${0.1 + related.indexOf(item) * 0.08}s` }}>
                  <div className="image-zoom relative aspect-[.82] overflow-hidden bg-stone">
                    <Image fill sizes="(max-width: 768px) 50vw, 33vw" src={item.image} alt={item.name} className="object-cover" />
                  </div>
                  <div className="mt-3 flex justify-between gap-2 text-sm font-semibold">
                    <span>{item.name}</span>
                    <span>{money(item.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <footer className="mt-16 bg-teal px-5 py-10 text-paper md:px-9">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="Dynoo home">
            <img src="/logo.jpeg" alt="Dynoo" className="h-8 w-auto brightness-0 invert" />
          </Link>
          <Link href="/#shop" className="flex items-center gap-2 text-sm font-bold text-mint">Back to the collection <ArrowLeft size={16} /></Link>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-30 bg-paper p-3 md:hidden">
        <a href="#choose-size" className="flex min-h-12 items-center justify-center gap-2 bg-teal px-5 text-sm font-bold text-paper">
          Choose size <span aria-hidden="true">·</span> {money(product.price)}
        </a>
      </div>

      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} image viewer`}
          className="fixed inset-0 z-[70] grid place-items-center bg-ink/95 p-4 md:p-10"
          onMouseDown={event => {
            if (event.target === event.currentTarget) setLightboxOpen(false);
          }}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close image viewer"
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center bg-paper text-ink"
          >
            <X size={21} />
          </button>
          {product.gallery.length > 1 && (
            <>
              <button type="button" onClick={() => changeView(-1)} aria-label="Previous image" className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center bg-paper text-ink md:left-8">
                <ChevronLeft />
              </button>
              <button type="button" onClick={() => changeView(1)} aria-label="Next image" className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center bg-paper text-ink md:right-8">
                <ChevronRight />
              </button>
            </>
          )}
          <div className="relative h-[85vh] w-full max-w-6xl">
            <Image src={activeView.src} alt={activeView.alt} fill sizes="95vw" quality={98} className="object-contain" priority />
          </div>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-paper">{activeView.label}</p>
        </div>
      )}
    </main>
  );
}
