"use client";

import { useState, useEffect } from "react";
import FormattedText from "./FormattedText";

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
    metadata?: any;
    createdAt: string;
  }>;
}

interface ReportPDFProps {
  companySlug: string;
}

export default function ReportPDF({ companySlug }: ReportPDFProps) {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/reports/${companySlug}?_t=${Date.now()}`);
        
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
  }, [companySlug]);

  // Get section content by type
  const getSectionContent = (sectionType: string) => {
    const section = reportData?.sections.find(s => s.sectionType === sectionType);
    return section?.content || '';
  };

  // Get data files by section type
  const getDataFiles = (sectionType: string) => {
    return reportData?.dataFiles.filter(f => f.sectionType === sectionType) || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading report data...</p>
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">
          {reportData.companyName} Customer Analysis Report
        </h1>
        <p className="text-xl text-muted-foreground">
          AI-Enhanced Sentiment Analysis • {reportData.reportType} Report
        </p>
      </div>

      {/* RATINGS Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-primary mb-6">RATINGS</h2>
        <h3 className="text-xl font-semibold mb-4">Given Rating Distributions</h3>
        
        {/* Rating Analysis Text */}
        <div className="bg-muted/30 rounded-lg p-6 mb-6">
          <FormattedText 
            content={getDataFiles('RATING_DISTRIBUTION').find(f => f.fileType === 'TEXT')?.content || 'N/A'}
          />
        </div>
        
        {/* Rating Distribution Image */}
        {getDataFiles('RATING_DISTRIBUTION').find(f => f.fileType === 'IMAGE') && (
          <div className="mb-6">
            <img 
              src={getDataFiles('RATING_DISTRIBUTION').find(f => f.fileType === 'IMAGE')?.path}
              alt="Rating Distribution Chart"
              className="max-w-full h-auto mx-auto"
            />
          </div>
        )}
      </div>

      {/* REVIEWS Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-primary mb-6">REVIEWS</h2>
        <h3 className="text-xl font-semibold mb-4">Overall Reviews Wordcloud</h3>
        
        {/* Word Cloud Analysis Text */}
        <div className="bg-muted/30 rounded-lg p-6 mb-6">
          <FormattedText 
            content={getDataFiles('OVERALL_WORDCLOUD').find(f => f.fileType === 'TEXT')?.content || 'N/A'}
          />
        </div>
        
        {/* Word Cloud Image */}
        {getDataFiles('OVERALL_WORDCLOUD').find(f => f.fileType === 'IMAGE') && (
          <div className="mb-6">
            <img 
              src={getDataFiles('OVERALL_WORDCLOUD').find(f => f.fileType === 'IMAGE')?.path}
              alt="Word Cloud Analysis"
              className="max-w-full h-auto mx-auto"
            />
          </div>
        )}
      </div>

      {/* REPLIES Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-primary mb-6">REPLIES</h2>
        <h3 className="text-xl font-semibold mb-4">Overall Yearly Replies</h3>
        
        {/* Customer Engagement Analysis Text */}
        <div className="bg-muted/30 rounded-lg p-6 mb-6">
          <FormattedText 
            content={getDataFiles('YEARLY_REPLIES').find(f => f.fileType === 'TEXT')?.content || 'N/A'}
          />
        </div>
        
        {/* Yearly Replies Image */}
        {getDataFiles('YEARLY_REPLIES').find(f => f.fileType === 'IMAGE') && (
          <div className="mb-6">
            <img 
              src={getDataFiles('YEARLY_REPLIES').find(f => f.fileType === 'IMAGE')?.path}
              alt="Yearly Replies Chart"
              className="max-w-full h-auto mx-auto"
            />
          </div>
        )}
      </div>

      {/* CONCLUSION Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-primary mb-6">CONCLUSION</h2>
        
        <div className="bg-muted/30 rounded-lg p-6">
          <FormattedText 
            content={getDataFiles('CONCLUSION').find(f => f.fileType === 'TEXT')?.content || 'N/A'}
          />
        </div>
      </div>

      {/* Sample Report Notice */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Sample Report Preview
        </h3>
        <p className="text-blue-700 mb-2">
          This is a sample report showcasing graphs and key insights from each chapter of the comprehensive report.
        </p>
        <p className="text-sm text-blue-600">
          The full report includes detailed information on the chapters and sections outlined in the table of contents.
        </p>
      </div>
    </div>
  );
}