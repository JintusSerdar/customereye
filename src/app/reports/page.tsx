// Reports page for CustomerEye
"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReportCard from "@/components/ReportCard";
import ReportFilters from "@/components/ReportFilters";
import { FrontendReport, Filters } from "@/types";

const mockReports: FrontendReport[] = [
  {
    id: 1,
    company: "Advance America",
    industry: "Money & Insurance",
    rating: 4.8,
    reviewCount: 15420,
    summary:
      "Advance America excels in customer service with 93.39% 5-star ratings. Customers praise helpful staff, easy processes, and fast service. Key strengths include friendly interactions and consistent reliability. The company shows significant improvement in customer engagement since 2023.",
    tags: [
      "Payday Loans",
      "Financial Services",
      "Customer Service",
      "Quick Loans",
      "Reliable",
    ],
    reportType: "Premium",
    language: "English",
    date: "2024-01-15",
    isPaid: true,
    logo: "🏦",
  },
  {
    id: 2,
    company: "LocalBite Restaurant",
    industry: "Restaurants & Bars",
    rating: 4.1,
    reviewCount: 287,
    summary:
      "LocalBite Restaurant delivers quality dining experiences with farm-to-table focus. Customers appreciate fresh ingredients and friendly service, while some note limited menu options.",
    tags: ["Restaurant", "Farm-to-Table", "Local"],
    reportType: "Free",
    language: "English",
    date: "2024-01-12",
    isPaid: false,
    logo: "🍽️",
  },
  {
    id: 3,
    company: "TechFlow Software",
    industry: "Electronics & Technology",
    rating: 3.9,
    reviewCount: 156,
    summary:
      "TechFlow Software provides solid business solutions with good customer support. Users value the intuitive interface, though some request more advanced features and faster updates.",
    tags: ["Software", "Business", "SaaS"],
    reportType: "Premium",
    language: "English",
    date: "2024-01-10",
    isPaid: true,
    logo: "💻",
  },
  {
    id: 4,
    company: "Wellness First Clinic",
    industry: "Health & Medical",
    rating: 4.2,
    reviewCount: 198,
    summary:
      "Wellness First Clinic offers personalized healthcare with caring staff. Patients appreciate the attention to detail and comprehensive care, though wait times can be lengthy.",
    tags: ["Healthcare", "Wellness", "Clinic"],
    reportType: "Free",
    language: "English",
    date: "2024-01-08",
    isPaid: false,
    logo: "🏥",
  },
  {
    id: 5,
    company: "CraftWorks Furniture",
    industry: "Shopping & Fashion",
    rating: 4.0,
    reviewCount: 124,
    summary:
      "CraftWorks Furniture delivers quality handcrafted pieces with excellent craftsmanship. Customers love the unique designs and durability, while some mention longer delivery times.",
    tags: ["Furniture", "Handcrafted", "Retail"],
    reportType: "Premium",
    language: "English",
    date: "2024-01-05",
    isPaid: true,
    logo: "🪑",
  },
  {
    id: 6,
    company: "BrightStart Education",
    industry: "Education & Training",
    rating: 4.4,
    reviewCount: 89,
    summary:
      "BrightStart Education provides innovative learning programs with dedicated teachers. Parents appreciate the personalized approach and progress tracking, though class sizes are growing.",
    tags: ["Education", "Learning", "Children"],
    reportType: "Free",
    language: "English",
    date: "2024-01-03",
    isPaid: false,
    logo: "📚",
  },
  {
    id: 7,
    company: "EcoClean Services",
    industry: "Business Services",
    rating: 3.8,
    reviewCount: 203,
    summary:
      "EcoClean Services offers reliable cleaning with eco-friendly products. Clients value the thorough work and environmental commitment, though some note occasional scheduling issues.",
    tags: ["Cleaning", "Eco-Friendly", "Services"],
    reportType: "Premium",
    language: "English",
    date: "2024-01-01",
    isPaid: true,
    logo: "🧹",
  },
  {
    id: 8,
    company: "FitLife Gym",
    industry: "Sports",
    rating: 4.1,
    reviewCount: 167,
    summary:
      "FitLife Gym provides excellent fitness facilities with knowledgeable trainers. Members appreciate the variety of classes and equipment, while some mention peak hour crowding.",
    tags: ["Fitness", "Gym", "Wellness"],
    reportType: "Free",
    language: "English",
    date: "2023-12-28",
    isPaid: false,
    logo: "💪",
  },
  {
    id: 9,
    company: "Pawsome Pet Care",
    industry: "Animals & Pets",
    rating: 4.5,
    reviewCount: 134,
    summary:
      "Pawsome Pet Care provides exceptional pet grooming and boarding services. Pet owners appreciate the gentle care and attention to detail, though some mention booking difficulties during peak seasons.",
    tags: ["Pet Care", "Grooming", "Boarding"],
    reportType: "Premium",
    language: "English",
    date: "2023-12-25",
    isPaid: true,
    logo: "🐾",
  },
  {
    id: 10,
    company: "Beauty Haven Spa",
    industry: "Beauty & Well-being",
    rating: 4.2,
    reviewCount: 189,
    summary:
      "Beauty Haven Spa offers luxurious spa treatments and beauty services. Clients love the relaxing atmosphere and skilled therapists, though some note premium pricing for services.",
    tags: ["Spa", "Beauty", "Wellness"],
    reportType: "Free",
    language: "English",
    date: "2023-12-22",
    isPaid: false,
    logo: "💆‍♀️",
  },
  {
    id: 11,
    company: "BuildRight Construction",
    industry: "Construction",
    rating: 4.0,
    reviewCount: 156,
    summary:
      "BuildRight Construction delivers quality home renovations and construction projects. Clients appreciate the craftsmanship and reliability, though some mention project timeline delays.",
    tags: ["Construction", "Renovation", "Home Improvement"],
    reportType: "Premium",
    language: "English",
    date: "2023-12-20",
    isPaid: true,
    logo: "🏗️",
  },
  {
    id: 12,
    company: "Creative Corner Studio",
    industry: "Hobbies & Crafts",
    rating: 4.3,
    reviewCount: 98,
    summary:
      "Creative Corner Studio offers art classes and craft workshops for all ages. Students love the creative environment and skilled instructors, though some mention limited class availability.",
    tags: ["Art", "Crafts", "Workshops"],
    reportType: "Free",
    language: "English",
    date: "2023-12-18",
    isPaid: false,
    logo: "🎨",
  },
  {
    id: 13,
    company: "Garden Oasis Landscaping",
    industry: "Home & Garden",
    rating: 4.1,
    reviewCount: 145,
    summary:
      "Garden Oasis Landscaping creates beautiful outdoor spaces and garden designs. Clients appreciate the attention to detail and seasonal maintenance, though some mention weather-dependent scheduling.",
    tags: ["Landscaping", "Garden Design", "Outdoor"],
    reportType: "Premium",
    language: "English",
    date: "2023-12-15",
    isPaid: true,
    logo: "🌿",
  },
  {
    id: 14,
    company: "Legal Shield Partners",
    industry: "Legal Services",
    rating: 3.9,
    reviewCount: 112,
    summary:
      "Legal Shield Partners provides accessible legal services for small businesses and individuals. Clients value the affordable rates and clear communication, though some mention limited practice areas.",
    tags: ["Legal", "Business Law", "Consultation"],
    reportType: "Free",
    language: "English",
    date: "2023-12-12",
    isPaid: false,
    logo: "⚖️",
  },
  {
    id: 15,
    company: "Local News Network",
    industry: "Media & Publishing",
    rating: 4.0,
    reviewCount: 178,
    summary:
      "Local News Network delivers community-focused journalism and local news coverage. Readers appreciate the in-depth local reporting, though some mention limited digital content.",
    tags: ["News", "Local Media", "Journalism"],
    reportType: "Premium",
    language: "English",
    date: "2023-12-10",
    isPaid: true,
    logo: "📰",
  },
  {
    id: 16,
    company: "Community Credit Union",
    industry: "Money & Insurance",
    rating: 4.2,
    reviewCount: 234,
    summary:
      "Community Credit Union offers personalized banking services with competitive rates. Members appreciate the local focus and friendly service, though some mention limited branch hours.",
    tags: ["Banking", "Credit Union", "Financial Services"],
    reportType: "Free",
    language: "English",
    date: "2023-12-08",
    isPaid: false,
    logo: "🏦",
  },
  {
    id: 17,
    company: "City Services Plus",
    industry: "Public & Local Services",
    rating: 3.8,
    reviewCount: 167,
    summary:
      "City Services Plus provides essential local government services and community programs. Residents appreciate the accessibility and helpful staff, though some mention processing delays.",
    tags: ["Local Government", "Community Services", "Public"],
    reportType: "Premium",
    language: "English",
    date: "2023-12-05",
    isPaid: true,
    logo: "🏛️",
  },
  {
    id: 18,
    company: "Power Solutions Co",
    industry: "Utilities",
    rating: 4.1,
    reviewCount: 189,
    summary:
      "Power Solutions Co provides reliable energy services and utility management. Customers appreciate the responsive customer service and energy efficiency programs, though some mention billing complexity.",
    tags: ["Energy", "Utilities", "Efficiency"],
    reportType: "Free",
    language: "English",
    date: "2023-12-03",
    isPaid: false,
    logo: "⚡",
  },
  {
    id: 19,
    company: "Reliable Transport",
    industry: "Vehicles & Transportation",
    rating: 4.0,
    reviewCount: 145,
    summary:
      "Reliable Transport offers dependable delivery and transportation services. Clients value the on-time delivery and professional drivers, though some mention peak season pricing.",
    tags: ["Transportation", "Delivery", "Logistics"],
    reportType: "Premium",
    language: "English",
    date: "2023-12-01",
    isPaid: true,
    logo: "🚚",
  },
  {
    id: 20,
    company: "Event Masters",
    industry: "Events & Entertainment",
    rating: 4.3,
    reviewCount: 123,
    summary:
      "Event Masters creates memorable events and entertainment experiences. Clients love the creativity and attention to detail, though some mention advance booking requirements.",
    tags: ["Events", "Entertainment", "Planning"],
    reportType: "Free",
    language: "English",
    date: "2023-11-28",
    isPaid: false,
    logo: "🎉",
  },
];

const ReportsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("most-recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    industry: "all",
    rating: "all",
    reportType: "all",
    language: "all",
    isPaid: "all",
  });

  const itemsPerPage = 9; // Show 9 items per page (3x3 grid)

  // Filter and sort reports
  const filteredReports = mockReports
    .filter((report) => {
      const matchesSearch =
        report.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesIndustry =
        filters.industry === "all" || report.industry === filters.industry;
      const matchesRating =
        filters.rating === "all" ||
        (filters.rating === "4+" && report.rating >= 4) ||
        (filters.rating === "3+" && report.rating >= 3);
      const matchesType =
        filters.reportType === "all" ||
        report.reportType === filters.reportType;
      const matchesPaid =
        filters.isPaid === "all" ||
        (filters.isPaid === "free" && !report.isPaid) ||
        (filters.isPaid === "paid" && report.isPaid);
      const matchesLanguage =
        filters.language === "all" || report.language === filters.language;
      return (
        matchesSearch &&
        matchesIndustry &&
        matchesRating &&
        matchesType &&
        matchesPaid &&
        matchesLanguage
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "a-z":
          return a.company.localeCompare(b.company);
        case "z-a":
          return b.company.localeCompare(a.company);
        case "most-popular":
          return b.reviewCount - a.reviewCount;
        case "highest-rated":
          return b.rating - a.rating;
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, filters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Explore Demo Reports
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Browse our comprehensive library of AI-generated customer insight
              reports across all industries
            </p>
            {/* Search bar */}
            <div className="relative max-w-2xl mx-auto">
              <Input
                type="text"
                placeholder="Search companies, industries, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-14 pl-6 pr-16 text-lg bg-background text-foreground border-0 shadow-lg"
              />
              <Search className="absolute right-4 top-4 h-6 w-6 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
      {/* Controls */}
      <div className="bg-background border-b sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="most-recent">Most Recent</SelectItem>
                    <SelectItem value="most-popular">
                      Most Popular
                    </SelectItem>
                    <SelectItem value="highest-rated">Highest Rated</SelectItem>
                    <SelectItem value="a-z">A-Z</SelectItem>
                    <SelectItem value="z-a">Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {filteredReports.length} reports found
              </span>
              <div className="flex items-center gap-1 border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Filters sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <ReportFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          )}
          {/* Reports grid/list */}
          <div className="flex-1">
            {filteredReports.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold text-muted-foreground mb-4">
                  No reports found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {currentReports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
            {/* Pagination placeholder */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  {getPageNumbers().map((page, index) => (
                    <>
                      {page === "..." ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="text-muted-foreground"
                        >
                          ...
                        </span>
                      ) : (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          onClick={() => handlePageChange(page as number)}
                          className="w-10 h-10 flex items-center justify-center"
                        >
                          {page}
                        </Button>
                      )}
                    </>
                  ))}
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
