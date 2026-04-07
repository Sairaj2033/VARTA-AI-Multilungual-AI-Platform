import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, Clock, User, Eye, Calendar, Search, Filter, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  authorName: string;
  authorImage?: string;
  authorBio?: string;
  category: string;
  tags: string[];
  readTime: number;
  publishedAt: Date;
  views: number;
}

const sampleBlogs: BlogPost[] = [
  {
    id: '1',
    title: 'The Hidden Costs of India\'s Data Protection Bill: What Small Businesses Need to Know',
    content: `The recently passed Data Protection Bill represents a watershed moment for digital privacy in India. However, beneath the headlines celebrating this milestone lies a complex web of compliance requirements that could fundamentally reshape the startup landscape.

## The Compliance Challenge

For startups and small businesses, the bill introduces several mandatory requirements:

- **Data Protection Officer (DPO) appointment** - Companies processing significant personal data must designate a qualified DPO
- **Privacy by design implementation** - Systems must be built with privacy as a foundational principle
- **Consent management systems** - Explicit user consent tracking and management
- **Data localization requirements** - Certain categories of data must be stored within Indian borders

## Financial Implications

Our analysis of compliance costs reveals concerning figures:

- Initial setup: ₹5-15 lakhs for basic compliance infrastructure
- Annual compliance costs: ₹2-8 lakhs depending on data volume
- Legal consultation fees: ₹1-3 lakhs annually
- Technology upgrades: ₹3-10 lakhs for privacy-compliant systems

## The Innovation Dilemma

While the bill strengthens consumer protection, it creates a paradox for the startup ecosystem. Young companies, already operating on razor-thin margins, must now allocate significant resources to compliance rather than innovation.

## Recommendations for Startups

1. **Start early**: Begin compliance planning now, before the 18-month deadline
2. **Seek government support**: Advocate for MSME-specific compliance assistance
3. **Collaborate**: Form industry groups to share compliance costs
4. **Invest in privacy-first architecture**: Build systems that inherently protect user data

The bill's success will ultimately depend on how well India balances consumer protection with fostering innovation.`,
    excerpt: 'An in-depth analysis of how India\'s new data protection legislation will impact startups and small businesses, including hidden compliance costs and strategic recommendations.',
    slug: 'data-protection-bill-startup-impact',
    coverImage: undefined,
    authorName: 'Dr. Priya Sharma',
    authorImage: undefined,
    authorBio: 'Technology policy researcher at IIT Delhi with 12 years of experience in digital governance and startup ecosystem analysis.',
    category: 'Policy Analysis',
    tags: ['Data Protection', 'Startups', 'Policy', 'Compliance'],
    readTime: 8,
    publishedAt: new Date(Date.now() - 7200000), // 2 hours ago
    views: 1247
  },
  {
    id: '2',
    title: 'NavIC vs GPS: Why India\'s Indigenous Navigation System Could Change Everything',
    content: `India's Navigation with Indian Constellation (NavIC) system is more than just an alternative to GPS—it represents a strategic shift toward technological sovereignty that could have far-reaching implications for national security, commercial applications, and global positioning dynamics.

## Technical Superiority in Regional Context

NavIC offers several advantages over GPS within the Indian subcontinent:

- **Higher accuracy**: 1-3 meters compared to GPS's 3-5 meters in urban areas
- **Better signal penetration**: Optimized for Indian geographical and atmospheric conditions
- **Dual-frequency capability**: L5 and S-band frequencies provide better building penetration
- **Regional focus**: Concentrated coverage ensures optimal performance in target areas

## Strategic Independence

The timing of NavIC's civilian rollout is particularly significant given:

- Increasing global tensions affecting satellite access
- China's BeiDou expansion in the Indo-Pacific region
- European Galileo system's growing influence
- Russia's GLONASS reliability concerns during conflicts

## Commercial Applications

Early adopters are already exploring innovative use cases:

### Transportation & Logistics
- **Last-mile delivery optimization** in dense urban areas
- **Fleet management** with centimeter-level precision
- **Autonomous vehicle development** with Indian-specific mapping

### Financial Services
- **Transaction verification** through location-based authentication
- **Rural banking** expansion using precise location services
- **Insurance assessments** for agricultural and property claims

### Agriculture
- **Precision farming** techniques adapted for Indian crop patterns
- **Weather-based crop insurance** with accurate location correlation
- **Supply chain tracking** from farm to market

## Implementation Challenges

Despite its potential, NavIC faces several hurdles:

1. **Device ecosystem development** - Limited smartphone and automotive integration
2. **Industry adoption costs** - Retrofitting existing systems requires investment
3. **International standardization** - Ensuring compatibility with global systems
4. **Skilled workforce development** - Training engineers and technicians

## Global Implications

NavIC's success could inspire other nations to develop regional navigation systems, potentially fragmenting the GPS-dominated landscape. This could lead to:

- Enhanced global navigation redundancy
- Reduced single-point-of-failure risks
- Increased geopolitical bargaining power for system operators
- New standards for international navigation cooperation

The next five years will be crucial in determining whether NavIC becomes a niche regional solution or a globally significant navigation system.`,
    excerpt: 'Exploring how India\'s NavIC navigation system offers superior regional accuracy and strategic independence, potentially revolutionizing everything from logistics to national security.',
    slug: 'navic-indigenous-navigation-system-analysis',
    coverImage: undefined,
    authorName: 'Rajesh Kumar',
    authorImage: undefined,
    authorBio: 'Aerospace engineer and technology journalist covering space technology and satellite systems for over 15 years.',
    category: 'Technology',
    tags: ['NavIC', 'GPS', 'Navigation', 'Technology', 'Independence'],
    readTime: 12,
    publishedAt: new Date(Date.now() - 21600000), // 6 hours ago
    views: 892
  },
  {
    id: '3',
    title: 'The AI Revolution in Bengaluru: Inside India\'s New Tech Hub\'s Ambitious Plans',
    content: `Bengaluru's new AI research center represents more than just another tech facility—it's a strategic bet on India's ability to compete in the global artificial intelligence race. Our exclusive inside look reveals ambitious plans that could reshape India's position in the AI landscape.

## The Vision

The center, backed by ₹2,500 crores in government funding and private investment, aims to:

- Develop AI solutions specifically for Indian challenges
- Train 50,000 AI professionals over the next five years
- Incubate 200+ AI startups annually
- Create industry-academic partnerships with global tech giants

## Focus Areas

### Language AI
Given India's linguistic diversity, the center prioritizes:
- **Multilingual AI models** supporting 22 official languages
- **Real-time translation systems** for government services
- **Voice recognition** optimized for Indian accents and dialects

### Healthcare AI
- **Diagnostic imaging** for rural healthcare centers
- **Drug discovery** using Indian genetic databases
- **Telemedicine platforms** with AI-powered initial screening

### Agricultural Intelligence
- **Crop yield prediction** using satellite imagery and weather data
- **Pest and disease identification** through mobile applications
- **Market price forecasting** for better farmer decision-making

## Global Competition Context

The timing is critical as:

- China leads in AI publications and patents
- The US dominates in AI research funding and talent
- Europe focuses on AI ethics and regulation
- India seeks to carve out its unique position

## Talent Challenge

Despite the ambitious plans, the center faces a significant talent shortage:

- **Current gap**: 500,000 AI professionals needed by 2025
- **Education pipeline**: Only 50,000 graduates annually with relevant skills
- **Brain drain**: 40% of Indian AI talent works abroad
- **Skill mismatch**: Industry needs vs. academic curriculum gaps

## Strategic Partnerships

Key collaborations include:

### International
- **MIT collaboration** on federated learning research
- **Stanford partnership** for AI ethics frameworks
- **Oxford joint program** for natural language processing

### Domestic
- **IIT network integration** for research coordination
- **Industry partnerships** with TCS, Infosys, and Wipro
- **Startup ecosystem** connection through incubation programs

## Economic Impact Projections

Conservative estimates suggest the center could:

- Generate ₹50,000 crores in economic value by 2030
- Create 300,000 direct and indirect jobs
- Attract ₹15,000 crores in foreign investment
- Position India among top 3 global AI hubs

The success of this initiative could determine whether India becomes an AI leader or remains a technology services provider to global AI companies.`,
    excerpt: 'An exclusive look inside Bengaluru\'s new AI research center, examining its ambitious plans to position India as a global leader in artificial intelligence innovation.',
    slug: 'bengaluru-ai-revolution-tech-hub-analysis',
    coverImage: undefined,
    authorName: 'Maria Rodriguez',
    authorImage: undefined,
    authorBio: 'Senior technology correspondent covering emerging markets and innovation hubs across Asia-Pacific.',
    category: 'Innovation',
    tags: ['AI', 'Bengaluru', 'Technology', 'Innovation', 'Research'],
    readTime: 10,
    publishedAt: new Date(Date.now() - 86400000), // 1 day ago
    views: 2156
  }
];

