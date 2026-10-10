"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, ChevronRight, Menu, Minus, Plus, Search, ShoppingBag, UserRound, X } from "lucide-react";
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
  const [isCartOpen, setCartOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("dynoo-cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);
  useEffect(() => { window.localStorage.setItem("dynoo-cart", JSON.stringify(cart)); }, [cart]);
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
  const results = useMemo(() => products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase())), [query]);

  return <main>
    <header className={`fixed w-full top-0 z-50 border-b border-line bg-stone/95 backdrop-blur transition-all duration-500 ${isScrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}`}>
      <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between px-5 md:px-9">
        <button className="md:hidden" onClick={() => setNavOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
        <button onClick={() => scrollTo("top")} className="shrink-0"><Wordmark /></button>
        <nav className="hidden items-center gap-8 text-xs font-bold uppercase tracking-[.1em] md:flex">
          <button onClick={() => scrollTo("shop")}>Shop All</button><button onClick={() => scrollTo("shop")}>New Arrivals</button><button onClick={() => scrollTo("shop")}>Best Sellers</button><button onClick={() => scrollTo("story")}>Our Story</button>
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

    <section id="categories" className="observe mx-auto max-w-[1600px] px-5 py-24 md:px-9 md:py-36">
      <div className="motion-item mb-12 flex items-end justify-between"><div><p className="eyebrow text-teal">Curated for repeat wear</p><h2 className="display mt-3 text-5xl font-bold md:text-8xl">FIND YOUR<br />EVERYDAY.</h2></div><button onClick={() => scrollTo("shop")} className="hidden items-center gap-2 text-xs font-bold tracking-[.1em] md:flex">SHOP ALL <ArrowRight size={15} /></button></div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">{categories.map((category, i) => <button key={category.name} onClick={() => { setQuery(category.name); scrollTo("shop"); }} className={`reveal-image image-zoom motion-item group relative h-[255px] overflow-hidden text-left md:h-[420px] ${i === 1 ? "md:mt-14" : ""}`}><Image fill sizes="(max-width: 768px) 50vw, 25vw" src={category.image} alt={category.name} className="object-cover" /><span className="absolute inset-0 bg-teal/10 transition group-hover:bg-teal/25" /><span className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4 text-sm font-bold text-paper md:p-5 md:text-base">{category.name}<ArrowRight size={18} /></span></button>)}</div>
    </section>

    <section id="shop" className="observe bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-5 md:px-9">
        <div className="motion-item mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow text-teal">The first collection</p><h2 className="display mt-3 text-5xl font-bold md:text-8xl">THE FIRST DROP.</h2><p className="mt-4 text-sm text-ink/70">Everyday staples. Distinctive identity.</p></div><button onClick={() => setQuery("")} className="self-start border-b border-ink pb-1 text-xs font-bold tracking-[.1em]">VIEW ALL PRODUCTS</button></div>
        {query && <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-wider">Showing: {query}<button onClick={() => setQuery("")} className="text-teal underline">Clear</button></div>}
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-5">{(query ? results : products).map(product => <ProductCard product={product} key={product.id} onView={() => setActiveProduct(product)} />)}</div>
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

function ProductCard({ product, onView }: { product: Product; onView: () => void }) { return <article className="motion-item group"><button onClick={onView} className="image-zoom relative block aspect-[.79] w-full overflow-hidden bg-stone text-left"><Image fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" src={product.image} alt={product.name} />{product.badge && <span className="absolute left-3 top-3 bg-paper px-2 py-1 text-[9px] font-bold tracking-wider">{product.badge}</span>}<span className="absolute inset-x-3 bottom-3 hidden bg-paper py-3 text-center text-[10px] font-bold tracking-widest text-teal md:block md:translate-y-14 md:transition md:group-hover:translate-y-0">QUICK VIEW</span></button><div className="pt-4"><div className="flex justify-between gap-2 text-sm font-bold"><button onClick={onView} className="text-left hover:text-teal">{product.name}</button><span>{money(product.price)}</span></div><div className="mt-3 flex gap-1.5">{product.colors.map(c => <span title={c.name} key={c.name} className="h-3.5 w-3.5 rounded-full border border-ink/20" style={{ backgroundColor: c.hex }} />)}</div></div></article> }
function Look({ image, alt, className }: { image: string; alt: string; className: string }) { return <div className={`image-zoom relative min-h-64 overflow-hidden ${className}`}><Image fill sizes="(max-width:768px) 50vw, 33vw" className="object-cover" src={image} alt={alt} /></div> }
function QuickView({ product, onClose, onAdd }: { product: Product; onClose: () => void; onAdd: (p: Product, c: string, s: string) => void }) { const [color, setColor] = useState(""); const [size, setSize] = useState(""); const invalid = !color || !size; return <div role="dialog" aria-modal className="fixed inset-0 z-50 grid place-items-end bg-ink/45 p-0 md:place-items-center md:p-6"><div className="modal-in relative grid max-h-[95vh] w-full overflow-auto bg-paper md:max-w-4xl md:grid-cols-2"><button onClick={onClose} className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center bg-paper" aria-label="Close product details"><X size={19} /></button><div className="relative min-h-[400px]"><Image fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" src={product.image} alt={product.name} /></div><div className="p-7 md:p-10"><p className="eyebrow text-teal">{product.category}</p><h2 className="mt-3 text-3xl font-bold tracking-[-.06em]">{product.name}</h2><p className="mt-3 text-lg">{money(product.price)}</p><p className="mt-7 text-sm leading-6 text-ink/65">{product.description}</p><div className="mt-8"><p className="eyebrow">Colour {color && `— ${color}`}</p><div className="mt-3 flex gap-2">{product.colors.map(c => <button aria-label={c.name} onClick={() => setColor(c.name)} key={c.name} className={`h-8 w-8 rounded-full border-2 ${color === c.name ? "border-teal" : "border-transparent"}`} style={{ backgroundColor: c.hex }} />)}</div></div><div className="mt-6"><p className="eyebrow">Select size</p><div className="mt-3 grid grid-cols-4 gap-2">{product.sizes.map(s => <button onClick={() => setSize(s)} className={`border py-3 text-xs font-bold ${size === s ? "border-teal bg-teal text-paper" : "border-line"}`} key={s}>{s}</button>)}</div></div>{invalid && <p className="mt-4 text-xs text-ink/60">Select a colour and size to add this item.</p>}<button disabled={invalid} onClick={() => onAdd(product, color, size)} className="mt-7 flex w-full items-center justify-center gap-2 bg-teal py-4 text-xs font-bold tracking-[.12em] text-paper disabled:cursor-not-allowed disabled:opacity-40">ADD TO BAG <ShoppingBag size={15} /></button></div></div></div> }
function CartDrawer({ cart, subtotal, onClose, onUpdate }: { cart: CartItem[]; subtotal: number; onClose: () => void; onUpdate: (i: number, c: number) => void }) { return <div className="fixed inset-0 z-50 bg-ink/40" onMouseDown={onClose}><aside onMouseDown={e => e.stopPropagation()} className="drawer-in ml-auto flex h-full w-full max-w-md flex-col bg-paper p-6 md:p-8"><div className="flex items-center justify-between border-b border-line pb-5"><h2 className="text-xl font-bold tracking-[-.05em]">YOUR BAG ({cart.reduce((n, x) => n + x.quantity, 0)})</h2><button onClick={onClose} aria-label="Close cart"><X /></button></div>{cart.length === 0 ? <div className="grid flex-1 place-items-center text-center"><div><ShoppingBag className="mx-auto text-teal" size={30} /><p className="mt-4 text-sm">Your bag is ready for its first piece.</p><button onClick={onClose} className="mt-5 border-b border-teal pb-1 text-xs font-bold tracking-wider text-teal">SHOP THE DROP</button></div></div> : <><div className="flex-1 overflow-auto py-5">{cart.map((item, i) => <div className="mb-5 flex gap-3" key={`${item.product.id}-${item.color}-${item.size}`}><div className="relative h-24 w-20 shrink-0"><Image fill className="object-cover" src={item.product.image} alt={item.product.name} /></div><div className="flex-1 text-sm"><div className="flex justify-between gap-2 font-bold"><p>{item.product.name}</p><p>{money(item.product.price * item.quantity)}</p></div><p className="mt-1 text-xs text-ink/60">{item.color} / {item.size}</p><div className="mt-4 flex items-center gap-3"><button onClick={() => onUpdate(i, -1)} aria-label="Decrease quantity"><Minus size={14} /></button><span className="text-xs font-bold">{item.quantity}</span><button onClick={() => onUpdate(i, 1)} aria-label="Increase quantity"><Plus size={14} /></button><button onClick={() => onUpdate(i, -item.quantity)} className="ml-auto text-[10px] font-bold tracking-wider text-ink/50">REMOVE</button></div></div></div>)}</div><div className="border-t border-line pt-5"><div className="flex justify-between font-bold"><span>Subtotal</span><span>{money(subtotal)}</span></div><p className="mt-2 text-xs text-ink/55">Shipping and taxes calculated at checkout.</p><button onClick={() => alert("Checkout integration point: connect your commerce provider here.")} className="mt-5 w-full bg-teal py-4 text-xs font-bold tracking-[.12em] text-paper">CHECKOUT</button></div></>}</aside></div> }
function Newsletter({ onMessage }: { onMessage: (x: string) => void }) { const [email, setEmail] = useState(""); const [sending, setSending] = useState(false); const submit = (e: FormEvent) => { e.preventDefault(); if (!/^\S+@\S+\.\S+$/.test(email)) { onMessage("Please enter a valid email address."); return } setSending(true); setTimeout(() => { setSending(false); setEmail(""); onMessage("You’re on the Dynoo list. This is a frontend demo — connect your email platform here."); }, 700) }; return <form onSubmit={submit} className="self-end"><p className="max-w-sm text-sm leading-6 text-paper/70">Get updates on new drops, fresh designs, and everything happening at Dynoo.</p><div className="mt-8 flex border-b border-paper/45"><input aria-label="Email address" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-paper/45" placeholder="YOUR EMAIL ADDRESS" /><button className="whitespace-nowrap text-xs font-bold tracking-[.1em] text-mint" disabled={sending}>{sending ? "SIGNING UP..." : "SIGN ME UP"}</button></div></form> }
function Footer({ onNavigate }: { onNavigate: (x: string) => void }) { return <footer className="bg-stone px-5 py-14 md:px-9"><div className="mx-auto grid max-w-[1600px] gap-12 md:grid-cols-[1.8fr_1fr_1fr_1fr]"><div><Wordmark /><p className="mt-5 max-w-xs text-sm leading-6 text-ink/65">Everyday wear. Distinctive identity. Wear the legacy.</p><button onClick={() => onNavigate("shop")} className="mt-7 flex items-center gap-2 text-xs font-bold tracking-[.1em] text-teal">SHOP THE DROP <ArrowRight size={14} /></button></div><FooterGroup title="SHOP" items={[["All Products", "shop"], ["New Arrivals", "shop"], ["Best Sellers", "shop"]]} /><FooterGroup title="HELP" items={[["Contact", "#"], ["FAQs", "#"], ["Shipping Information", "#"], ["Returns", "#"]]} /><FooterGroup title="ABOUT" items={[["Our Story", "story"], ["Instagram", "#"], ["Newsletter", "newsletter"]]} /></div><div className="mx-auto mt-14 flex max-w-[1600px] justify-between border-t border-line pt-5 text-[10px] font-bold tracking-wider text-ink/50"><span>© 2026 DYNOO</span><span>WEAR THE LEGACY.</span></div></footer> }
function FooterGroup({ title, items }: { title: string; items: string[][] }) { return <div><p className="eyebrow text-teal">{title}</p><div className="mt-4 space-y-3">{items.map(([x, id]) => <button onClick={() => id !== "#" && scrollTo(id)} className="block text-sm text-ink/70 hover:text-teal" key={x}>{x}</button>)}</div></div> }
function MobileNav({ close, go }: { close: () => void; go: (x: string) => void }) { return <div className="fixed inset-0 z-50 bg-teal p-6 text-paper"><div className="flex justify-between"><Wordmark light /><button onClick={close}><X /></button></div><nav className="mt-20 grid gap-7 text-4xl font-bold tracking-[-.08em]">{[["Shop All", "shop"], ["New Arrivals", "shop"], ["Best Sellers", "shop"], ["Our Story", "story"]].map(([x, id]) => <button className="text-left" onClick={() => { go(id); close() }} key={x}>{x}</button>)}</nav><button onClick={() => { go("newsletter"); close() }} className="absolute bottom-8 text-xs font-bold tracking-widest text-mint">STAY IN THE LOOP →</button></div> }
function SearchPanel({ close, query, setQuery, results, choose }: { close: () => void; query: string; setQuery: (x: string) => void; results: Product[]; choose: (p: Product) => void }) { return <div className="fixed inset-0 z-50 bg-paper p-6 md:p-12"><div className="mx-auto max-w-4xl"><div className="flex items-center border-b border-ink"><Search className="mr-3 text-teal" /><input autoFocus value={query} onChange={e => setQuery(e.target.value)} className="w-full bg-transparent py-5 text-2xl outline-none placeholder:text-ink/35" placeholder="Search the collection" /><button onClick={close}><X /></button></div><div className="mt-8 grid gap-2">{query && results.map(p => <button onClick={() => choose(p)} className="flex items-center justify-between border-b border-line py-4 text-left" key={p.id}><span className="font-bold">{p.name}</span><span className="text-sm">{money(p.price)} <ChevronRight className="ml-3 inline" size={16} /></span></button>)}{query && !results.length && <p className="text-sm text-ink/60">Start typing to search the Dynoo collection.</p>}{query && results.length === 0 && <p className="text-sm text-ink/60">No products found.</p>}</div></div></div> }
