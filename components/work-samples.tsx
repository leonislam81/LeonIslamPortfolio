import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, FilePenLine, Globe2, PackageSearch, TableProperties } from 'lucide-react'

const samples = [
  {
    icon: Globe2,
    service: 'Website management',
    title: 'Keeping a business website accurate and current',
    scenario: 'A practical support workflow for routine WordPress, Shopify, or Wix updates.',
    tasks: ['Update pages, posts, menus, images, and contact details', 'Check formatting, links, and mobile presentation', 'Organize recurring website tasks in one clear list'],
    deliverable: 'An updated, reviewed website with a clear record of completed changes.',
    href: '/services/website-management',
  },
  {
    icon: FilePenLine,
    service: 'E-commerce listings',
    title: 'Turning product data into clean store listings',
    scenario: 'A catalog-support workflow for Shopify, WooCommerce, and marketplace stores.',
    tasks: ['Prepare titles, descriptions, images, categories, and tags', 'Add attributes, prices, variants, and product specifications', 'Review listing consistency before publishing'],
    deliverable: 'A structured product catalog that is ready for customers to browse.',
    href: '/services/ecommerce-product-listing',
  },
  {
    icon: PackageSearch,
    service: 'Amazon catalog support',
    title: 'Preparing organized product information for Amazon',
    scenario: 'A detail-focused workflow for product data, variations, and catalog preparation.',
    tasks: ['Organize titles, bullets, descriptions, images, and attributes', 'Prepare variation and category information', 'Use spreadsheets to check and organize catalog data'],
    deliverable: 'A clear catalog-data package ready for Amazon listing work or review.',
    href: '/services/amazon-product-listing',
  },
  {
    icon: TableProperties,
    service: 'Data & admin support',
    title: 'Making business data easier to use',
    scenario: 'A reliable workflow for research, spreadsheet cleanup, and repeatable admin tasks.',
    tasks: ['Collect, enter, clean, and validate online data', 'Build usable lists in Excel or Google Sheets', 'Format files so information is easy to review and use'],
    deliverable: 'An organized, checked file and a simple summary of the completed work.',
    href: '/services/data-entry-admin-support',
  },
]

export function WorkSamples() {
  return (
    <section id="work-samples" className="relative overflow-hidden bg-background py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-portfolio-primary/5 to-transparent" />
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-portfolio-primary/20 bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[.16em] text-portfolio-primary shadow-sm">
            Work samples
          </span>
          <h2 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            A clear look at how your work can move forward.
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            These representative workflows show the tasks, checks, and handover you can expect for each support area. They are examples of service scope, not client case studies.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-5 lg:grid-cols-2">
          {samples.map((sample) => {
            const Icon = sample.icon

            return (
              <article key={sample.service} className="group rounded-[2rem] border border-border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-portfolio-primary/30 hover:shadow-xl sm:p-8">
                <div className="flex items-start justify-between gap-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-portfolio-primary/10 text-portfolio-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">{sample.service}</span>
                </div>
                <h3 className="mt-6 text-2xl font-bold tracking-tight text-foreground">{sample.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{sample.scenario}</p>
                <ul className="mt-6 space-y-3">
                  {sample.tasks.map((task) => (
                    <li key={task} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-portfolio-accent" />
                      {task}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-2xl border border-portfolio-primary/15 bg-portfolio-primary/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[.14em] text-portfolio-primary">Expected handover</p>
                  <p className="mt-2 text-sm leading-6 text-foreground">{sample.deliverable}</p>
                </div>
                <Link href={sample.href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-portfolio-primary transition hover:text-portfolio-accent">
                  Explore this service <ArrowUpRight className="h-4 w-4" />
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
