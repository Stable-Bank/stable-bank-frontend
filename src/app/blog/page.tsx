import SiteLayout from "@/layouts/site";
import { SectionCard } from "@/components/cards";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Search, Tag } from "lucide-react";

export const metadata = {
    title: "Blog | StableBank",
    description:
        "Stay updated with the latest news, tutorials, and insights from StableBank.",
};

const categories = [
    { name: "All", slug: "all" },
    { name: "News", slug: "news" },
    { name: "Tutorials", slug: "tutorials" },
    { name: "DeFi Insights", slug: "defi" },
    { name: "Product Updates", slug: "updates" },
];

const featuredPost = {
    title: "The Future of Stablecoins: 2026 and Beyond",
    excerpt:
        "A comprehensive look at how stablecoins are reshaping global finance and what the next decade holds for digital currencies.",
    image: "/images/svg/hero-bg.svg",
    category: "DeFi Insights",
    author: "Sarah Chen",
    date: "January 27, 2026",
    readTime: "8 min read",
    slug: "future-of-stablecoins-2026",
};

const posts = [
    {
        title: "How to Send Money Across Borders Instantly",
        excerpt:
            "Step-by-step guide to using StableBank for international transfers with near-zero fees.",
        image: "/images/svg/signup-card-1.svg",
        category: "Tutorials",
        author: "Marcus Johnson",
        date: "January 25, 2026",
        readTime: "5 min read",
        slug: "send-money-instantly",
    },
    {
        title: "Introducing Virtual Cards: Spend Crypto Anywhere",
        excerpt:
            "Our newest feature lets you create virtual cards linked to your stablecoin balance.",
        image: "/images/svg/signup-card-2.svg",
        category: "Product Updates",
        author: "Elena Rodriguez",
        date: "January 22, 2026",
        readTime: "4 min read",
        slug: "virtual-cards-launch",
    },
    {
        title: "Understanding USDC vs USDT: Which to Choose?",
        excerpt:
            "An in-depth comparison of the two most popular stablecoins and their use cases.",
        image: "/images/svg/signup-card-3.svg",
        category: "DeFi Insights",
        author: "David Kim",
        date: "January 20, 2026",
        readTime: "6 min read",
        slug: "usdc-vs-usdt",
    },
    {
        title: "Security Best Practices for Your Digital Wallet",
        excerpt:
            "Essential tips to keep your stablecoins safe from phishing and other threats.",
        image: "/images/svg/signup-card-4.svg",
        category: "Tutorials",
        author: "David Kim",
        date: "January 18, 2026",
        readTime: "7 min read",
        slug: "security-best-practices",
    },
    {
        title: "StableBank Raises $50M Series B",
        excerpt:
            "We're thrilled to announce our Series B funding round to accelerate global expansion.",
        image: "/images/svg/hero-home-phone.svg",
        category: "News",
        author: "Sarah Chen",
        date: "January 15, 2026",
        readTime: "3 min read",
        slug: "series-b-funding",
    },
    {
        title: "The Rise of Decentralized Banking in Africa",
        excerpt:
            "How stablecoins are providing financial access to millions of unbanked individuals.",
        image: "/images/svg/phone-bg-hero.svg",
        category: "DeFi Insights",
        author: "Marcus Johnson",
        date: "January 12, 2026",
        readTime: "9 min read",
        slug: "defi-banking-africa",
    },
];

function BlogCard({ post, featured = false }: { post: typeof posts[0]; featured?: boolean }) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className={`group block rounded-3xl border border-white/10 overflow-hidden bg-white/[0.02] hover:bg-white/[0.05] hover:border-brand-purple/30 transition-all duration-300 ${featured ? "lg:grid lg:grid-cols-2" : ""
                }`}
        >
            {/* Image */}
            <div
                className={`relative overflow-hidden bg-gradient-to-br from-brand-purple/20 to-brand-yellow/10 ${featured ? "h-64 lg:h-full" : "h-48"
                    }`}
            >
                <div className="absolute inset-0 bg-brand-black/40" />
                <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-purple/80 text-white text-xs font-medium">
                        <Tag className="h-3 w-3" />
                        {post.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className={`p-6 ${featured ? "lg:p-8 lg:flex lg:flex-col lg:justify-center" : ""}`}>
                <h3
                    className={`font-bold text-brand-white group-hover:text-brand-yellow transition-colors ${featured ? "text-2xl sm:text-3xl mb-4" : "text-lg mb-3"
                        }`}
                >
                    {post.title}
                </h3>
                <p
                    className={`text-white/60 line-clamp-2 ${featured ? "text-base sm:text-lg mb-6" : "text-sm mb-4"
                        }`}
                >
                    {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs sm:text-sm text-white/40">
                    <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readTime}
                    </span>
                </div>

                {featured && (
                    <div className="mt-6 inline-flex items-center gap-2 text-brand-purple font-medium group-hover:gap-3 transition-all">
                        Read article
                        <ArrowRight className="h-4 w-4" />
                    </div>
                )}
            </div>
        </Link>
    );
}

export default function BlogPage() {
    return (
        <SiteLayout>
            {/* Header */}
            <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-10">
                <div className="max-w-largest mx-auto">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 sm:mb-12">
                        <div>
                            <SectionCard title="Blog" />
                            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold text-brand-white">
                                Insights & Updates
                            </h1>
                            <p className="mt-4 text-lg text-white/60 max-w-xl">
                                Stay informed with the latest news, tutorials, and deep dives
                                into the world of stablecoins and decentralized finance.
                            </p>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                className="w-full lg:w-80 h-12 pl-12 pr-4 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-purple transition-colors"
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-3 mb-10 sm:mb-12">
                        {categories.map((category, index) => (
                            <button
                                key={category.slug}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${index === 0
                                        ? "bg-brand-purple text-white"
                                        : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* Featured Post */}
                    <div className="mb-10 sm:mb-14">
                        <BlogCard post={featuredPost} featured />
                    </div>

                    {/* Posts Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {posts.map((post) => (
                            <BlogCard key={post.slug} post={post} />
                        ))}
                    </div>

                    {/* Load More */}
                    <div className="mt-12 text-center">
                        <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-white/20 text-white/70 hover:bg-white/5 hover:text-white transition-all">
                            Load more articles
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
