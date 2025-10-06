// Industry mapping for different countries
export const INDUSTRY_MAPPING = {
  'CA': {
    'Money Insurance (CA)': 'Money & Insurance',
    'Beauty Wellbeing (CA)': 'Beauty & Wellbeing',
    'Business Services (CA)': 'Business Services',
    'Electronics Technology (CA)': 'Electronics & Technology',
    'Events Entertainment (CA)': 'Events & Entertainment',
    'Food Beverages (CA)': 'Food & Beverages',
    'Health Medical (CA)': 'Health & Medical',
    'Home Garden (CA)': 'Home & Garden',
    'Shopping Fashion (CA)': 'Shopping & Fashion',
    'Travel Vacation (CA)': 'Travel & Vacation',
    'Others (CA)': 'Other'
  },
  'UK': {
    'Money Insurance (UK)': 'Money & Insurance',
    'Beauty Wellbeing (UK)': 'Beauty & Wellbeing',
    'Business Services (UK)': 'Business Services',
    'Electronics Technology (UK)': 'Electronics & Technology',
    'Events Entertainment (UK)': 'Events & Entertainment',
    'Food Beverages (UK)': 'Food & Beverages',
    'Health Medical (UK)': 'Health & Medical',
    'Home Garden (UK)': 'Home & Garden',
    'Shopping Fashion (UK)': 'Shopping & Fashion',
    'Travel Vacation (UK)': 'Travel & Vacation',
    'Others (UK)': 'Other'
  },
  'US': {
    'Money Insurance (US)': 'Money & Insurance',
    'Beauty Wellbeing (US)': 'Beauty & Wellbeing',
    'Business Services (US)': 'Business Services',
    'Electronics Technology (US)': 'Electronics & Technology',
    'Events Entertainment (US)': 'Events & Entertainment',
    'Food Beverages (US)': 'Food & Beverages',
    'Health Medical (US)': 'Health & Medical',
    'Home Garden (US)': 'Home & Garden',
    'Shopping Fashion (US)': 'Shopping & Fashion',
    'Travel Vacation (US)': 'Travel & Vacation',
    'Others (US)': 'Other'
  }
};

// Function to get industry from folder name
export function getIndustry(country: string, folderName: string): string {
  const countryMapping = INDUSTRY_MAPPING[country as keyof typeof INDUSTRY_MAPPING];
  if (!countryMapping) {
    return 'Other';
  }
  
  return countryMapping[folderName as keyof typeof countryMapping] || 'Other';
}
