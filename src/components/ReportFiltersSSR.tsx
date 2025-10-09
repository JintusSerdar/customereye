'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface Filters {
  industry: string;
  country: string;
  rating: string;
  access: string;
}

interface ReportFiltersSSRProps {
  filters: Filters;
  categories: string[];
}

export const ReportFiltersSSR = ({ filters, categories }: ReportFiltersSSRProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: keyof Filters, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    // Reset to page 1 when filters change
    params.delete('page');
    
    router.push(`/reports?${params.toString()}`);
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Industry Filter */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Industry</Label>
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
              <RadioGroupItem value="4+" id="rating-4" />
              <Label htmlFor="rating-4" className="text-sm">
                4+ Stars
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3+" id="rating-3" />
              <Label htmlFor="rating-3" className="text-sm">
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
        {/* Access Filter */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Access</Label>
          <RadioGroup
            value={filters.access}
            onValueChange={(value) => updateFilter("access", value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="access-all" />
              <Label htmlFor="access-all" className="text-sm">
                All Reports
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="FREE" id="access-free" />
              <Label htmlFor="access-free" className="text-sm">
                Free Reports
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="PREMIUM" id="access-premium" />
              <Label htmlFor="access-premium" className="text-sm">
                Premium Reports
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};
