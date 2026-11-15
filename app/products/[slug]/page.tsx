import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { findLocalProduct } from "@/lib/local-catalog";
import ProductDetail from "./product-detail";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

async function findProduct(slug: string) {
  return products.find(item => item.slug === slug) ?? await findLocalProduct(slug);
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await findProduct(slug);

  if (!product) return { title: "Product not found | Dynoo" };

  return {
    title: `${product.name} | Dynoo`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Dynoo`,
      description: product.description,
      images: [product.gallery[0].src],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await findProduct(slug);

  if (!product) notFound();

  return <ProductDetail product={product} />;
}
