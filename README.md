# Leon Islam — Website Specialist Portfolio

[![Live website](https://img.shields.io/badge/Live%20website-Visit%20now-4f46e5?style=for-the-badge&logo=vercel&logoColor=white)](https://leonislam.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Modern portfolio website for **Leon Islam**, a WordPress, Shopify, and Wix specialist. The site is designed to make it easy for prospective clients to understand the services offered, see results, and start a project.

## Live Preview

**[Open the live website →](https://leonislam.com/)**

## What’s inside

- Modern, responsive landing page for desktop, tablet, and mobile
- Fully supported light and dark themes
- Clear service paths for building, improving, and maintaining a website
- Skills, selected projects, professional experience, and client testimonials
- Animated but accessible navigation and mobile menu
- Contact form with validation, success/error feedback, and email delivery via FormSubmit
- Direct email and WhatsApp contact options

## Services

| Build | Improve | Maintain |
| --- | --- | --- |
| WordPress websites | Bug fixing | Content operations |
| Shopify stores | Performance and SEO | Website care plans |
| Wix design | Platform migration | Integrations and automation |

## Technology

- [Next.js](https://nextjs.org/) 15
- React 19 and TypeScript
- Tailwind CSS
- shadcn/ui and Lucide icons
- GSAP for selected interface interactions
- Vercel deployment

## Run locally

```bash
git clone https://github.com/leonislam81/LeonIslamPortfolio.git
cd LeonIslamPortfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production build

```bash
npm run build
npm run start
```

## Contact form protection

The contact form supports [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) to prevent automated submissions. Create a widget for `leonislam.com`, then add these environment variables in Vercel before deploying:

```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-site-key
TURNSTILE_SECRET_KEY=your-secret-key
```

The public site key displays the widget; the secret key remains server-side and verifies every submission. Leave both variables unset only while preparing the integration locally.

## Contact

- Email: [leonislam810@gmail.com](mailto:leonislam810@gmail.com)
- WhatsApp: [+880 1521 783498](https://wa.me/8801521783498)
- Website: [leonislam.com](https://leonislam.com/)

---

Built and maintained by Leon Islam.
