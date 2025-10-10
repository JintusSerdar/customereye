"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Star,
  TrendingUp,
  Users,
  Calendar,
  Building2,
  Share2,
  BookmarkPlus,
  MessageSquare,
  FileText,
  Award,
  Download,
  Globe,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportPDF from "@/components/ReportPDF";
import FormattedText from "@/components/FormattedText";

interface ReportData {
  id: string;
  title: string;
  companyName: string;
  companySlug: string;
  industry: string;
  category?: string;
  country: string;
  rating: number;
  reviewCount: number;
  summary: string;
  // tags field removed - using industry and country instead
  reportType: 'FREE' | 'PREMIUM';
  language: string;
  isPaid: boolean;
  logo: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  dataFiles: Array<{
    id: string;
    fileType: string;
    sectionType: string;
    sequence?: number;
    filename: string;
    originalName: string;
    path: string;
    size: number;
    mimeType: string;
    content?: string;
    createdAt: string;
  }>;
  sections: Array<{
    id: string;
    sectionType: string;
    title: string;
    content?: string;
    order: number;
    metadata?: Record<string, unknown>;
    createdAt: string;
  }>;
}

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { id } = await params;
        const response = await fetch(`/api/reports/${id}?_t=${Date.now()}`);
        
        if (!response.ok) {
          throw new Error('Report not found');
        }
        
        const data = await response.json();
        setReportData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [params]);

  // PDF download function
  const handleDownloadPDF = async () => {
    if (!reportData) return;
    
    setIsDownloadingPDF(true);
    try {
      const response = await fetch('/api/pdf/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          companyName: reportData.companyName,
          reportData: reportData 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to generate PDF');
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportData.companyName}-customer-analysis-report.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Report Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || 'The requested report could not be found.'}</p>
          <Button onClick={() => router.push('/reports')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Button>
        </div>
      </div>
    );
  }

  // Get section content by type
  const getSectionContent = (sectionType: string) => {
    const section = reportData.sections.find(s => s.sectionType === sectionType);
    return section?.content || '';
  };

  // Get data files by section type
  const getDataFiles = (sectionType: string) => {
    return reportData.dataFiles.filter(f => f.sectionType === sectionType);
  };

  // Parse rating distribution from content
  const parseRatingDistribution = () => {
    const content = getSectionContent('RATING_DISTRIBUTION');
    // Extract percentages from the content
    const rating5Match = content.match(/(\d+\.?\d*)%.*5\.?0/);
    const rating4Match = content.match(/(\d+\.?\d*)%.*4\.?0/);
    const rating3Match = content.match(/(\d+\.?\d*)%.*3\.?0/);
    const rating2Match = content.match(/(\d+\.?\d*)%.*2\.?0/);
    const rating1Match = content.match(/(\d+\.?\d*)%.*1\.?0/);

    return [
      { stars: 5, percentage: rating5Match ? parseFloat(rating5Match[1]) : 0, count: 0 },
      { stars: 4, percentage: rating4Match ? parseFloat(rating4Match[1]) : 0, count: 0 },
      { stars: 3, percentage: rating3Match ? parseFloat(rating3Match[1]) : 0, count: 0 },
      { stars: 2, percentage: rating2Match ? parseFloat(rating2Match[1]) : 0, count: 0 },
      { stars: 1, percentage: rating1Match ? parseFloat(rating1Match[1]) : 0, count: 0 },
    ];
  };

  const ratingBreakdown = parseRatingDistribution();

  return (
      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 pt-8">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/reports")}
              className="flex items-center px-0"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Reports
            </Button>
          </div>
        </div>

        {/* Company Header */}
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-lg shadow-sm border p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="text-5xl">{reportData.logo}</div>
                <div>
                  <h1 className="text-3xl font-bold text-primary mb-2">
                  {reportData.companyName} Customer Reviews Analysis
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Building2 size={16} />
                      <span>{reportData.industry}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                    <Globe size={16} />
                    <span>{reportData.country}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>
                      Updated {new Date(reportData.publishedAt || reportData.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Share2 size={16} className="mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <BookmarkPlus size={16} className="mr-2" />
                  Save
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                  <Star className="fill-yellow-400 text-yellow-400" size={20} />
                    <span className="text-2xl font-bold text-primary">
                      {reportData.rating}
                    </span>
                  </div>
                <p className="text-sm text-muted-foreground">Overall Rating</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Users size={20} className="text-primary" />
                    <span className="text-2xl font-bold text-primary">
                      {reportData.reviewCount.toLocaleString()}
                    </span>
                  </div>
                <p className="text-sm text-muted-foreground">Reviews Analyzed</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Award size={20} className="text-green-600" />
                    <span className="text-2xl font-bold text-primary">
                    {reportData.reportType}
                    </span>
                  </div>
                <p className="text-sm text-muted-foreground">Report Type</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <MessageSquare size={20} className="text-blue-600" />
                    <span className="text-2xl font-bold text-primary">
                    {reportData.dataFiles.length}
                    </span>
                  </div>
                <p className="text-sm text-muted-foreground">Data Files</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              <Tag size={12} className="mr-1" />
              {reportData.industry}
            </Badge>
            <Badge variant="secondary">
              <Tag size={12} className="mr-1" />
              {reportData.country}
                </Badge>
            </div>
          </div>

          {/* Main Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reviews">Reviews Analysis</TabsTrigger>
              <TabsTrigger value="engagement">Customer Engagement</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                              <TabsTrigger value="pdf">Report Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* AI Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-primary flex items-center">
                        <FileText className="mr-2" size={20} />
                        AI Analysis Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground leading-relaxed">
                        {reportData.summary}
                      </p>
                    </CardContent>
                  </Card>

                {/* Rating Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-primary flex items-center">
                        <TrendingUp className="mr-2 text-green-600" size={20} />
                      Rating Distribution
                      </CardTitle>
                    </CardHeader>
                  <CardContent className="space-y-4">
                    {ratingBreakdown.map((rating, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1 w-16">
                          <span className="text-sm font-medium">{rating.stars}</span>
                          <Star size={12} className="fill-yellow-400 text-yellow-400" />
                          </div>
                        <div className="flex-1">
                          <Progress
                            value={rating.percentage}
                            className="h-3"
                          />
                        </div>
                        <div className="w-20 text-right">
                          <div className="text-sm font-medium">{rating.percentage}%</div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* CTA Card */}
                  <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                    <CardContent className="p-6 text-center">
                      <h3 className="text-xl font-bold mb-4">
                      {reportData.isPaid ? 'Purchase Full Report' : 'Free Report Available'}
                      </h3>
                      <p className="mb-6 text-primary-foreground/80">
                      {reportData.isPaid 
                        ? 'Get complete analysis with 50+ data points and actionable recommendations'
                        : 'This is a free report with basic insights and analysis'
                      }
                    </p>
                    {reportData.isPaid ? (
                      <Button className="w-full mb-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                        Buy Report ($49)
                      </Button>
                    ) : (
                      <Button className="w-full mb-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                        Download Free Report
                      </Button>
                    )}
                      <Button
                        variant="outline"
                        className="w-full border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                      >
                        Request Custom Analysis
                      </Button>
                    </CardContent>
                  </Card>

                {/* Report Info */}
                  <Card>
                    <CardHeader>
                    <CardTitle className="text-primary">Report Details</CardTitle>
                    </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Type:</span>
                      <Badge variant={reportData.isPaid ? "default" : "secondary"}>
                        {reportData.reportType}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Language:</span>
                      <span className="text-sm">{reportData.language.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Files:</span>
                      <span className="text-sm">{reportData.dataFiles.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Sections:</span>
                      <span className="text-sm">{reportData.sections.length}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Word Cloud Analysis */}
                <Card>
                  <CardHeader>
                  <CardTitle className="text-primary">Word Cloud Analysis</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Most frequently mentioned words in customer reviews
                    </p>
                  </CardHeader>
                  <CardContent>
                  {/* Word Cloud Image */}
                  {getDataFiles('OVERALL_WORDCLOUD').find(f => f.fileType === 'IMAGE') && (
                    <div className="mb-4">
                      <img 
                        src={getDataFiles('OVERALL_WORDCLOUD').find(f => f.fileType === 'IMAGE')?.path}
                        alt="Word Cloud Analysis"
                        className="w-full h-auto rounded-lg shadow-md"
                      />
                    </div>
                  )}
                  <div className="bg-muted/30 rounded-lg p-4">
                  <FormattedText 
                    content={getDataFiles('OVERALL_WORDCLOUD').find(f => f.fileType === 'TEXT')?.content || 'N/A'}
                  />
                  </div>
                  </CardContent>
                </Card>

              {/* Rating Analysis */}
                <Card>
                  <CardHeader>
                  <CardTitle className="text-primary">Rating Analysis</CardTitle>
                  </CardHeader>
                <CardContent>
                  {/* Rating Distribution Image */}
                  {getDataFiles('RATING_DISTRIBUTION').find(f => f.fileType === 'IMAGE') && (
                    <div className="mb-4">
                      <img 
                        src={getDataFiles('RATING_DISTRIBUTION').find(f => f.fileType === 'IMAGE')?.path}
                        alt="Rating Distribution Chart"
                        className="w-full h-auto rounded-lg shadow-md"
                      />
                          </div>
                  )}
                  <div className="space-y-4">
                  <FormattedText 
                    content={getDataFiles('RATING_DISTRIBUTION').find(f => f.fileType === 'TEXT')?.content || 'N/A'}
                  />
                      </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-8">
                <Card>
                  <CardHeader>
                <CardTitle className="text-primary">Customer Engagement Analysis</CardTitle>
                    <p className="text-sm text-muted-foreground">
                  Company response patterns and customer engagement trends
                    </p>
                  </CardHeader>
                  <CardContent>
                {/* Yearly Replies Image */}
                {getDataFiles('YEARLY_REPLIES').find(f => f.fileType === 'IMAGE') && (
                  <div className="mb-6">
                    <img 
                      src={getDataFiles('YEARLY_REPLIES').find(f => f.fileType === 'IMAGE')?.path}
                      alt="Yearly Replies Chart"
                      className="w-full h-auto rounded-lg shadow-md"
                    />
                      </div>
                )}
                <div className="space-y-4">
                        <FormattedText 
                    content={getDataFiles('YEARLY_REPLIES').find(f => f.fileType === 'TEXT')?.content || 'N/A'}
                  />
                    </div>
                  </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-8">
                <Card>
                  <CardHeader>
                <CardTitle className="text-primary">Conclusion & Recommendations</CardTitle>
                  </CardHeader>
              <CardContent>
                <div className="space-y-4">
                        <FormattedText 
                    content={getDataFiles('CONCLUSION').find(f => f.fileType === 'TEXT')?.content || 'N/A'}
                  />
                    </div>
                  </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="pdf" className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-primary">Report Preview</h2>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleDownloadPDF}
                      disabled={isDownloadingPDF}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {isDownloadingPDF ? 'Generating...' : 'Download PDF'}
                    </Button>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    {reportData.isPaid ? 'Buy Report' : 'Download Free'}
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Preview the complete analysis report with detailed insights, charts, and recommendations. 
                  Click &quot;Download PDF&quot; to get a high-quality PDF version of this report.
                </p>
              <ReportPDF companySlug={reportData.companySlug} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
  );
}