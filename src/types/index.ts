// Core types for CustomerEye application

// User types
export interface User {
  id: string;
  name?: string;
  email?: string;
  reports: Report[];
}

// Report types
export interface Report {
  id: string;
  title: string;
  description?: string;
  data: ReportData;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
  documentId: string;
  document: Document;
}

// Document types
export interface Document {
  id: string;
  title: string;
  description?: string;
  companyName: string;
  price: number;
  reports: Report[];
  createdAt: Date;
  updatedAt: Date;
}

// Report data structure
export interface ReportData {
  company: CompanyInfo;
  analysis: AnalysisData;
  insights: Insight[];
  recommendations: Recommendation[];
  metadata: ReportMetadata;
}

// Company information
export interface CompanyInfo {
  name: string;
  industry: string;
  rating: number;
  reviewCount: number;
  logo?: string;
  website?: string;
  location?: string;
}

// Analysis data
export interface AnalysisData {
  sentiment: SentimentAnalysis;
  topics: TopicAnalysis[];
  trends: TrendAnalysis[];
  competitors: CompetitorAnalysis[];
}

// Sentiment analysis
export interface SentimentAnalysis {
  overall: number; // 1-5 rating
  positive: number; // percentage
  negative: number; // percentage
  neutral: number; // percentage
  confidence: number; // 0-1
}

// Topic analysis
export interface TopicAnalysis {
  topic: string;
  frequency: number;
  sentiment: number;
  keywords: string[];
}

// Trend analysis
export interface TrendAnalysis {
  period: string;
  metric: string;
  value: number;
  change: number; // percentage change
}

// Competitor analysis
export interface CompetitorAnalysis {
  name: string;
  rating: number;
  reviewCount: number;
  strengths: string[];
  weaknesses: string[];
}

// Insights
export interface Insight {
  id: string;
  type: 'positive' | 'negative' | 'neutral' | 'opportunity' | 'threat';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  evidence: string[];
}

// Recommendations
export interface Recommendation {
  id: string;
  category: 'customer-service' | 'product' | 'process' | 'marketing' | 'operations';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  expectedImpact: string;
  implementation: string[];
}

// Report metadata
export interface ReportMetadata {
  generatedAt: Date;
  dataSource: string;
  language: string;
  totalReviews: number;
  reviewPeriod: {
    start: Date;
    end: Date;
  };
  aiModel: string;
  version: string;
}

// Frontend specific types (for compatibility with existing components)
export interface FrontendReport {
  id: number | string;
  company: string;
  industry: string;
  rating: number;
  reviewCount: number;
  summary: string;
  tags: string[];
  reportType: 'Free' | 'Premium';
  language: string;
  date: string;
  isPaid: boolean;
  logo: string;
}

// Filter types
export interface Filters {
  industry: string;
  rating: string;
  reportType: string;
  language: string;
  isPaid: string;
}

// Search and pagination
export interface SearchParams {
  query?: string;
  filters?: Partial<Filters>;
  sortBy?: 'most-recent' | 'most-popular' | 'highest-rated' | 'a-z' | 'z-a';
  page?: number;
  limit?: number;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
