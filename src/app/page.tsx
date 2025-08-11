// Main landing page for CustomerEye
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Star,
  ArrowRight,
  Download,
  Building2,
  Globe,
  CheckCircle,
  Play,
  Quote,
  Award,
  BarChart3,
  FileText,
  Cpu,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const featuredCompanies = [
    {
      name: "Local Restaurant",
      logo: "🍽️",
      industry: "Food & Beverages",
      reports: 156,
      rating: 4.2,
    },
    {
      name: "Tech Startup",
      logo: "💻",
      industry: "Electronics & Technology",
      reports: 342,
      rating: 4.5,
    },
    {
      name: "Fitness Center",
      logo: "💪",
      industry: "Health & Medical",
      reports: 89,
      rating: 4.1,
    },
    {
      name: "Auto Repair Shop",
      logo: "🔧",
      industry: "Vehicles & Transportation",
      reports: 124,
      rating: 3.8,
    },
    {
      name: "Beauty Salon",
      logo: "💄",
      industry: "Beauty & Well-being",
      reports: 78,
      rating: 4.3,
    },
    {
      name: "Local Bank",
      logo: "🏦",
      industry: "Money & Insurance",
      reports: 203,
      rating: 4.6,
    },
  ];

  const stats = [
    {
      label: "Reviews Analyzed",
      value: "9,950+",
      icon: Database,
      color: "text-primary",
    },
    {
      label: "Companies Covered",
      value: "1,200+",
      icon: Building2,
      color: "text-green-600",
    },
    {
      label: "Countries Supported",
      value: "7",
      icon: Globe,
      color: "text-purple-600",
    },
    {
      label: "PDF Reports Generated",
      value: "150+",
      icon: FileText,
      color: "text-secondary",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechStart Inc.",
      content:
        "Customereye&apos;s insights helped us identify key pain points we never knew existed. Our customer satisfaction improved by 40% after implementing their recommendations.",
      avatar: "👩‍💼",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "RetailCorp",
      content:
        "The AI analysis is incredibly detailed and actionable. We discovered hidden opportunities in customer feedback that transformed our product strategy.",
      avatar: "👨‍💻",
      rating: 5,
    },
    {
      name: "Lisa Rodriguez",
      role: "CEO",
      company: "ServicePro",
      content:
        "Game-changer for our business! The competitor analysis feature gave us insights that would have taken months to gather manually.",
      avatar: "👩‍🦱",
      rating: 5,
    },
  ];

  const features = [
    {
      icon: Cpu,
      title: "Advanced AI Analysis",
      description:
        "BERT model fine-tuned for 6 languages with GPT-powered insights",
    },
    {
      icon: Database,
      title: "Comprehensive Data",
      description: "9,950+ reviews from Trustpilot across 7 countries",
    },
    {
      icon: BarChart3,
      title: "20+ Industry Categories",
      description: "From restaurants to tech startups, we cover all sectors",
    },
    {
      icon: Award,
      title: "Actionable Reports",
      description: "150+ PDF reports generated with detailed insights",
    },
  ];

  const categories = [
    "Animals & Pets",
    "Beauty & Well-being",
    "Business Services",
    "Construction",
    "Education & Training",
    "Electronics & Technology",
    "Events & Entertainment",
    "Food & Beverages",
    "Health & Medical",
    "Hobbies & Crafts",
    "Home & Garden",
    "Legal Services",
    "Media & Publishing",
    "Money & Insurance",
    "Public & Local Services",
    "Restaurants & Bars",
    "Shopping & Fashion",
    "Sports",
    "Travel & Vacation",
    "Utilities",
    "Vehicles & Transportation",
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Data Collection",
      description: "We scrape reviews from Trustpilot across 7 countries",
      icon: Database,
    },
    {
      step: 2,
      title: "AI Analysis",
      description: "BERT model analyzes sentiment, GPT generates insights",
      icon: Cpu,
    },
    {
      step: 3,
      title: "Report Generation",
      description: "Get detailed PDF reports with actionable recommendations",
      icon: FileText,
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-muted"
        }
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary via-primary/90 to-primary text-primary-foreground relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <div className="mb-6 animate-fade-in">
            <Badge className="bg-secondary/20 text-secondary border-secondary/30 mb-4">
              🚀 AI-Powered Review Analytics
            </Badge>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-foreground via-primary-foreground/90 to-secondary bg-clip-text text-transparent leading-tight animate-slide-up">
            Unlock Customer Insights with AI Power
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/80 max-w-3xl mx-auto animate-fade-in-delay">
            Transform thousands of customer reviews into actionable
            intelligence. Discover what your customers really think and gain
            competitive advantages instantly.
          </p>

          {/* Search Bar */}
          <div className="bg-background/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-primary-foreground/20 animate-slide-up-delay">
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={20}
                />
                <Input
                  placeholder="Search for any company (e.g., Local Restaurant, Tech Startup...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-3 text-lg bg-background border-0 focus:ring-2 focus:ring-secondary text-foreground"
                />
              </div>
              <Button
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 font-semibold"
              >
                <Search className="mr-2" size={20} />
                Search Reports
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-primary-foreground/70 mb-8 animate-fade-in-delay-2">
            <span className="font-medium">Popular searches:</span>
            {[
              "Local Restaurant",
              "Tech Startup",
              "Fitness Center",
              "Auto Repair",
              "Beauty Salon",
            ].map((company) => (
              <button
                key={company}
                className="px-4 py-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors border border-primary-foreground/20 hover:border-secondary/50"
              >
                {company}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay-3">
            <Button
              size="lg"
              className="bg-background text-primary hover:bg-background/90 font-semibold"
            >
              <Play className="mr-2" size={20} />
              Watch Demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-background text-primary hover:bg-background/90 font-semibold"
            >
              View Sample Report
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-8 bg-muted/50 border-b">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <p className="text-muted-foreground font-medium">
              Trusted by businesses worldwide
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-muted-foreground">
              Restaurants
            </div>
            <div className="text-2xl font-bold text-muted-foreground">
              Tech Startups
            </div>
            <div className="text-2xl font-bold text-muted-foreground">
              Fitness Centers
            </div>
            <div className="text-2xl font-bold text-muted-foreground">
              Auto Shops
            </div>
            <div className="text-2xl font-bold text-muted-foreground">
              Beauty Salons
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Powered by Real Data
            </h2>
            <p className="text-xl text-muted-foreground">
              Our AI analyzes massive datasets to deliver precise insights
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/30 hover:scale-105"
              >
                <CardContent className="p-6">
                  <stat.icon
                    className={`mx-auto mb-3 ${stat.color}`}
                    size={40}
                  />
                  <div className="text-4xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Why Choose Customereye?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced AI technology meets intuitive design to deliver insights
              that matter
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300 bg-background border-0 hover:scale-105"
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <feature.icon
                      className="text-primary-foreground"
                      size={32}
                    />
                  </div>
                  <h3 className="font-semibold text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Categories */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Covering 20+ Industry Categories
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From restaurants to tech startups, we analyze businesses across
              all sectors
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-12">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-background to-muted/30 hover:scale-105"
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold text-primary text-sm group-hover:text-secondary transition-colors">
                    {category}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/reports">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                View All Reports <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Explore Reports from Growing Businesses
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what customers are saying about the world&apos;s leading
              brands across every industry
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            {featuredCompanies.map((company, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-background to-muted/30 hover:scale-105"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{company.logo}</div>
                  <h3 className="font-semibold text-primary group-hover:text-secondary transition-colors mb-1">
                    {company.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {company.industry}
                  </p>
                  <div className="flex justify-center mb-2">
                    {renderStars(company.rating)}
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-secondary/10 text-secondary border-secondary/20"
                  >
                    {company.reports} reports
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/reports">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                View All Reports <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Join thousands of satisfied customers who&apos;ve transformed
              their business with our insights
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground">
              <CardContent className="p-8">
                <Quote className="text-secondary mb-4" size={40} />
                <p className="text-lg mb-6 leading-relaxed">
                  &ldquo;{testimonials[currentTestimonial].content}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div>
                      <div className="font-semibold">
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className="text-primary-foreground/70 text-sm">
                        {testimonials[currentTestimonial].role} at{" "}
                        {testimonials[currentTestimonial].company}
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    {renderStars(testimonials[currentTestimonial].rating)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial
                      ? "bg-secondary"
                      : "bg-primary-foreground/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get comprehensive customer insights in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {howItWorks.map((step, index) => (
              <Card
                key={index}
                className="relative border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-background hover:scale-105"
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-lg bg-secondary">
                    {step.step}
                  </div>
                  <CardTitle className="text-primary">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <step.icon className="mx-auto mb-4 text-primary" size={40} />
                  <CardDescription className="text-base text-muted-foreground">
                    {step.description}
                  </CardDescription>
                </CardContent>

                {/* Connection line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-secondary to-primary transform -translate-y-1/2"></div>
                )}
              </Card>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground bg-background px-4 py-2 rounded-full shadow-sm">
              <CheckCircle className="text-green-500" size={16} />
              <span>No credit card required • Free demo reports available</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary via-primary/90 to-primary text-primary-foreground relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Unlock Your Customer Insights?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/80">
            Join thousands of businesses using Customereye to understand their
            customers better and drive growth
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-1">
                9,950+
              </div>
              <div className="text-primary-foreground/70">Reviews analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-1">7</div>
              <div className="text-primary-foreground/70">
                Countries supported
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-1">150+</div>
              <div className="text-primary-foreground/70">
                Reports generated
              </div>
            </div>
          </div>

          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <Link href="/reports">
              <Button
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground w-full md:w-auto text-lg px-8 py-3"
              >
                <Search className="mr-2" size={20} />
                Explore Demo Reports
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary w-full md:w-auto text-lg px-8 py-3"
            >
              <Download className="mr-2" size={20} />
              Request Custom Analysis
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
