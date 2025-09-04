// Application configuration
export const config = {
  // App metadata
  app: {
    name: 'CustomerEye',
    description: 'AI-Powered Customer Insights Platform',
    version: '0.1.0',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },

  // Database
  database: {
    url: process.env.DATABASE_URL,
  },

  // Authentication
  auth: {
    secret: process.env.NEXTAUTH_SECRET,
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },

  // Features
  features: {
    pdfExport: true,
    aiAnalysis: true,
    multiLanguage: true,
    paymentIntegration: false, // TODO: Implement
  },

  // UI Configuration
  ui: {
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'es', 'fr', 'de', 'it', 'pt'],
    itemsPerPage: 9,
    maxSearchResults: 100,
  },

  // Industry categories
  industries: [
    'Animals & Pets',
    'Beauty & Well-being',
    'Business Services',
    'Construction',
    'Education & Training',
    'Electronics & Technology',
    'Events & Entertainment',
    'Food & Beverages',
    'Health & Medical',
    'Hobbies & Crafts',
    'Home & Garden',
    'Legal Services',
    'Media & Publishing',
    'Money & Insurance',
    'Public & Local Services',
    'Restaurants & Bars',
    'Shopping & Fashion',
    'Sports',
    'Travel & Vacation',
    'Utilities',
    'Vehicles & Transportation',
  ],

  // Report types
  reportTypes: {
    free: 'Free',
    premium: 'Premium',
  },

  // Rating thresholds
  ratings: {
    excellent: 4.5,
    good: 4.0,
    average: 3.0,
    poor: 2.0,
  },
} as const;

// Type-safe config access
export type Config = typeof config;
export type Industry = typeof config.industries[number];
export type ReportType = typeof config.reportTypes[keyof typeof config.reportTypes];
export type Language = typeof config.ui.supportedLanguages[number];
