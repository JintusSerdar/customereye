import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

export interface Filters {
  industry: string;
  rating: string;
  reportType: string;
  language: string;
  isPaid: string;
}

interface ReportFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const categories = [
  "Animals & Pets",
  "Beauty Well-being",
  "Business Services",
  "Construction",
  "Education Training",
  "Electronics Technology",
  "Events Entertainment",
  "Food Beverages",
  "Health Medical",
  "Hobbies Crafts",
  "Home Garden",
  "Legal Services",
  "Media Publishing",
  "Money Insurance",
  "Public Local Services",
  "Restaurants Bars",
  "Shopping Fashion",
  "Sports",
  "Travel Vacation",
  "Utilities",
  "Vehicles Transportation",
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
        {/* Report Type Filter */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">
            Report Type
          </Label>
          <RadioGroup
            value={filters.reportType}
            onValueChange={(value) => updateFilter("reportType", value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="type-all" />
              <Label htmlFor="type-all" className="text-sm">
                All Types
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Free" id="type-free" />
              <Label htmlFor="type-free" className="text-sm">
                Free Reports
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Premium" id="type-premium" />
              <Label htmlFor="type-premium" className="text-sm">
                Premium Reports
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
        <Separator />
        {/* Language Filter */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Language</Label>
          <RadioGroup
            value={filters.language}
            onValueChange={(value) => updateFilter("language", value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="lang-all" />
              <Label htmlFor="lang-all" className="text-sm">
                All Languages
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="English" id="lang-en" />
              <Label htmlFor="lang-en" className="text-sm">
                English
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Spanish" id="lang-es" />
              <Label htmlFor="lang-es" className="text-sm">
                Spanish
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="French" id="lang-fr" />
              <Label htmlFor="lang-fr" className="text-sm">
                French
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportFilters;
