# Lyon's Artisans Atelier

A premium, interactive e-commerce and brand experience website built for a high-end footwear brand based in León, México. The site features smooth, scroll-linked animations, sophisticated typography, and a modern aesthetic designed to showcase craftsmanship.

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [GSAP](https://gsap.com/) & `@gsap/react`
- **Language:** TypeScript

## ✨ Key Features

- **Immersive GSAP Animations:** Complex scroll-scrubbing timelines, parallax effects, and smooth page reveals.
- **Dynamic Textures & Blend Modes:** Custom logic for mapping dynamic leather textures and adjusting text contrast on the fly based on background colors.
- **Multilingual Support:** Built-in i18n support for seamless language switching (e.g., English / Spanish).
- **Responsive Design:** Optimized for mobile, tablet, and desktop viewports with fluid typography and layout scaling.

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000)** with your browser to see the result.

## 📁 Project Structure

- `/app`: Next.js App Router pages (Home, Who We Are, Collections, Contact).
- `/components`: Reusable UI components (PageHeader, Loaders, GSAP reveal animations).
- `/public/images`: Static assets, including custom AI-generated leather textures.
- `/lib`: Utilities and localization dictionaries (`i18n.ts`).
