"use server";
import { z } from "zod";
import db from "../../../db/db";
import fs from "fs/promises";
import { redirect, notFound } from "next/navigation";

const addSchema = z.object({
  name: z.string().min(1, "Name is required."),
  description: z.string().min(1, "Description is required."),
  priceInCents: z.coerce
    .number()
    .int()
    .min(1, "Price must be greater than zero."),
});

export async function addProduct(prevState: unknown, formData: FormData) {
  // Parse non-file fields
  const nonFileFields = Object.fromEntries(
    Array.from(formData.entries()) as [string, string][]
  );

  const validation = addSchema.safeParse(nonFileFields);

  if (!validation.success) {
    return validation.error.formErrors.fieldErrors;
  }

  const data = validation.data;

  // Validate files
  const file = formData.get("file");
  const image = formData.get("image");

  if (!(file instanceof Blob) || !(image instanceof Blob)) {
    return { file: ["File is required"], image: ["Image is required"] };
  }

  if (file.size <= 0) {
    return { file: ["File is empty"] };
  }

  if (!image.type.startsWith("image/")) {
    return { image: ["Image must be of type image/*"] };
  }

  // Save file
  await fs.mkdir("products", { recursive: true });
  const filePath = `products/${crypto.randomUUID()}-${file.name}`;
  await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  // Save image
  await fs.mkdir("public/products", { recursive: true });
  const imagePath = `/products/${crypto.randomUUID()}-${image.name}`;
  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await image.arrayBuffer())
  );

  // Insert into database
  await db.product.create({
    data: {
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath,
      imagePath,
    },
  });

  // Redirect to the products page
  redirect("/admin/products");
}

export async function toggleProductAvailability(
  id: string,
  isAvailableForPurchase: boolean
) {
  await db.product.update({ where: { id }, data: { isAvailableForPurchase } });
}

export async function deleteProduct(id: string) {
  const product = await db.product.delete({ where: { id } });

  if (product == null) return notFound();
}
