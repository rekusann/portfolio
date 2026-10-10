import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";
import { categoryKeys } from "./data/site";

const media = z.object({
  type: z.enum(["image", "youtube", "x"]).default("image"),
  src: z.string().min(1),
  alt: z.string().optional()
});

const works = defineCollection({
  loader: file("src/content/works.yaml"),
  schema: z.object({
    title: z.string(),
    type: z.string(),
    category: z.enum(categoryKeys),
    date: z
      .string()
      .regex(/^\d{4}(?:[./-]\d{1,2}){0,2}$/, '日付は "2026.10.01" / "2026.10" / "2026" の形式で、引用符で囲んで書いてください'),
    duration: z.string().optional(),
    client: z.string().optional(),
    description: z.string().default(""),
    thumbnail: z.string().min(1),
    media: z.array(media).default([])
  })
});

export const collections = { works };