const categories = ['All', 'Policy Analysis', 'Technology', 'Innovation', 'Opinion', 'Economics'];

export default function BlogsPage() {
  const [, params] = useRoute('/blogs/:slug');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredBlogs, setFilteredBlogs] = useState(sampleBlogs);

  useEffect(() => {
    let filtered = sampleBlogs;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredBlogs(filtered);
  }, [searchTerm, selectedCategory]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // If we have a slug parameter, show individual blog post
  if (params?.slug) {
    const blog = sampleBlogs.find(b => b.slug === params.slug);
    if (!blog) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black mb-4">Blog post not found</h1>
            <Link href="/blogs">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Back to Blogs
              </Button>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white border-b border-blue-100 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link href="/blogs">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blogs & Insights
              </Button>
            </Link>
          </div>
        </header>

        {/* Blog Content */}
        <article className="max-w-4xl mx-auto px-4 py-8">
          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-black leading-tight mb-6">
            {blog.title}
          </h1>

          {/* Author Info */}
          <div className="flex items-center gap-4 mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {blog.authorName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-black">{blog.authorName}</h3>
              <p className="text-sm text-gray-700 mb-2">{blog.authorBio}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(blog.publishedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {blog.readTime} min read
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {blog.views.toLocaleString()} views
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {blog.tags.map(tag => (
              <Badge key={tag} className="bg-blue-100 text-blue-800 border-blue-200">
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-black leading-relaxed whitespace-pre-line">
              {blog.content}
            </div>
          </div>
        </article>
      </div>
    );
  }

  // Blog listing page
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex justify-start mb-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to News
                </Button>
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-black mb-4">Blogs & Insights</h1>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Expert opinions, deep dives, and in-depth commentary on the stories that shape our world
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 
                    "bg-blue-600 hover:bg-blue-700 text-white" : 
                    "text-blue-600 border-blue-200 hover:bg-blue-50"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {filteredBlogs.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-black mb-2">No blogs found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBlogs.map((blog) => (
                  <Card key={blog.id} className="border-blue-100 hover:border-blue-300 transition-all duration-200 hover:shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          {blog.category}
                        </Badge>
                        <span className="text-sm text-gray-500">{formatDate(blog.publishedAt)}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-black leading-tight line-clamp-2 hover:text-blue-700 transition-colors">
                        <Link href={`/blogs/${blog.slug}`}>
                          {blog.title}
                        </Link>
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {blog.authorName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-black">{blog.authorName}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {blog.readTime} min
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {blog.views}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {blog.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs text-blue-600 border-blue-200">
                              #{tag}
                            </Badge>
                          ))}
                          {blog.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs text-gray-500 border-gray-200">
                              +{blog.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                        <Link href={`/blogs/${blog.slug}`}>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Read more
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Trending Posts */}
              <Card className="border-blue-100">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-black flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Trending
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sampleBlogs.slice(0, 3).map((blog, index) => (
                      <div key={blog.id} className="pb-4 border-b border-blue-50 last:border-b-0">
                        <span className="text-2xl font-bold text-blue-600">#{index + 1}</span>
                        <Link href={`/blogs/${blog.slug}`}>
                          <h4 className="text-sm font-medium text-black hover:text-blue-700 transition-colors line-clamp-2 mt-1">
                            {blog.title}
                          </h4>
                        </Link>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <Eye className="h-3 w-3" />
                          {blog.views.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}