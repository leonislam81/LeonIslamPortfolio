export const servicePages = [
  {
    slug: 'website-management',
    title: 'Website Management & Admin Support',
    description: 'Reliable website management for WordPress, Shopify, and Wix: content updates, fixes, product uploads, maintenance, and ongoing admin support.',
    eyebrow: 'Website support',
    contactService: 'Website management & updates',
    intro: 'Keep your website accurate, current, and easy to manage without carrying every technical or content task yourself.',
    services: ['WordPress, Shopify, and Wix updates', 'Page, post, menu, image, and content uploads', 'Website data entry and formatting', 'Bug fixes, routine maintenance, and quality checks', 'Product uploads and catalog updates'],
    faqs: [
      { question: 'Which website platforms do you support?', answer: 'Support is available for WordPress, Shopify, and Wix, including content updates, product uploads, formatting, and routine website administration.' },
      { question: 'Can you make one-time website updates?', answer: 'Yes. You can send a focused list of changes or arrange recurring support for ongoing website tasks.' },
      { question: 'What should I send before work begins?', answer: 'Share your website link, the changes you need, relevant logins through your preferred secure method, and any text, images, or files needed for the update.' },
    ],
    outcomes: ['A website that stays current', 'Clear, organized content', 'One reliable point of contact'],
  },
  {
    slug: 'ecommerce-product-listing',
    title: 'E-commerce Product Listing Support',
    description: 'Product listing and catalog support for Shopify, WooCommerce, and online stores. Get accurate titles, descriptions, categories, images, attributes, and variations.',
    eyebrow: 'E-commerce operations',
    contactService: 'E-commerce product listings',
    intro: 'Turn product information into clean, consistent listings that are ready for customers to browse and buy.',
    services: ['Product titles, descriptions, and specifications', 'Images, categories, tags, pricing fields, and attributes', 'Product variations and option setup', 'Bulk product uploads and spreadsheet preparation', 'Catalog cleanup and listing quality checks'],
    faqs: [
      { question: 'Which e-commerce platforms can you help with?', answer: 'Support is available for Shopify, WooCommerce, and marketplace catalog workflows, including manual updates and spreadsheet preparation.' },
      { question: 'Can you work from a spreadsheet or supplier file?', answer: 'Yes. Product information can be organized from spreadsheets, supplier files, product links, images, and other source materials you provide.' },
      { question: 'Do you check listings before they are published?', answer: 'Yes. Listings can be reviewed for missing fields, consistent formatting, categories, images, and product information before handover or publishing.' },
    ],
    outcomes: ['Consistent product data', 'Cleaner customer experience', 'Less manual catalog work'],
  },
  {
    slug: 'amazon-product-listing',
    title: 'Amazon Product Listing & Catalog Support',
    description: 'Amazon product listing, catalog data entry, variation setup, attributes, product research, and spreadsheet support for sellers who need organized catalog operations.',
    eyebrow: 'Amazon support',
    contactService: 'Amazon product listing support',
    intro: 'Get careful support for the product data and catalog tasks that help keep your Amazon store organized.',
    services: ['Amazon product listing creation and updates', 'Variation, attribute, category, and product data entry', 'Product titles, bullets, descriptions, and images', 'Catalog spreadsheets and bulk data preparation', 'Product and competitor research support'],
    faqs: [
      { question: 'What Amazon listing tasks can you support?', answer: 'Support includes product data entry, titles, bullets, descriptions, images, attributes, variations, catalog spreadsheets, and research preparation.' },
      { question: 'Can you help prepare parent and child variation data?', answer: 'Yes. Product variation details can be organized and checked in a clear spreadsheet or source file for listing work.' },
      { question: 'Do you guarantee Amazon listing approval or sales results?', answer: 'No. Amazon controls listing approval and marketplace performance. The focus is on accurate, organized catalog information and careful task completion.' },
    ],
    outcomes: ['Organized product information', 'Accurate catalog updates', 'More time for your business'],
  },
  {
    slug: 'data-entry-admin-support',
    title: 'Data Entry & Virtual Admin Support',
    description: 'Accurate online data entry, web research, spreadsheet cleanup, PDF conversion, list building, CRM updates, and virtual admin support for growing businesses.',
    eyebrow: 'Admin & data support',
    contactService: 'Data entry & admin support',
    intro: 'Hand over the repetitive online work and receive organized, accurate information that is ready to use.',
    services: ['Excel and Google Sheets data entry', 'Web research, list building, and data collection', 'PDF to Excel or Word conversion', 'Copy-paste tasks, data cleanup, and validation', 'CRM, reporting, and recurring online admin tasks'],
    faqs: [
      { question: 'What kinds of data entry can you handle?', answer: 'Support includes spreadsheet entry, website data entry, product data, web research, list building, CRM updates, and recurring online admin tasks.' },
      { question: 'Can you clean up an existing spreadsheet?', answer: 'Yes. Files can be reviewed for duplicates, formatting issues, missing values, inconsistent fields, and general organization.' },
      { question: 'How do you handle unclear source information?', answer: 'Questions or missing information are highlighted so you can confirm the correct data before the task is finalized.' },
    ],
    outcomes: ['Accurate, usable data', 'Organized online operations', 'More time for priority work'],
  },
] as const

export type ServicePage = (typeof servicePages)[number]

export function getServicePage(slug: string) {
  return servicePages.find((service) => service.slug === slug)
}
