export const servicePages = [
  {
    slug: 'website-management',
    title: 'Website Management & Admin Support',
    description: 'Reliable website management for WordPress, Shopify, and Wix: content updates, fixes, product uploads, maintenance, and ongoing admin support.',
    eyebrow: 'Website support',
    intro: 'Keep your website accurate, current, and easy to manage without carrying every technical or content task yourself.',
    services: ['WordPress, Shopify, and Wix updates', 'Page, post, menu, image, and content uploads', 'Website data entry and formatting', 'Bug fixes, routine maintenance, and quality checks', 'Product uploads and catalog updates'],
    outcomes: ['A website that stays current', 'Clear, organized content', 'One reliable point of contact'],
  },
  {
    slug: 'ecommerce-product-listing',
    title: 'E-commerce Product Listing Support',
    description: 'Product listing and catalog support for Shopify, WooCommerce, and online stores. Get accurate titles, descriptions, categories, images, attributes, and variations.',
    eyebrow: 'E-commerce operations',
    intro: 'Turn product information into clean, consistent listings that are ready for customers to browse and buy.',
    services: ['Product titles, descriptions, and specifications', 'Images, categories, tags, pricing fields, and attributes', 'Product variations and option setup', 'Bulk product uploads and spreadsheet preparation', 'Catalog cleanup and listing quality checks'],
    outcomes: ['Consistent product data', 'Cleaner customer experience', 'Less manual catalog work'],
  },
  {
    slug: 'amazon-product-listing',
    title: 'Amazon Product Listing & Catalog Support',
    description: 'Amazon product listing, catalog data entry, variation setup, attributes, product research, and spreadsheet support for sellers who need organized catalog operations.',
    eyebrow: 'Amazon support',
    intro: 'Get careful support for the product data and catalog tasks that help keep your Amazon store organized.',
    services: ['Amazon product listing creation and updates', 'Variation, attribute, category, and product data entry', 'Product titles, bullets, descriptions, and images', 'Catalog spreadsheets and bulk data preparation', 'Product and competitor research support'],
    outcomes: ['Organized product information', 'Accurate catalog updates', 'More time for your business'],
  },
  {
    slug: 'data-entry-admin-support',
    title: 'Data Entry & Virtual Admin Support',
    description: 'Accurate online data entry, web research, spreadsheet cleanup, PDF conversion, list building, CRM updates, and virtual admin support for growing businesses.',
    eyebrow: 'Admin & data support',
    intro: 'Hand over the repetitive online work and receive organized, accurate information that is ready to use.',
    services: ['Excel and Google Sheets data entry', 'Web research, list building, and data collection', 'PDF to Excel or Word conversion', 'Copy-paste tasks, data cleanup, and validation', 'CRM, reporting, and recurring online admin tasks'],
    outcomes: ['Accurate, usable data', 'Organized online operations', 'More time for priority work'],
  },
] as const

export type ServicePage = (typeof servicePages)[number]

export function getServicePage(slug: string) {
  return servicePages.find((service) => service.slug === slug)
}
