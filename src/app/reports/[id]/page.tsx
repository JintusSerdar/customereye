// Individual report page for `/reports/[id]`
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Head from "next/head";
import {
  ArrowLeft,
  Download,
  Star,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Building2,
  Share2,
  BookmarkPlus,
  ExternalLink,
  MessageSquare,
  FileText,
  Award,
  CheckCircle,
  Clock,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportPDF from "@/components/ReportPDF";
import { downloadPDF } from "@/lib/pdfGenerator";

// Sample data based on Advance America
const reportData = {
  company: "Advance America",
  slug: "advance-america",
  logo: "🏦",
  industry: "Money & Insurance",
  location: "Spartanburg, South Carolina, USA",
  rating: 4.8,
  reviewCount: 15420,
  analysisDate: "2024-01-15",
  overallGrade: "A-",
  summary:
    "In conclusion, the given ratings distribution for customer reviews of the Advance America Company reflects a high level of customer satisfaction, as indicated by the majority of customers giving a rating of 5. However, there are still a significant number of dissatisfied customers, suggesting areas for improvement. By analyzing the ratings and accompanying reviews in detail, the company can gain valuable insights into customer concerns and positive experiences, enabling them to enhance service quality and improve customer engagement and satisfaction.",

  // Rating distribution
  ratingBreakdown: [
    { stars: 5, percentage: 93.39, count: 14391 },
    { stars: 4, percentage: 2.83, count: 436 },
    { stars: 3, percentage: 1.13, count: 174 },
    { stars: 2, percentage: 0.71, count: 109 },
    { stars: 1, percentage: 1.95, count: 300 },
  ],

  // Word cloud data
  wordCloud: [
    { word: "service", frequency: 6242, percentage: 10.83 },
    { word: "great", frequency: 5557, percentage: 9.64 },
    { word: "customer", frequency: 3452, percentage: 5.99 },
    { word: "helpful", frequency: 3324, percentage: 5.77 },
    { word: "easy", frequency: 3092, percentage: 5.37 },
    { word: "loan", frequency: 3085, percentage: 5.35 },
    { word: "friendly", frequency: 2796, percentage: 4.85 },
    { word: "always", frequency: 2701, percentage: 4.69 },
    { word: "fast", frequency: 2265, percentage: 3.93 },
    { word: "thank", frequency: 1994, percentage: 3.46 },
  ],

  // Yearly replies data
  yearlyReplies: [
    { year: 2019, replies: 0 },
    { year: 2020, replies: 0 },
    { year: 2021, replies: 0 },
    { year: 2022, replies: 1 },
    { year: 2023, replies: 9322 },
    { year: 2024, replies: 10671 },
  ],

  strengths: [
    {
      title: "Customer Service Excellence",
      score: 95,
      description:
        "93.39% of customers have given a rating of 5, indicating a high level of satisfaction with the company. This suggests that the company has been successful in meeting or exceeding customer expectations in most cases.",
    },
    {
      title: "Helpful & Friendly Staff",
      score: 92,
      description:
        "The word cloud analysis reveals that customers frequently mention 'helpful' (5.77%) and 'friendly' (4.85%), indicating that customers appreciate the assistance and support they receive from the company.",
    },
    {
      title: "Easy & Fast Processes",
      score: 89,
      description:
        "Customers consistently mention 'easy' (5.37%) and 'fast' (3.93%) processes, suggesting that customers find the processes or interactions with the company to be simple and convenient.",
    },
  ],

  weaknesses: [
    {
      title: "Response Time",
      score: 65,
      description:
        "The lack of replies from the company in 2019, 2020, and 2021 could have potentially had a negative impact on customer satisfaction and overall sentiment. Customers may have felt ignored or neglected, leading to a decline in their trust and loyalty towards the company.",
    },
    {
      title: "Moderate Rating Gap",
      score: 70,
      description:
        "One significant pattern that emerges from the ratings distribution is the lack of ratings between 2 and 4. This indicates that customers either had extremely positive experiences (rating of 5) or negative experiences (ratings of 1 or 2). The absence of moderate ratings suggests that customers either had exceptional experiences or encountered significant issues.",
    },
    {
      title: "Communication",
      score: 75,
      description:
        "There are still a significant number of dissatisfied customers, suggesting areas for improvement. By analyzing the feedback provided by customers who rated the company below 5, it is possible to identify common themes or issues that need to be addressed.",
    },
  ],

  topReviews: [
    {
      sentiment: "positive",
      text: "The service here is absolutely great! The staff is always helpful and friendly. The process was easy and fast.",
      rating: 5,
      source: "Trustpilot",
      date: "2024-01-10",
    },
    {
      sentiment: "positive",
      text: "I've been a customer for years and they've always been reliable. The loan process is straightforward and the staff is very helpful.",
      rating: 5,
      source: "Google Reviews",
      date: "2024-01-08",
    },
    {
      sentiment: "negative",
      text: "While the service is good, it took longer than expected to get a response to my inquiry. Could be faster.",
      rating: 3,
      source: "Trustpilot",
      date: "2024-01-05",
    },
  ],

  recommendations: [
    "Address specific concerns: Analyze the feedback from customers who gave lower ratings and address their specific concerns. This could involve improving customer service, product quality, or addressing any other issues raised in the reviews.",
    "Improve communication: Enhance communication channels to ensure that customers' concerns are heard and addressed promptly. This could involve implementing a more efficient customer support system or improving response times.",
    "Proactively seek feedback: Actively seek feedback from customers to identify areas for improvement. This could be done through surveys, feedback forms, or other means of gathering customer insights.",
    "Enhance employee training: Provide comprehensive training to employees to ensure they have the necessary skills and knowledge to deliver excellent customer service. This could include training on communication, problem-solving, and product knowledge.",
    "Monitor and respond to online reviews: Monitor online review platforms and respond to both positive and negative reviews. This shows that the company values customer feedback and is committed to addressing any concerns.",
  ],

  tags: [
    "Payday Loans",
    "Financial Services",
    "Customer Service",
    "Quick Loans",
    "Reliable",
  ],

  similarCompanies: [
    "Check 'n Go",
    "ACE Cash Express",
    "The Money Store",
    "CashNet USA",
    "Check Into Cash",
  ],
};

// Word Cloud Component
const WordCloud = ({
  words,
}: {
  words: Array<{ word: string; frequency: number; percentage: number }>;
}) => {
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-lg">
      {words.map((item, index) => (
        <span
          key={index}
          className="inline-block px-3 py-1 rounded-full text-center transition-all hover:scale-105"
          style={{
            fontSize: `${Math.max(12, 16 + item.percentage * 2)}px`,
            fontWeight: item.percentage > 5 ? "bold" : "normal",
            color:
              item.percentage > 8
                ? "var(--color-primary)"
                : "var(--color-foreground)",
            opacity: 0.6 + item.percentage / 20,
          }}
        >
          {item.word}
        </span>
      ))}
    </div>
  );
};

