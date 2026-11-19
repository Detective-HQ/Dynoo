"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, ChevronRight, Menu, Minus, Plus, Search, ShoppingBag, UserRound, X, Eye } from "lucide-react";
import { categories, products, Product } from "@/data/products";

type CartItem = { product: Product; color: string; size: string; quantity: number };

const money = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <div className={`flex items-center ${light ? "brightness-0 invert" : ""}`} aria-label="Dynoo">
      <img src="/logo.jpeg" alt="Dynoo Logo" className="h-8 md:h-10 w-auto object-contain" />
    </div>
  );
}

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartReady, setCartReady] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem("dynoo-cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {
        window.localStorage.removeItem("dynoo-cart");
      }
    }
    setCartReady(true);
    if (new URLSearchParams(window.location.search).has("bag")) {
      setCartOpen(true);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);
  useEffect(() => {
    let active = true;
    fetch("/api/local-admin?view=storefront", { cache: "no-store" })
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        if (active && Array.isArray(data?.products)) setLocalProducts(data.products as Product[]);
      })
      .catch(() => {
        // The admin API is intentionally local-only; the regular storefront stays usable without it.
      });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (cartReady) window.localStorage.setItem("dynoo-cart", JSON.stringify(cart));
  }, [cart, cartReady]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.16 }
    );
    document.querySelectorAll(".observe").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* ── Scroll-driven hero ── */
  const heroRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const travel = heroRef.current.offsetHeight - window.innerHeight;
      const raw = -rect.top / travel;
      const progress = Math.min(1, Math.max(0, raw));
      document.documentElement.style.setProperty("--hero-progress", String(progress));
      setIsScrolled(window.scrollY > window.innerHeight * 0.15);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const addToCart = (product: Product, color: string, size: string) => {
    setCart(items => {
      const existing = items.find(item => item.product.id === product.id && item.color === color && item.size === size);
      return existing ? items.map(item => item === existing ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { product, color, size, quantity: 1 }];
    });
    setActiveProduct(null); setCartOpen(true);
  };
  const updateQty = (index: number, change: number) => setCart(items => items.flatMap((item, i) => i === index ? (item.quantity + change > 0 ? [{ ...item, quantity: item.quantity + change }] : []) : [item]));
  const storefrontProducts = useMemo(() => [...localProducts, ...products], [localProducts]);
  const results = useMemo(() => storefrontProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase())), [query, storefrontProducts]);

  return <main>
    <header className={`fixed w-full top-0 z-50 border-b border-line bg-stone/95 backdrop-blur transition-all duration-500 ${isScrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}`}>
      <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between px-5 md:px-9">
        <button className="md:hidden" onClick={() => setNavOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
        <button onClick={() => scrollTo("top")} className="shrink-0"><Wordmark /></button>
        <nav className="hidden items-center gap-8 text-xs font-bold uppercase tracking-[.1em] md:flex">
          <button onClick={() => scrollTo("shop")}>Shop All</button><button onClick={() => scrollTo("shop")}>New Arrivals</button><button onClick={() => scrollTo("bulk-orders")}>Custom Orders</button><button onClick={() => scrollTo("story")}>Our Story</button>
        </nav>
        <div className="flex items-center gap-4 md:gap-5">
          <button onClick={() => setSearchOpen(true)} aria-label="Search products"><Search size={20} /></button>
          <button className="hidden sm:block" aria-label="Account"><UserRound size={19} /></button>
          <button onClick={() => setCartOpen(true)} className="relative" aria-label={`Shopping bag, ${cartCount} items`}><ShoppingBag size={20} />{cartCount > 0 && <span className="absolute -right-3 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-teal px-1 text-[9px] font-bold text-paper">{cartCount}</span>}</button>
        </div>
      </div>
    </header>

    <div ref={heroRef} className="hero-scroll-outer" id="top">
      <div className="hero-sticky">
        <div className="hero-grid mx-auto max-w-[1600px] px-3 md:px-5">
          <div className="relative flex flex-col justify-between bg-teal p-7 text-paper md:p-12">
            <div className="hero-kicker hero-fade-in flex items-center justify-between"><p className="eyebrow text-mint">Dynoo / 01</p><span className="text-[10px] tracking-[.15em]">EST. 2026</span></div>
            <div className="hero-title-container relative z-10 max-w-[600px]"><h1 className="hero-title display text-[clamp(4.5rem,10vw,10rem)] font-bold"><span>WEAR</span><span>THE LEGACY.</span></h1><p className="hero-copy hero-fade-in mt-8 max-w-sm text-sm leading-6 text-paper/80">Made for your everyday. Designed to outlast the ordinary.</p><div className="hero-actions hero-fade-in mt-8 flex flex-wrap gap-3"><button onClick={() => scrollTo("shop")} className="magnetic bg-paper px-5 py-4 text-xs font-bold tracking-[.1em] text-teal transition hover:bg-mint">SHOP THE COLLECTION</button><button onClick={() => scrollTo("story")} className="magnetic border border-paper/50 px-5 py-4 text-xs font-bold tracking-[.1em] transition hover:bg-paper/10">DISCOVER DYNOO</button></div></div>
            <p className="hero-fade-in relative z-10 max-w-[240px] text-xs leading-5 text-paper/60">Everyday wear. Distinctive identity.<br />A legacy of your own.</p>
            <span className="pointer-events-none absolute right-5 top-[22%] text-[15rem] leading-none text-mint/10 md:text-[25rem]">D</span>
          </div>
          <div className="hero-visual hidden bg-mint md:block">
            <Image priority fill sizes="60vw" className="object-cover" src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=90" alt="Streetwear campaign model wearing a relaxed tee" />
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between bg-gradient-to-t from-black/40 to-transparent p-6 text-paper md:p-9"><p className="eyebrow">The first drop / 2026</p><button onClick={() => scrollTo("shop")} className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/60 transition hover:bg-paper hover:text-teal" aria-label="Shop the collection"><ArrowRight size={18} /></button></div>
          </div>
        </div>
        {/* Scroll hint */}
        <div className="hero-scroll-hint">
          <span />
        </div>
      </div>
    </div>
    <div className="overflow-hidden border-y border-line bg-mint py-3 text-teal">
      <div className="ticker-track gap-10 whitespace-nowrap text-[10px] font-bold tracking-[.24em]">
        {[...Array(2)].flatMap(() => ["WEAR THE LEGACY", "DESIGNED FOR THE EVERYDAY", "DYNOO / FIRST DROP", "MAKE YOUR MARK", "WEAR THE LEGACY", "DESIGNED FOR THE EVERYDAY", "DYNOO / FIRST DROP", "MAKE YOUR MARK"]).map((text, index) => <span key={index}>{text} <b className="ml-10 text-lg leading-none">✦</b></span>)}
      </div>
    </div>

    {/* ═══════ FEATURED DROPS — Premium Showcase ═══════ */}
    <FeaturedDrops drops={products.filter(p => Boolean(p.dropNumber))} onAdd={addToCart} onQuickView={setActiveProduct} />

    <section id="bulk-orders" className="observe bg-[#f7941d] px-5 py-20 text-[#0a0a0a] md:px-9 md:py-28">
      <div className="mx-auto max-w-[1500px]">
        <div className="motion-item grid gap-8 md:grid-cols-[1.15fr_.85fr] md:items-end">
          <div>
            <h2 className="mt-4 max-w-4xl text-5xl font-black leading-[.9] tracking-[-.075em] lg:text-8xl">YOUR EVENT.<br />YOUR TEE.</h2>
          </div>
          <div className="md:justify-self-end md:pb-2">
            <p className="max-w-lg text-base leading-7">Made-to-order tees for clubs, festivals, conferences and teams. Final pricing and timelines are confirmed against your garment, artwork, quantity and delivery location.</p>
            <button onClick={() => scrollTo("bulk-pricing")} className="mt-6 flex items-center gap-2 border-b-2 border-[#0a0a0a] pb-2 text-xs font-bold tracking-[.1em]">SEE QUANTITY BANDS <ArrowRight size={15} /></button>
          </div>
        </div>

        <div className="motion-item mt-16 grid gap-8 md:grid-cols-[1.1fr_.9fr] md:gap-14">
          <div className="grid grid-cols-2 gap-2">
            <div className="relative aspect-[.82] overflow-hidden bg-black/10">
              <Image fill sizes="(max-width: 768px) 45vw, 35vw" src="/gods-plan-tee-front.jpg" alt="Front view of the Gods Plan × Vanquisher sample tee" className="object-cover" />
            </div>
            <div className="relative mt-10 aspect-[.82] overflow-hidden bg-black/10 md:mt-16">
              <Image fill sizes="(max-width: 768px) 45vw, 35vw" src="/gods-plan-tee-back.jpg" alt="Back view showing the Vanquisher print on the sample tee" className="object-cover" />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-3xl font-black tracking-[-.06em] lg:text-5xl">A real garment reference.</h3>
            <p className="mt-5 max-w-xl text-sm leading-7">The Gods Plan × Vanquisher tee shown here is a Dynoo product sample, not a claimed event-client order. Use it to review the garment weight, fit and front/back print placement.</p>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 text-sm">
              <div><dt className="text-black/60">Sample fabric</dt><dd className="mt-1 font-bold">240 GSM cotton</dd></div>
              <div><dt className="text-black/60">Sample fit</dt><dd className="mt-1 font-bold">Oversized, drop shoulder</dd></div>
              <div><dt className="text-black/60">Sample sizes</dt><dd className="mt-1 font-bold">S, M, L, XL, XXL</dd></div>
              <div><dt className="text-black/60">Print placement</dt><dd className="mt-1 font-bold">Front, back or both</dd></div>
            </dl>
            <p className="mt-7 max-w-xl text-sm leading-6">Garment, size availability and print technique for a bulk run are confirmed in the written quote. The sample specifications do not automatically apply to every order.</p>
          </div>
        </div>

        <div className="motion-item mt-20">
          <div className="mb-8 md:flex md:items-end md:justify-between">
            <div>
              <h3 className="text-3xl font-black tracking-[-.06em] lg:text-5xl">Three ways to plan a run.</h3>
              <p className="mt-3 max-w-2xl text-sm leading-6">These are planning bands for different buyers, not fixed package prices or a promise that every specification fits every quantity.</p>
            </div>
            <p className="mt-5 text-sm font-semibold md:mt-0">Planning MOQ: 25 pieces; confirm for your chosen spec.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 md:gap-10">
            <article className="pt-5">
              <h4 className="text-2xl font-black tracking-[-.05em]">Event Starter</h4>
              <p className="mt-2 text-4xl font-black tracking-[-.07em]">25–50 tees</p>
              <p className="mt-4 text-sm leading-6">For small hackathons, student clubs and compact gatherings.</p>
            </article>
            <article className="pt-5">
              <h4 className="text-2xl font-black tracking-[-.05em]">Event Bulk</h4>
              <p className="mt-2 text-4xl font-black tracking-[-.07em]">50–300 tees</p>
              <p className="mt-4 text-sm leading-6">For college festivals, conferences and larger event crews.</p>
            </article>
            <article className="pt-5">
              <h4 className="text-2xl font-black tracking-[-.05em]">Corporate Bulk</h4>
              <p className="mt-2 text-4xl font-black tracking-[-.07em]">50–500+ tees</p>
              <p className="mt-4 text-sm leading-6">For company teams, employee kits and startup merchandise.</p>
            </article>
          </div>
        </div>

        <div id="bulk-pricing" className="motion-item mt-20 scroll-mt-24">
          <div className="md:flex md:items-end md:justify-between">
            <div>
              <h3 className="text-3xl font-black tracking-[-.06em] lg:text-5xl">Bulk pricing by quantity.</h3>
              <p className="mt-3 max-w-2xl text-sm leading-6">A final per-tee range depends on fabric/GSM, print technique and placements, size mix, finishing and delivery. No bulk price list has been supplied yet.</p>
            </div>
            <p className="mt-5 text-sm font-semibold md:mt-0">Production and delivery estimates: confirmed per quote.</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
            {[30, 50, 100, 200, 500].map(quantity => (
              <div key={quantity} className="bg-black/10 p-5 md:p-6">
                <p className="text-3xl font-black tracking-[-.06em]">{quantity}</p>
                <p className="mt-1 text-sm font-semibold">pieces</p>
                <p className="mt-6 text-sm font-bold">Price on quote</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-5">Prices are not inferred from the retail tee price. Ask for a written quote after the order specifications are agreed.</p>
        </div>

        <div className="motion-item mt-20 grid gap-12 bg-[#0a0a0a] p-6 text-white md:grid-cols-[.8fr_1.2fr] md:p-10">
          <div>
            <h3 className="text-2xl font-black tracking-[-.06em] lg:text-5xl">Approve first.<br />Produce second.</h3>
            <p className="mt-5 text-sm leading-7 text-white/75">Every bulk run should have a written order confirmation before production starts.</p>
          </div>
          <ol className="grid gap-5 text-sm leading-6 sm:grid-cols-2">
            <li><span className="font-bold text-[#f7941d]">Written spec</span><br />Confirm artwork, garment/fabric and GSM, total quantity, size distribution and deadline.</li>
            <li><span className="font-bold text-[#f7941d]">Proof approval</span><br />Approve the final artwork, placements and production details in writing.</li>
            <li><span className="font-bold text-[#f7941d]">Advance before production</span><br />The advance amount and payment method are stated on the accepted quote or invoice.</li>
            <li><span className="font-bold text-[#f7941d]">Balance due date</span><br />Agree and record the remaining-balance due date in writing before production begins.</li>
          </ol>
        </div>

        <div className="motion-item mt-16 grid gap-8 md:grid-cols-2 md:gap-14">
          <div>
            <h3 className="text-2xl font-black tracking-[-.05em]">Past event orders & client notes</h3>
            <p className="mt-3 max-w-xl text-sm leading-6">Client-approved event photos, order details and testimonials can be added here. The sample shown above is not presented as a previous client order, and no testimonial has been supplied for publication.</p>
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-[-.05em]">Print options</h3>
            <p className="mt-3 max-w-xl text-sm leading-6">Choose front, back or front-and-back placement. The available print technique and final production time are confirmed after the artwork, fabric and quantity are reviewed, then written into the quote.</p>
          </div>
        </div>
      </div>
    </section>

    <section id="categories" className="observe mx-auto max-w-[1600px] px-5 py-24 md:px-9 md:py-36">
      <div className="motion-item mb-12 flex items-end justify-between"><div><p className="eyebrow text-teal">Curated for repeat wear</p><h2 className="display mt-3 text-5xl font-bold md:text-8xl">FIND YOUR<br />EVERYDAY.</h2></div><button onClick={() => scrollTo("shop")} className="hidden items-center gap-2 text-xs font-bold tracking-[.1em] md:flex">SHOP ALL <ArrowRight size={15} /></button></div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {categories.map((category, i) => (
          <button
            key={category.name}
            onClick={() => { setQuery(category.name); scrollTo("shop"); }}
            className={`category-card motion-item group relative h-[280px] text-left md:h-[440px] ${i === 1 ? "md:mt-14" : ""}`}
          >
            <Image fill sizes="(max-width: 768px) 50vw, 25vw" src={category.image} alt={category.name} className="object-cover" />
            <span className="category-card-overlay absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <span className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-5 text-sm font-bold text-paper md:p-6 md:text-base">
              {category.name}
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-paper/40 transition group-hover:bg-paper group-hover:text-teal">
                <ArrowRight size={14} />
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>

    <section id="shop" className="observe bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-5 md:px-9">
        <div className="motion-item mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-teal">The first collection</p>
            <h2 className="display mt-3 text-5xl font-bold md:text-8xl">THE FIRST DROP.</h2>
            <p className="mt-4 text-sm text-ink/70">Everyday staples. Distinctive identity.</p>
          </div>
          <button onClick={() => setQuery("")} className="self-start border-b border-ink pb-1 text-xs font-bold tracking-[.1em]">VIEW ALL PRODUCTS</button>
        </div>
        {query && <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-wider">Showing: {query}<button onClick={() => setQuery("")} className="text-teal underline">Clear</button></div>}
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-6">
          {(query ? results : storefrontProducts).map(product => <ProductCard product={product} key={product.id} onView={() => setActiveProduct(product)} />)}
        </div>
      </div>
    </section>

    <section id="story" className="observe mx-auto grid max-w-[1600px] md:grid-cols-2">
      <div className="reveal-image relative min-h-[560px] overflow-hidden"><Image fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1500&q=85" alt="Streetwear lookbook portrait" /></div>
      <div className="relative flex min-h-[560px] flex-col justify-between bg-teal p-8 text-paper md:p-14"><p className="motion-item eyebrow text-mint">About Dynoo</p><div className="motion-item"><h2 className="display text-5xl font-bold md:text-7xl">NOT JUST A TEE.<br />A STATEMENT.</h2><p className="mt-8 max-w-md text-sm leading-7 text-paper/75">Some things never go out of style. Dynoo brings everyday comfort and distinctive design together, creating pieces that feel as individual as the people who wear them.</p><button onClick={() => scrollTo("universe")} className="magnetic mt-8 flex items-center gap-2 border-b border-mint pb-2 text-xs font-bold tracking-[.12em] text-mint">EXPLORE OUR STORY <ArrowRight size={15} /></button></div><span className="motion-item text-7xl font-black tracking-[-.12em] text-mint/20">DY</span></div>
    </section>

    <section className="observe mx-auto max-w-[1600px] px-5 py-24 md:px-9 md:py-32"><p className="motion-item eyebrow text-teal">Why Dynoo</p><div className="mt-7 grid border-t border-line md:grid-cols-3">{[["✦", "DESIGNED TO STAND OUT", "Distinctive graphics and a recognisable visual identity."], ["○", "MADE FOR EVERYDAY", "Comfort-focused styles designed to fit naturally into everyday wardrobes."], ["↗", "A LEGACY OF YOUR OWN", "A brand identity that encourages individuality and self-expression."]].map(([icon, title, body]) => <article className="motion-item border-b border-line py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-0" key={title}><span className="text-2xl text-teal">{icon}</span><h3 className="mt-12 text-sm font-bold tracking-[.08em]">{title}</h3><p className="mt-4 max-w-xs text-sm leading-6 text-ink/65">{body}</p></article>)}</div></section>

    <section id="universe" className="observe bg-paper py-24 md:py-32"><div className="mx-auto max-w-[1600px] px-5 md:px-9"><div className="motion-item mb-12 flex flex-wrap items-end justify-between gap-6"><div><p className="eyebrow text-teal">Style notes / Vol. 01</p><h2 className="display mt-3 text-5xl font-bold md:text-8xl">THE DYNOO<br />UNIVERSE.</h2></div><button onClick={() => scrollTo("shop")} className="magnetic flex items-center gap-2 text-xs font-bold tracking-[.1em]">EXPLORE COLLECTION <ArrowRight size={15} /></button></div><div className="grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-5"><Look image="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1000&q=85" alt="Tee print close-up" className="motion-item md:col-span-4 md:h-[420px]" /><Look image="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85" alt="Street style campaign" className="motion-item md:col-span-5 md:h-[600px]" /><Look image="https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=85" alt="Minimal streetwear portrait" className="motion-item md:col-span-3 md:h-[360px]" /><Look image="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=85" alt="Neutral fashion look" className="motion-item md:col-span-3 md:-mt-52 md:h-[360px]" /></div></div></section>

    <section id="newsletter" className="bg-teal px-5 py-20 text-paper md:px-9 md:py-28"><div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-2"><div><p className="eyebrow text-mint">The Dynoo note</p><h2 className="display mt-4 text-6xl font-bold md:text-8xl">STAY IN<br />THE LOOP.</h2></div><Newsletter onMessage={setNotice} /></div></section>
    {notice && <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 bg-paper px-5 py-3 text-sm shadow-lg">{notice}</div>}
    <Footer onNavigate={scrollTo} />
    {activeProduct && <QuickView product={activeProduct} onClose={() => setActiveProduct(null)} onAdd={addToCart} />}
    {isCartOpen && <CartDrawer cart={cart} subtotal={subtotal} onClose={() => setCartOpen(false)} onUpdate={updateQty} />}
    {navOpen && <MobileNav close={() => setNavOpen(false)} go={scrollTo} />}
    {searchOpen && <SearchPanel close={() => setSearchOpen(false)} query={query} setQuery={setQuery} results={results} choose={p => { setActiveProduct(p); setSearchOpen(false); }} />}
  </main>;
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  PRODUCT CARD — Premium, clean, with hover effects                */
/* ═══════════════════════════════════════════════════════════════════ */

function ProductCard({ product, onView }: { product: Product; onView: () => void }) {
  const isDropProduct = Boolean(product.originalPrice);

  return (
    <article className="motion-item group">
      <div className="product-card-media relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-stone">
        <Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`} className="absolute inset-0">
          <Image fill sizes="(max-width: 768px) 50vw, 25vw" quality={92} className="product-card-image product-card-image-primary object-cover" src={product.image} alt={product.name} />
          <Image fill sizes="(max-width: 768px) 50vw, 25vw" quality={92} className="product-card-image product-card-image-alt object-cover" src={product.altImage} alt="" aria-hidden="true" />
        </Link>

        {/* Top-left badge: simple drop number or category badge */}
        {product.badge && (
          <span className={`pointer-events-none absolute left-3 top-3 z-10 rounded-lg px-2.5 py-1.5 text-[10px] font-black tracking-wider ${
            isDropProduct ? "bg-black/80 text-white backdrop-blur-sm" : "bg-paper/90 text-ink backdrop-blur-sm"
          }`}>
            {product.dropNumber || product.badge}
          </span>
        )}

        {/* Offer flag on top-right for drop products */}
        {isDropProduct && (
          <span className="offer-badge-pulse pointer-events-none absolute right-3 top-3 z-10 rounded-lg bg-red-600 px-2.5 py-1.5 text-[10px] font-black tracking-wider text-white shadow-lg shadow-red-600/30">
            ₹{product.originalPrice! - product.price} OFF
          </span>
        )}

        {/* Quick View + Add to Bag overlay on hover */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex gap-2 p-3 translate-y-0 md:translate-y-20 md:group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={(e) => { e.preventDefault(); onView(); }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-paper/95 py-3 text-[10px] font-bold tracking-widest text-ink backdrop-blur-sm transition hover:bg-paper"
          >
            <Eye size={13} /> QUICK VIEW
          </button>
        </div>
      </div>

      <div className="pt-4">
        <Link href={`/products/${product.slug}`} className="block text-sm font-bold text-ink hover:text-teal transition-colors leading-snug">
          {product.name}
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          {isDropProduct ? (
            <>
              <span className="text-base font-black text-red-600">{money(product.price)}</span>
              <span className="text-xs text-ink/40 line-through">{money(product.originalPrice!)}</span>
            </>
          ) : (
            <span className="text-base font-bold text-ink">{money(product.price)}</span>
          )}
        </div>
        {isDropProduct && (
          <p className="mt-1.5 text-[11px] font-semibold text-teal">
            Oversized Available · Front + Back Print
          </p>
        )}
        <div className="mt-3 flex gap-1.5">
          {product.colors.map(color => <span title={color.name} key={color.name} className="h-3 w-3 rounded-full border border-ink/15 shadow-sm" style={{ backgroundColor: color.hex }} />)}
        </div>
      </div>
    </article>
  );
}

function Look({ image, alt, className }: { image: string; alt: string; className: string }) { return <div className={`image-zoom relative min-h-64 overflow-hidden rounded-xl ${className}`}><Image fill sizes="(max-width:768px) 50vw, 33vw" className="object-cover" src={image} alt={alt} /></div> }

/* ═══════════════════════════════════════════════════════════════════ */
/*  QUICK VIEW MODAL — Cleaner, more focused                         */
/* ═══════════════════════════════════════════════════════════════════ */

function QuickView({ product, onClose, onAdd }: { product: Product; onClose: () => void; onAdd: (p: Product, c: string, s: string) => void }) {
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const invalid = !color || !size;

  // Show first 3 images in quick view (front, back, poster)
  const quickGallery = (product.gallery || []).slice(0, 3);
  const currentImage = quickGallery[activeImageIndex]?.src || product.image;

  return (
    <div role="dialog" aria-modal className="fixed inset-0 z-50 grid place-items-end bg-ink/50 p-0 backdrop-blur-sm md:place-items-center md:p-6" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="modal-in relative grid max-h-[95vh] w-full overflow-auto bg-paper md:max-w-4xl md:grid-cols-2 md:rounded-2xl md:shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-paper shadow-md transition hover:bg-stone" aria-label="Close product details"><X size={18} /></button>
        
        <div className="flex flex-col bg-stone/50">
          <div className="relative min-h-[400px] flex-1 overflow-hidden">
            <Image fill sizes="(max-width:768px) 100vw, 50vw" quality={95} className="object-cover transition-all duration-500" src={currentImage} alt={product.name} />
          </div>
          {quickGallery.length > 1 && (
            <div className="flex gap-2 p-3">
              {quickGallery.map((view, i) => (
                <button
                  key={view.src}
                  onClick={() => setActiveImageIndex(i)}
                  className={`relative h-16 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition ${activeImageIndex === i ? "border-teal ring-1 ring-teal/30" : "border-transparent opacity-50 hover:opacity-100"}`}
                >
                  <img src={view.src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-7 md:p-9">
          <div className="flex items-center gap-2">
            <p className="eyebrow text-teal">{product.category}</p>
            {product.dropNumber && <span className="rounded-md bg-ink px-2 py-0.5 text-[9px] font-black text-paper">{product.dropNumber}</span>}
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-[-.05em] md:text-3xl">{product.name}</h2>
          
          <div className="mt-3 flex items-baseline gap-3">
            <span className={`text-2xl font-black ${product.originalPrice ? "text-red-600" : ""}`}>{money(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-sm text-ink/35 line-through">{money(product.originalPrice)}</span>
                <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-600">
                  SAVE {money(product.originalPrice - product.price)}
                </span>
              </>
            )}
          </div>

          <p className="mt-4 text-sm leading-6 text-ink/60">{product.description}</p>

          {product.specs && (
            <div className="mt-4 flex items-center gap-4 text-xs">
              <span className="rounded-full bg-stone px-3 py-1.5 font-semibold text-ink/70">Front: {product.specs.front}</span>
              <span className="rounded-full bg-stone px-3 py-1.5 font-semibold text-ink/70">Back: {product.specs.back}</span>
            </div>
          )}

          <div className="mt-6">
            <p className="eyebrow">Colour {color && `— ${color}`}</p>
            <div className="mt-3 flex gap-2">{product.colors.map(c => <button aria-label={c.name} onClick={() => setColor(c.name)} key={c.name} className={`h-8 w-8 rounded-full border-2 transition ${color === c.name ? "border-teal scale-110" : "border-line hover:border-ink"}`} style={{ backgroundColor: c.hex }} />)}</div>
          </div>
          <div className="mt-5">
            <p className="eyebrow">Select size</p>
            <div className="mt-3 grid grid-cols-5 gap-2">{product.sizes.map(s => <button onClick={() => setSize(s)} className={`rounded-lg border py-3 text-xs font-bold transition ${size === s ? "border-teal bg-teal text-paper" : "border-line hover:border-ink"}`} key={s}>{s}</button>)}</div>
          </div>
          {invalid && <p className="mt-3 text-xs text-ink/50">Select a colour and size to add this item.</p>}
          <button disabled={invalid} onClick={() => onAdd(product, color, size)} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal py-4 text-xs font-bold tracking-[.12em] text-paper transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-30">
            ADD TO BAG — {money(product.price)} <ShoppingBag size={15} />
          </button>
          <div className="mt-3 text-center">
            <Link href={`/products/${product.slug}`} className="text-xs font-semibold text-teal hover:underline">
              View full product page →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
function CartDrawer({ cart, subtotal, onClose, onUpdate }: { cart: CartItem[]; subtotal: number; onClose: () => void; onUpdate: (i: number, c: number) => void }) { return <div className="fixed inset-0 z-50 bg-ink/40" onMouseDown={onClose}><aside onMouseDown={e => e.stopPropagation()} className="drawer-in ml-auto flex h-full w-full max-w-md flex-col bg-paper p-6 md:p-8"><div className="flex items-center justify-between border-b border-line pb-5"><h2 className="text-xl font-bold tracking-[-.05em]">YOUR BAG ({cart.reduce((n, x) => n + x.quantity, 0)})</h2><button onClick={onClose} aria-label="Close cart"><X /></button></div>{cart.length === 0 ? <div className="grid flex-1 place-items-center text-center"><div><ShoppingBag className="mx-auto text-teal" size={30} /><p className="mt-4 text-sm">Your bag is ready for its first piece.</p><button onClick={onClose} className="mt-5 border-b border-teal pb-1 text-xs font-bold tracking-wider text-teal">SHOP THE DROP</button></div></div> : <><div className="flex-1 overflow-auto py-5">{cart.map((item, i) => <div className="mb-5 flex gap-3" key={`${item.product.id}-${item.color}-${item.size}`}><div className="relative h-24 w-20 shrink-0 rounded-lg overflow-hidden"><Image fill className="object-cover" src={item.product.image} alt={item.product.name} /></div><div className="flex-1 text-sm"><div className="flex justify-between gap-2 font-bold"><p>{item.product.name}</p><p>{money(item.product.price * item.quantity)}</p></div><p className="mt-1 text-xs text-ink/60">{item.color} / {item.size}</p><div className="mt-4 flex items-center gap-3"><button onClick={() => onUpdate(i, -1)} aria-label="Decrease quantity"><Minus size={14} /></button><span className="text-xs font-bold">{item.quantity}</span><button onClick={() => onUpdate(i, 1)} aria-label="Increase quantity"><Plus size={14} /></button><button onClick={() => onUpdate(i, -item.quantity)} className="ml-auto text-[10px] font-bold tracking-wider text-ink/50">REMOVE</button></div></div></div>)}</div><div className="border-t border-line pt-5"><div className="flex justify-between font-bold"><span>Subtotal</span><span>{money(subtotal)}</span></div><p className="mt-2 text-xs text-ink/55">Shipping and taxes calculated at checkout.</p><button onClick={() => alert("Checkout integration point: connect your commerce provider here.")} className="mt-5 w-full rounded-xl bg-teal py-4 text-xs font-bold tracking-[.12em] text-paper">CHECKOUT</button></div></>}</aside></div> }
function Newsletter({ onMessage }: { onMessage: (x: string) => void }) { const [email, setEmail] = useState(""); const [sending, setSending] = useState(false); const submit = (e: FormEvent) => { e.preventDefault(); if (!/^\S+@\S+\.\S+$/.test(email)) { onMessage("Please enter a valid email address."); return } setSending(true); setTimeout(() => { setSending(false); setEmail(""); onMessage("You're on the Dynoo list. This is a frontend demo — connect your email platform here."); }, 700) }; return <form onSubmit={submit} className="self-end"><p className="max-w-sm text-sm leading-6 text-paper/70">Get updates on new drops, fresh designs, and everything happening at Dynoo.</p><div className="mt-8 flex border-b border-paper/45"><input aria-label="Email address" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-paper/45" placeholder="YOUR EMAIL ADDRESS" /><button className="whitespace-nowrap text-xs font-bold tracking-[.1em] text-mint" disabled={sending}>{sending ? "SIGNING UP..." : "SIGN ME UP"}</button></div></form> }
function Footer({ onNavigate }: { onNavigate: (x: string) => void }) { return <footer className="bg-stone px-5 py-14 md:px-9"><div className="mx-auto grid max-w-[1600px] gap-12 md:grid-cols-[1.8fr_1fr_1fr_1fr]"><div><Wordmark /><p className="mt-5 max-w-xs text-sm leading-6 text-ink/65">Everyday wear. Distinctive identity. Wear the legacy.</p><button onClick={() => onNavigate("shop")} className="mt-7 flex items-center gap-2 text-xs font-bold tracking-[.1em] text-teal">SHOP THE DROP <ArrowRight size={14} /></button></div><FooterGroup title="SHOP" items={[["All Products", "shop"], ["New Arrivals", "shop"], ["Best Sellers", "shop"]]} /><FooterGroup title="HELP" items={[["Custom & Event Orders", "bulk-orders"], ["Contact", "#"], ["FAQs", "#"], ["Shipping Information", "#"], ["Returns", "#"]]} /><FooterGroup title="ABOUT" items={[["Our Story", "story"], ["Instagram", "#"], ["Newsletter", "newsletter"]]} /></div><div className="mx-auto mt-14 flex max-w-[1600px] justify-between border-t border-line pt-5 text-[10px] font-bold tracking-wider text-ink/50"><span>© 2026 DYNOO</span><span>WEAR THE LEGACY.</span></div></footer> }
function FooterGroup({ title, items }: { title: string; items: string[][] }) { return <div><p className="eyebrow text-teal">{title}</p><div className="mt-4 space-y-3">{items.map(([x, id]) => <button onClick={() => id !== "#" && scrollTo(id)} className="block text-sm text-ink/70 hover:text-teal" key={x}>{x}</button>)}</div></div> }
function MobileNav({ close, go }: { close: () => void; go: (x: string) => void }) { return <div className="fixed inset-0 z-50 bg-teal p-6 text-paper"><div className="flex justify-between"><Wordmark light /><button onClick={close}><X /></button></div><nav className="mt-20 grid gap-7 text-4xl font-bold tracking-[-.08em]">{[["Shop All", "shop"], ["New Arrivals", "shop"], ["Custom Orders", "bulk-orders"], ["Our Story", "story"]].map(([x, id]) => <button className="text-left" onClick={() => { go(id); close() }} key={x}>{x}</button>)}</nav><button onClick={() => { go("newsletter"); close() }} className="absolute bottom-8 text-xs font-bold tracking-widest text-mint">STAY IN THE LOOP →</button></div> }
function SearchPanel({ close, query, setQuery, results, choose }: { close: () => void; query: string; setQuery: (x: string) => void; results: Product[]; choose: (p: Product) => void }) { return <div className="fixed inset-0 z-50 bg-paper p-6 md:p-12"><div className="mx-auto max-w-4xl"><div className="flex items-center border-b border-ink"><Search className="mr-3 text-teal" /><input autoFocus value={query} onChange={e => setQuery(e.target.value)} className="w-full bg-transparent py-5 text-2xl outline-none placeholder:text-ink/35" placeholder="Search the collection" /><button onClick={close}><X /></button></div><div className="mt-8 grid gap-2">{query && results.map(p => <button onClick={() => choose(p)} className="flex items-center justify-between border-b border-line py-4 text-left" key={p.id}><span className="font-bold">{p.name}</span><span className="text-sm">{money(p.price)} <ChevronRight className="ml-3 inline" size={16} /></span></button>)}{query && !results.length && <p className="text-sm text-ink/60">Start typing to search the Dynoo collection.</p>}{query && results.length === 0 && <p className="text-sm text-ink/60">No products found.</p>}</div></div></div> }

/* ═══════════════════════════════════════════════════════════════════ */
/*  FEATURED DROPS — Premium horizontal card carousel                */
/* ═══════════════════════════════════════════════════════════════════ */

function FeaturedDrops({ drops, onAdd, onQuickView }: { drops: Product[]; onAdd: (p: Product, c: string, s: string) => void; onQuickView: (p: Product) => void }) {
  const [expandedDrop, setExpandedDrop] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [added, setAdded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleAdd = (product: Product) => {
    if (!selectedSize) return;
    onAdd(product, product.colors[0]?.name || "Black", selectedSize);
    setAdded(true);
    setTimeout(() => { setAdded(false); setExpandedDrop(null); setSelectedSize(""); }, 1800);
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -380, behavior: "smooth" });
  };
  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 380, behavior: "smooth" });
  };

  if (!drops.length) return null;

  return (
    <section id="featured-drop" className="relative bg-[#0a0a0a] py-20 text-white md:py-28 overflow-hidden">
      {/* Background texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30 30 60 0 30z' fill='none' stroke='%23fff' stroke-width='.5'/%3E%3C/svg%3E\")", backgroundSize: "60px 60px" }} />

      <div className="mx-auto max-w-[1600px] px-5 md:px-9">
        {/* Section Header */}
        <div className="mb-14 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-[11px] font-bold tracking-widest text-white/90 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                OFFICIAL DROPS
              </span>
              <span className="rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2 text-[11px] font-black tracking-wider text-white shadow-lg shadow-red-600/20">
                LAUNCH PRICE: ₹699
              </span>
            </div>
            <h2 className="mt-6 text-5xl font-black leading-[.88] tracking-[-.07em] md:text-8xl">
              THE DROPS.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-white/50">
              5 limited edition designs. Front identity. Back statement. Available in regular & oversized — all at ₹699 launch price.
            </p>
          </div>

          {/* Desktop scroll controls */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={scrollLeft} className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white/60 transition hover:bg-white/10 hover:text-white" aria-label="Scroll left">
              <ArrowRight size={18} className="rotate-180" />
            </button>
            <button onClick={scrollRight} className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white/60 transition hover:bg-white/10 hover:text-white" aria-label="Scroll right">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Horizontal scrolling drop cards */}
        <div ref={scrollRef} className="drops-scroll">
          {drops.map((drop, idx) => {
            const isExpanded = expandedDrop === idx;
            return (
              <div
                key={drop.id}
                className={`drop-card relative bg-[#141414] ${isExpanded ? "w-[85vw] md:w-[700px]" : "w-[75vw] md:w-[360px]"} transition-all duration-500`}
                style={{ minHeight: isExpanded ? "580px" : "520px" }}
              >
                {/* Poster Image */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <img
                    src={drop.posterImage || drop.image}
                    alt={drop.name}
                    className="drop-card-image h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>

                {/* Top Tags */}
                <div className="relative z-10 flex items-center justify-between p-5">
                  <span className="rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-black tracking-wider text-white backdrop-blur-md">
                    {drop.dropNumber}
                  </span>
                  <span className="rounded-full bg-red-600/90 px-3 py-1.5 text-[11px] font-black tracking-wider text-white backdrop-blur-md shadow-lg shadow-red-600/30">
                    ₹{(drop.originalPrice || 799) - drop.price} OFF
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
                  <h3 className="text-2xl font-black tracking-[-.04em] text-white md:text-3xl">
                    {drop.name.split("—")[0].trim()}
                  </h3>
                  {drop.quote && (
                    <p className="mt-1 text-sm font-semibold italic text-white/60">
                      &ldquo;{drop.quote}&rdquo;
                    </p>
                  )}

                  {/* Pricing */}
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">{money(drop.price)}</span>
                    {drop.originalPrice && (
                      <span className="text-sm text-white/35 line-through">{money(drop.originalPrice)}</span>
                    )}
                  </div>

                  {/* Expanded state: size selection & add to bag */}
                  {isExpanded ? (
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center gap-3 text-xs text-white/50">
                        <span className="rounded bg-white/10 px-2 py-1">Front: {drop.specs?.front}</span>
                        <span className="rounded bg-white/10 px-2 py-1">Back: {drop.specs?.back}</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white/60 mb-2">
                          SELECT SIZE {selectedSize && <span className="text-orange-400">— {selectedSize}</span>}
                        </p>
                        <div className="flex gap-2">
                          {drop.sizes.map(s => (
                            <button
                              key={s}
                              onClick={() => setSelectedSize(s)}
                              className={`rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
                                selectedSize === s
                                  ? "bg-white text-black scale-105"
                                  : "bg-white/10 text-white hover:bg-white/20"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAdd(drop)}
                          disabled={!selectedSize}
                          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-4 text-sm font-black tracking-wider transition-all ${
                            added
                              ? "bg-green-500 text-white"
                              : selectedSize
                                ? "bg-white text-black hover:bg-white/90"
                                : "bg-white/10 text-white/30 cursor-not-allowed"
                          }`}
                        >
                          {added ? <><Check size={16} /> ADDED!</> : <><ShoppingBag size={16} /> ADD TO BAG</>}
                        </button>
                        <button
                          onClick={() => { setExpandedDrop(null); setSelectedSize(""); }}
                          className="rounded-xl bg-white/10 px-4 py-4 text-xs font-bold text-white/60 transition hover:bg-white/20"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => { setExpandedDrop(idx); setSelectedSize(""); }}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-xs font-black tracking-wider text-black transition hover:bg-white/90"
                      >
                        <ShoppingBag size={14} /> BUY NOW — {money(drop.price)}
                      </button>
                      <button
                        onClick={() => onQuickView(drop)}
                        className="flex items-center justify-center rounded-xl bg-white/10 px-4 py-3.5 text-white/70 backdrop-blur transition hover:bg-white/20"
                        aria-label="Quick view"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  )}

                  {/* Oversized tag */}
                  <p className="mt-3 text-center text-[10px] font-bold tracking-widest text-white/30">
                    REGULAR + OVERSIZED · FRONT & BACK PRINT
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom info bar */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <div className="flex flex-wrap gap-6 text-xs text-white/40">
            <span>240 GSM Premium Cotton</span>
            <span>•</span>
            <span>Free Shipping</span>
            <span>•</span>
            <span>COD Available</span>
            <span>•</span>
            <span>5 Drops · Limited Edition</span>
          </div>
          <button onClick={() => scrollTo("shop")} className="flex items-center gap-2 text-xs font-bold tracking-wider text-white/50 transition hover:text-white">
            VIEW ALL PRODUCTS <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
