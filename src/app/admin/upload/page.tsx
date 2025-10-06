"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Image, File, CheckCircle, AlertCircle } from "lucide-react";

interface UploadedFile {
  file: File;
  id: string;
  type: 'TEXT' | 'IMAGE' | 'PDF' | 'JSON';
}

const industries = [
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

const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", 
  "France", "Spain", "Italy", "Netherlands", "Sweden", "Norway", "Denmark"
];

export default function UploadPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    category: "",
    country: "",
    rating: "",
    reviewCount: "",
    summary: "",
    tags: "",
    reportType: "FREE" as "FREE" | "PREMIUM",
    language: "en",
    logo: "",
  });

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    
    const uploadedFiles: UploadedFile[] = newFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      type: getFileType(file.name),
    }));

    setFiles(prev => [...prev, ...uploadedFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const getFileType = (filename: string): 'TEXT' | 'IMAGE' | 'PDF' | 'JSON' => {
    const ext = filename.toLowerCase().split('.').pop();
    switch (ext) {
      case 'txt': return 'TEXT';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg': return 'IMAGE';
      case 'pdf': return 'PDF';
      case 'json': return 'JSON';
      default: return 'TEXT';
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'TEXT': return <FileText className="h-4 w-4" />;
      case 'IMAGE': return <Image className="h-4 w-4" />;
      case 'PDF': return <File className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadStatus({ type: null, message: '' });

    try {
      const formDataToSend = new FormData();
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Add tags as JSON array
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      formDataToSend.append('tags', JSON.stringify(tagsArray));

      // Add files
      files.forEach((uploadedFile, index) => {
        formDataToSend.append(`files[${index}]`, uploadedFile.file);
      });

      const response = await fetch('/api/reports/upload', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadStatus({
          type: 'success',
          message: `Report uploaded successfully! Report ID: ${result.reportId}`,
        });
        // Reset form
        setFormData({
          companyName: "",
          industry: "",
          category: "",
          country: "",
          rating: "",
          reviewCount: "",
          summary: "",
          tags: "",
          reportType: "FREE",
          language: "en",
          logo: "",
        });
        setFiles([]);
      } else {
        setUploadStatus({
          type: 'error',
          message: result.error || 'Upload failed',
        });
      }
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Upload Report Data
          </h1>
          <p className="text-muted-foreground">
            Upload new customer insight reports with data files and metadata
          </p>
        </div>

        {uploadStatus.type && (
          <Card className={`mb-6 ${
            uploadStatus.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                {uploadStatus.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={uploadStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                  {uploadStatus.message}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Basic information about the company and report
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="e.g., Fragrance11"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    placeholder="e.g., Fragrance & Cosmetics"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="logo">Logo (emoji or path)</Label>
                  <Input
                    id="logo"
                    value={formData.logo}
                    onChange={(e) => handleInputChange('logo', e.target.value)}
                    placeholder="🌸"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Data */}
          <Card>
            <CardHeader>
              <CardTitle>Report Data</CardTitle>
              <CardDescription>
                Metrics and analysis data for the report
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="rating">Rating *</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => handleInputChange('rating', e.target.value)}
                    placeholder="4.2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reviewCount">Review Count *</Label>
                  <Input
                    id="reviewCount"
                    type="number"
                    value={formData.reviewCount}
                    onChange={(e) => handleInputChange('reviewCount', e.target.value)}
                    placeholder="1250"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select value={formData.reportType} onValueChange={(value: "FREE" | "PREMIUM") => handleInputChange('reportType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FREE">Free Report</SelectItem>
                      <SelectItem value="PREMIUM">Premium Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="summary">Summary *</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  placeholder="Brief summary of the company and customer insights..."
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="Fragrance, Beauty, Cosmetics, Online Retail"
                />
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Data Files</CardTitle>
              <CardDescription>
                Upload text files, images, and other data files for the report
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="files">Upload Files</Label>
                <Input
                  id="files"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="mb-4"
                />
                <p className="text-sm text-muted-foreground">
                  Upload .txt, .png, .jpg, .pdf files. Files will be automatically categorized.
                </p>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Uploaded Files ({files.length})</h4>
                  <div className="space-y-2">
                    {files.map((uploadedFile) => (
                      <div key={uploadedFile.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          {getFileIcon(uploadedFile.type)}
                          <span className="font-medium">{uploadedFile.file.name}</span>
                          <Badge variant="secondary">{uploadedFile.type}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {(uploadedFile.file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFile(uploadedFile.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isUploading || !formData.companyName || !formData.industry || !formData.summary || files.length === 0}
              className="min-w-32"
            >
              {isUploading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Report
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