// Rating Distribution Chart
const RatingChart = ({
  data,
}: {
  data: Array<{ stars: number; percentage: number; count: number }>;
}) => {
  return (
    <div className="space-y-3">
      {data.map((rating, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 w-16">
            <span className="text-sm font-medium">{rating.stars}</span>
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
          </div>
          <div className="flex-1">
            <Progress
              value={rating.percentage}
              className="h-3"
              style={
                {
                  "--progress-background":
                    rating.stars >= 4
                      ? "var(--color-green-600)"
                      : rating.stars >= 3
                      ? "var(--color-yellow-500)"
                      : "var(--color-red-500)",
                } as React.CSSProperties
              }
            />
          </div>
          <div className="w-20 text-right">
            <div className="text-sm font-medium">{rating.percentage}%</div>
            <div className="text-xs text-muted-foreground">
              {rating.count.toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Yearly Replies Chart
const YearlyRepliesChart = ({
  data,
}: {
  data: Array<{ year: number; replies: number }>;
}) => {
  const maxReplies = Math.max(...data.map((d) => d.replies));

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className="w-16 text-sm font-medium">{item.year}</div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <div
                className="h-8 bg-primary rounded transition-all hover:bg-primary/80"
                style={{ width: `${(item.replies / maxReplies) * 100}%` }}
              ></div>
              <span className="text-sm font-medium">
                {item.replies.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default async function ReportDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ReportDetailClient id={id} />;
}

function ReportDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // SEO-friendly title and description
  const pageTitle = `${reportData.company} Customer Reviews & Analysis - CustomerEye`;
  const pageDescription = `Comprehensive analysis of ${
    reportData.company
  } customer reviews. ${reportData.reviewCount.toLocaleString()} reviews analyzed with ${
    reportData.rating
  }/5 rating. Get detailed insights and recommendations.`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content={`${reportData.company}, customer reviews, ${reportData.industry}, customer analysis, reviews analysis`}
        />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://customereye.com/reports/${id}`}
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: reportData.company,
              description: pageDescription,
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: reportData.rating,
                reviewCount: reportData.reviewCount,
                bestRating: 5,
                worstRating: 1,
              },
            }),
          }}
        />
      </Head>

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
                    {reportData.company} Customer Reviews Analysis
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Building2 size={16} />
                      <span>{reportData.industry}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>📍</span>
                      <span>{reportData.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>
                        Updated{" "}
                        {new Date(reportData.analysisDate).toLocaleDateString()}
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
                    <Star
                      className="fill-yellow-400 text-yellow-400"
                      size={20}
                    />
                    <span className="text-2xl font-bold text-primary">
                      {reportData.rating}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Overall Rating
                  </p>
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
                  <p className="text-sm text-muted-foreground">
                    Reviews Analyzed
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Award size={20} className="text-green-600" />
                    <span className="text-2xl font-bold text-primary">
                      {reportData.overallGrade}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    CustomerEye Grade
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <MessageSquare size={20} className="text-blue-600" />
                    <span className="text-2xl font-bold text-primary">
                      {reportData.yearlyReplies[
                        reportData.yearlyReplies.length - 1
                      ].replies.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Company Replies
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-wrap gap-2">
              {reportData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Main Content with Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reviews">Reviews Analysis</TabsTrigger>
              <TabsTrigger value="engagement">Customer Engagement</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="pdf">PDF Report</TabsTrigger>
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

                  {/* Strengths */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-primary flex items-center">
                        <TrendingUp className="mr-2 text-green-600" size={20} />
                        Key Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {reportData.strengths.map((strength, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-foreground">
                              {strength.title}
                            </h4>
                            <span className="text-green-600 font-bold">
                              {strength.score}%
                            </span>
                          </div>
                          <Progress value={strength.score} className="mb-2" />
                          <p className="text-sm text-muted-foreground">
                            {strength.description}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Weaknesses */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-primary flex items-center">
                        <TrendingDown className="mr-2 text-red-500" size={20} />
                        Areas for Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {reportData.weaknesses.map((weakness, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-foreground">
                              {weakness.title}
                            </h4>
                            <span className="text-red-500 font-bold">
                              {weakness.score}%
                            </span>
                          </div>
                          <Progress value={weakness.score} className="mb-2" />
                          <p className="text-sm text-muted-foreground">
                            {weakness.description}
                          </p>
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
                        Get Full Report
                      </h3>
                      <p className="mb-6 text-primary-foreground/80">
                        Access complete analysis with 50+ data points and
                        actionable recommendations
                      </p>
                      <Button className="w-full mb-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                        <Download className="mr-2" size={16} />
                        Download PDF ($49)
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                      >
                        Request Custom Analysis
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Rating Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-primary">
                        Rating Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RatingChart data={reportData.ratingBreakdown} />
                    </CardContent>
                  </Card>

                  {/* Similar Companies */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-primary">
                        Similar Companies
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {reportData.similarCompanies.map((company, index) => (
                          <Link
                            key={index}
                            href={`/reports/${company
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                            className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors"
                          >
                            <span className="text-foreground">{company}</span>
                            <ExternalLink
                              size={14}
                              className="text-muted-foreground"
                            />
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Word Cloud */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-primary">
                      Review Word Cloud
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Most frequently mentioned words in customer reviews
                    </p>
                  </CardHeader>
                  <CardContent>
                    <WordCloud words={reportData.wordCloud} />
                  </CardContent>
                </Card>

                {/* Top Reviews */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-primary">
                      Review Highlights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {reportData.topReviews.map((review, index) => (
                      <div key={index} className="border-l-4 border-muted pl-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted"
                                }
                              />
                            ))}
                          </div>
                          <Badge
                            variant={
                              review.sentiment === "positive"
                                ? "default"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            {review.sentiment}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {review.source}
                          </span>
                        </div>
                        <p className="text-foreground italic mb-2">
                          &quot;{review.text}&quot;
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Yearly Replies */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-primary">
                      Company Response Rate
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Number of replies to customer reviews by year
                    </p>
                  </CardHeader>
                  <CardContent>
                    <YearlyRepliesChart data={reportData.yearlyReplies} />
                  </CardContent>
                </Card>

                {/* Engagement Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-primary">
                      Engagement Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="text-green-600" size={20} />
                      <div>
                        <p className="font-medium">Significant Improvement</p>
                        <p className="text-sm text-muted-foreground">
                          The real transformation in customer engagement
                          occurred in 2023, where there was a substantial jump
                          in the number of replies to 9,322. This increase
                          signifies a more proactive approach by Advance America
                          Company in responding to customer feedback.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="text-yellow-600" size={20} />
                      <div>
                        <p className="font-medium">Response Time</p>
                        <p className="text-sm text-muted-foreground">
                          The timing of the replies is also a crucial factor to
                          consider. The absence of replies in 2019, 2020, and
                          2021 indicates a delayed response time, which may have
                          negatively impacted customer satisfaction.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ThumbsUp className="text-blue-600" size={20} />
                      <div>
                        <p className="font-medium">Customer Satisfaction</p>
                        <p className="text-sm text-muted-foreground">
                          By actively engaging with customers and addressing
                          their concerns, the company is demonstrating its
                          commitment to customer satisfaction and improving
                          overall sentiment.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-primary">
                      Actionable Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {reportData.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-foreground">{rec}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Implementation Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-primary">
                      Implementation Priority
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          High Priority
                        </span>
                        <Badge variant="destructive">Immediate</Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          • Maintain high engagement levels
                        </p>
                        <p className="text-sm text-muted-foreground">
                          • Address communication gaps
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Medium Priority
                        </span>
                        <Badge variant="secondary">3-6 months</Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          • Implement feedback systems
                        </p>
                        <p className="text-sm text-muted-foreground">
                          • Enhance response protocols
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="pdf" className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-primary">
                    Professional PDF Report
                  </h2>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={async () => {
                      try {
                        console.log("Starting PDF download...");
                        await downloadPDF("pdf-report", {
                          filename: `${reportData.company
                            .toLowerCase()
                            .replace(/\s+/g, "-")}-customer-review-report.pdf`,
                          companyName: reportData.company,
                        });
                        console.log("PDF download completed successfully");
                      } catch (error) {
                        console.error("Error downloading PDF:", error);
                        alert(
                          `Failed to generate PDF: ${
                            error instanceof Error
                              ? error.message
                              : "Unknown error"
                          }`
                        );
                      }
                    }}
                  >
                    <Download className="mr-2" size={16} />
                    Download PDF
                  </Button>
                </div>
                <p className="text-muted-foreground">
                  View the complete analysis report in a professional PDF format
                  with detailed insights, charts, and recommendations.
                </p>
                <ReportPDF companyName={reportData.company} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
