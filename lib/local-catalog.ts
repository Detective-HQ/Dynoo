import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Product } from "@/data/products";

export type LocalProductStatus = "draft" | "approved";

export type LocalProduct = Product & {
  status: LocalProductStatus;
  garmentType: "regular" | "oversized";
  modelType: "male" | "female" | "unisex";
  artwork: string;
  mockup: string;
  modelImage?: string;
  socialCaption: string;
  createdAt: string;
  updatedAt: string;
};

const dataDirectory = path.join(process.cwd(), ".dynoo-local");
const catalogFile = path.join(dataDirectory, "catalog.json");
export const localProductFiles = path.join(process.cwd(), "public", "local-products");

export async function readLocalCatalog(): Promise<LocalProduct[]> {
  try {
    const contents = await readFile(catalogFile, "utf8");
    const parsed: unknown = JSON.parse(contents);
    return Array.isArray(parsed) ? (parsed as LocalProduct[]) : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function readApprovedLocalProducts(): Promise<LocalProduct[]> {
  return (await readLocalCatalog()).filter(product => product.status === "approved");
}

export async function findLocalProduct(slug: string): Promise<LocalProduct | undefined> {
  return (await readApprovedLocalProducts()).find(product => product.slug === slug);
}

export async function saveLocalCatalog(products: LocalProduct[]): Promise<void> {
  await mkdir(dataDirectory, { recursive: true });
  const temporaryFile = `${catalogFile}.${process.pid}.tmp`;
  await writeFile(temporaryFile, `${JSON.stringify(products, null, 2)}\n`, "utf8");
  await rename(temporaryFile, catalogFile);
}

export async function upsertLocalProduct(product: LocalProduct): Promise<void> {
  const products = await readLocalCatalog();
  const index = products.findIndex(item => item.id === product.id);
  if (index === -1) products.unshift(product);
  else products[index] = product;
  await saveLocalCatalog(products);
}
