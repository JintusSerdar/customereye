import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Star, Calendar, Users, Download, Eye } from "lucide-react";

export interface Report {
  id: number;
  company: string;
  industry: string;
  rating: number;
  reviewCount: number;
  summary: string;
  tags: string[];
  reportType: string;
  language: string;
  date: string;
  isPaid: boolean;
  logo: string;
}

interface ReportCardProps {
  report: Report;
  viewMode: "grid" | "list";
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const ReportCard = ({ report, viewMode }: ReportCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const cardContent = (
    <>
      {viewMode === "list" ? (
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Logo */}
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
              {report.logo}
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold mb-1">{report.company}</h3>
                  <p className="text-muted-foreground">{report.industry}</p>
                </div>
                <div className="flex items-center gap-2">
                  {report.isPaid ? (
                    <Badge
                      variant="default"
                      className="bg-secondary text-secondary-foreground"
                    >
                      Premium
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Free</Badge>
                  )}
                </div>
              </div>
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {report.summary}
              </p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{report.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{formatNumber(report.reviewCount)} reviews</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(report.date)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {report.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {report.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{report.tags.length - 3} more
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {report.isPaid ? "Buy Report" : "Download"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      ) : (
        <>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between mb-3">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-2xl">
                {report.logo}
              </div>
              {report.isPaid ? (
                <Badge
                  variant="default"
                  className="bg-secondary text-secondary-foreground"
                >
                  Premium
                </Badge>
              ) : (
                <Badge variant="secondary">Free</Badge>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">{report.company}</h3>
              <p className="text-muted-foreground text-sm">{report.industry}</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{report.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{formatNumber(report.reviewCount)}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
              {report.summary}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {report.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {report.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{report.tags.length - 2}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(report.date)}</span>
            </div>
          </CardContent>
          <CardFooter className="pt-0 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Download className="h-4 w-4 mr-2" />
              {report.isPaid ? "Buy" : "Download"}
            </Button>
          </CardFooter>
        </>
      )}
    </>
  );

  return (
    <Link
      href={`/reports/${slugify(report.company)}`}
      className="block group focus:outline-none"
    >
      <Card className="hover:shadow-lg transition-shadow h-full group-focus:ring-2 group-focus:ring-primary">
        {cardContent}
      </Card>
    </Link>
  );
};

export default ReportCard;
