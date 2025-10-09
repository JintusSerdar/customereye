"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Filter, Grid, List, Star, Users, Building2, Globe, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Report {
  id: string;
  company: string;
  companySlug: string;
  industry: string;
  category?: string;
  country: string;
  rating: number;
  reviewCount: number;
  summary: string;
  tags: string[];
  reportType: 'FREE' | 'PREMIUM';
  language: string;
  isPaid: boolean;
  logo: string;
  date: string;
  dataFilesCount: number;
  sectionsCount: number;
}

interface Filters {
  industry: string;
  rating: string;
  country: string;
  isPaid: string;
}

interface ReportsResponse {
  reports: Report[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ReportFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const categories = [
  "Animals & Pets",
  "Beauty & Wellbeing",
  "Business Services",
  "Construction",
  "Education & Training",
  "Electronics & Technology",
  "Events & Entertainment",
  "Food & Beverages",
  "Health & Medical",
  "Hobbies & Crafts",
  "Home & Garden",
  "Legal & Government",
  "Media & Publishing",
  "Money & Insurance",
  "Other",
  "Public Services",
  "Restaurants & Bars",
  "Shopping & Fashion",
  "Sports",
  "Travel & Vacation",
  "Utilities",
  "Vehicles & Transportation"
];

const ReportFilters = ({ filters, onFiltersChange }: ReportFiltersProps) => {
  const updateFilter = (key: keyof Filters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Industry Filter */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Category</Label>
          <RadioGroup
            value={filters.industry}
            onValueChange={(value) => updateFilter("industry", value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="industry-all" />
              <Label htmlFor="industry-all" className="text-sm">
                All Categories
              </Label>
            </div>
            {categories.map((cat) => (
              <div className="flex items-center space-x-2" key={cat}>
                <RadioGroupItem
                  value={cat}
                  id={`industry-${cat.replace(/\s+/g, "-")}`}
                />
                <Label
                  htmlFor={`industry-${cat.replace(/\s+/g, "-")}`}
                  className="text-sm"
                >
                  {cat}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <Separator />
        {/* Rating Filter */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Rating</Label>
          <RadioGroup
            value={filters.rating}
            onValueChange={(value) => updateFilter("rating", value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="rating-all" />
              <Label htmlFor="rating-all" className="text-sm">
                All Ratings
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4+" id="rating-4plus" />
              <Label htmlFor="rating-4plus" className="text-sm">
                4+ Stars
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3+" id="rating-3plus" />
              <Label htmlFor="rating-3plus" className="text-sm">
                3+ Stars
              </Label>
            </div>
          </RadioGroup>
        </div>
        <Separator />
        {/* Country Filter */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Country</Label>
          <RadioGroup
            value={filters.country}
            onValueChange={(value) => updateFilter("country", value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="country-all" />
              <Label htmlFor="country-all" className="text-sm">
                All Countries
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="US" id="country-us" />
              <Label htmlFor="country-us" className="text-sm">
                United States
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="CA" id="country-ca" />
              <Label htmlFor="country-ca" className="text-sm">
                Canada
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="UK" id="country-uk" />
              <Label htmlFor="country-uk" className="text-sm">
                United Kingdom
              </Label>
            </div>
          </RadioGroup>
        </div>
        <Separator />
        {/* Payment Filter */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Access</Label>
          <RadioGroup
            value={filters.isPaid}
            onValueChange={(value) => updateFilter("isPaid", value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="paid-all" />
              <Label htmlFor="paid-all" className="text-sm">
                All Reports
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="free" id="paid-free" />
              <Label htmlFor="paid-free" className="text-sm">
                Free Only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paid" id="paid-paid" />
              <Label htmlFor="paid-paid" className="text-sm">
                Premium Only
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("a-z");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    industry: "all",
    rating: "all",
    country: "all",
    isPaid: "all",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Fetch reports
  const fetchReports = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchTerm) params.append('search', searchTerm);
      if (filters.industry !== 'all') params.append('industry', filters.industry);
      if (filters.country !== 'all') params.append('country', filters.country);
      if (filters.rating !== 'all') params.append('rating', filters.rating);
      if (filters.isPaid !== 'all') params.append('isPaid', filters.isPaid);

      // Add sorting parameters
      let actualSortBy = 'companyName'; // Default to company name
      let actualSortOrder = 'asc'; // Default to ascending

      if (sortBy === 'most-recent') {
        actualSortBy = 'publishedAt';
        actualSortOrder = 'desc';
      } else if (sortBy === 'most-popular') {
        actualSortBy = 'reviewCount';
        actualSortOrder = 'desc';
      } else if (sortBy === 'highest-rated') {
        actualSortBy = 'rating';
        actualSortOrder = 'desc';
      } else if (sortBy === 'a-z') {
        actualSortBy = 'companyName';
        actualSortOrder = 'asc';
      } else if (sortBy === 'z-a') {
        actualSortBy = 'companyName';
        actualSortOrder = 'desc';
      }
      
      params.append('sortBy', actualSortBy);
      params.append('sortOrder', actualSortOrder);

      // Add cache busting parameter
      params.append('_t', Date.now().toString());
      
      const response = await fetch(`/api/reports?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      
      const data: ReportsResponse = await response.json();
      setReports(data.reports);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters, pagination.limit, sortBy]);

  // Use server-side pagination - no client-side filtering needed
  const currentReports = reports;
  const currentPage = pagination.page;
  const totalPages = pagination.totalPages;

  const handlePageChange = (page: number) => {
    fetchReports(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  useEffect(() => {
    fetchReports(1);
  }, [fetchReports]);

  if (loading && reports.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Error Loading Reports</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => fetchReports(1)}>Try Again</Button>
        </div>
      </div>
    );
  }

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
                {pagination.total} reports found
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
            {currentReports.length === 0 ? (
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
                  <Card key={report.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{report.logo}</div>
                          <div>
                            <CardTitle className="text-lg">{report.company}</CardTitle>
                            <p className="text-sm text-muted-foreground">{report.industry}</p>
                          </div>
                        </div>
                        <Badge variant={report.reportType === 'FREE' ? 'secondary' : 'default'}>
                          {report.reportType}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{report.rating || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{report.reviewCount?.toLocaleString() || 'N/A'} reviews</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            <span>{report.country}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {report.summary}
                        </p>
                        
                        <div className="flex flex-wrap gap-1">
                          {report.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {report.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{report.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(report.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              <span>{report.dataFilesCount} files</span>
                            </div>
                          </div>
                          <Link href={`/reports/${report.companySlug}`}>
                            <Button size="sm">View Report</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {/* Pagination */}
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
                    <div key={`page-${index}-${page}`}>
                      {page === "..." ? (
                        <span className="text-muted-foreground">
                          ...
                        </span>
                      ) : (
                        <Button
                          variant={page === currentPage ? "default" : "outline"}
                          onClick={() => handlePageChange(page as number)}
                          className="w-10 h-10 flex items-center justify-center"
                        >
                          {page}
                        </Button>
                      )}
                    </div>
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
}