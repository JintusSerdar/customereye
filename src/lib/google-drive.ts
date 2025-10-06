import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

// Google Drive API setup
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

export interface GoogleDriveConfig {
  credentialsPath: string;
  tokenPath?: string;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  parents?: string[];
}

export interface CompanyData {
  name: string;
  country: string;
  category: string;
  gptFiles: DriveFile[];
  graphFiles: DriveFile[];
}

export class GoogleDriveDownloader {
  private drive: any;
  private auth: any;

  constructor(private config: GoogleDriveConfig) {}

  async initialize() {
    try {
      // Load credentials
      const credentials = JSON.parse(fs.readFileSync(this.config.credentialsPath, 'utf8'));
      
      // Create OAuth2 client
      const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
      this.auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

      // Load existing token or get new one
      if (this.config.tokenPath && fs.existsSync(this.config.tokenPath)) {
        const token = JSON.parse(fs.readFileSync(this.config.tokenPath, 'utf8'));
        this.auth.setCredentials(token);
      } else {
        const authUrl = this.auth.generateAuthUrl({
          access_type: 'offline',
          scope: SCOPES,
        });
        
        console.log('🔐 Authorize this app by visiting this url:', authUrl);
        console.log('📝 Enter the code from that page here:');
        
        // In a real implementation, you'd handle this interactively
        throw new Error('Please set up authentication first. See setup instructions.');
      }

      this.drive = google.drive({ version: 'v3', auth: this.auth });
      console.log('✅ Google Drive API initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Google Drive API:', error);
      throw error;
    }
  }

  async listFiles(folderId: string): Promise<DriveFile[]> {
    try {
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'files(id, name, mimeType, size, parents)',
      });
      
      return response.data.files;
    } catch (error) {
      console.error('❌ Failed to list files:', error);
      throw error;
    }
  }

  async downloadFile(fileId: string, fileName: string, localPath: string): Promise<string> {
    try {
      const dest = fs.createWriteStream(localPath);
      const response = await this.drive.files.get({
        fileId,
        alt: 'media',
      }, { responseType: 'stream' });

      return new Promise((resolve, reject) => {
        response.data
          .on('end', () => {
            console.log(`📁 Downloaded: ${fileName}`);
            resolve(localPath);
          })
          .on('error', reject)
          .pipe(dest);
      });
    } catch (error) {
      console.error(`❌ Failed to download ${fileName}:`, error);
      throw error;
    }
  }

  async findFolderByName(parentId: string, folderName: string): Promise<string | null> {
    try {
      const files = await this.listFiles(parentId);
      const folder = files.find(file => 
        file.name === folderName && 
        file.mimeType === 'application/vnd.google-apps.folder'
      );
      return folder?.id || null;
    } catch (error) {
      console.error(`❌ Failed to find folder ${folderName}:`, error);
      return null;
    }
  }

  async getCompanyData(rootFolderId: string): Promise<CompanyData[]> {
    const companies: CompanyData[] = [];
    
    try {
      // Get countries (CA, UK, US)
      const countries = await this.listFiles(rootFolderId);
      const countryFolders = countries.filter(f => f.mimeType === 'application/vnd.google-apps.folder');
      
      for (const countryFolder of countryFolders) {
        const country = countryFolder.name;
        console.log(`🌍 Processing country: ${country}`);
        
        // Get categories for this country
        const categories = await this.listFiles(countryFolder.id!);
        const categoryFolders = categories.filter(f => f.mimeType === 'application/vnd.google-apps.folder');
        
        for (const categoryFolder of categoryFolders) {
          const category = categoryFolder.name;
          console.log(`📂 Processing category: ${category}`);
          
          // Get GPT and GRAPH folders
          const gptFolderId = await this.findFolderByName(categoryFolder.id!, 'GPT');
          const graphFolderId = await this.findFolderByName(categoryFolder.id!, 'GRAPH');
          
          if (gptFolderId && graphFolderId) {
            // Get companies from GPT folder
            const gptCompanies = await this.listFiles(gptFolderId);
            const companyFolders = gptCompanies.filter(f => f.mimeType === 'application/vnd.google-apps.folder');
            
            for (const companyFolder of companyFolders) {
              const companyName = companyFolder.name;
              
              // Get files from GPT folder (text files)
              const gptFiles = await this.listFiles(companyFolder.id!);
              const textFiles = gptFiles.filter(f => f.mimeType === 'text/plain');
              
              // Get files from GRAPH folder (image files)
              const graphCompanyFolder = await this.findFolderByName(graphFolderId, companyName);
              let graphFiles: DriveFile[] = [];
              if (graphCompanyFolder) {
                graphFiles = await this.listFiles(graphCompanyFolder);
                graphFiles = graphFiles.filter(f => f.mimeType.startsWith('image/'));
              }
              
              companies.push({
                name: companyName,
                country,
                category,
                gptFiles: textFiles,
                graphFiles,
              });
              
              console.log(`🏢 Found company: ${companyName} (${textFiles.length} text files, ${graphFiles.length} images)`);
            }
          }
        }
      }
      
      return companies;
    } catch (error) {
      console.error('❌ Failed to get company data:', error);
      throw error;
    }
  }

  async downloadCompanyData(company: CompanyData, outputDir: string): Promise<string> {
    const companyDir = path.join(outputDir, company.name);
    await fs.promises.mkdir(companyDir, { recursive: true });
    
    console.log(`📁 Creating directory: ${companyDir}`);
    
    // Download GPT files (text files)
    for (const file of company.gptFiles) {
      const localPath = path.join(companyDir, file.name);
      await this.downloadFile(file.id, file.name, localPath);
    }
    
    // Download GRAPH files (image files)
    for (const file of company.graphFiles) {
      const localPath = path.join(companyDir, file.name);
      await this.downloadFile(file.id, file.name, localPath);
    }
    
    return companyDir;
  }
}

// Utility functions
export function parseCategoryName(category: string): { industry: string; category: string } {
  // Map Google Drive categories to our industry categories
  const categoryMap: Record<string, { industry: string; category: string }> = {
    'Animals Pets (US)': { industry: 'Animals & Pets', category: 'Pet Services' },
    'Beauty Well-being (US)': { industry: 'Beauty & Well-being', category: 'Personal Care' },
    'Business Services (US)': { industry: 'Business Services', category: 'Professional Services' },
    'Construction (US)': { industry: 'Construction', category: 'Building & Construction' },
    'Education Training (US)': { industry: 'Education & Training', category: 'Learning & Development' },
    'Electronics Technology (US)': { industry: 'Electronics & Technology', category: 'Technology Services' },
    'Events Entertainment (US)': { industry: 'Events & Entertainment', category: 'Entertainment Services' },
    'Food Beverages Tobacco (US)': { industry: 'Food & Beverages', category: 'Food & Drink' },
    'Health Medical (US)': { industry: 'Health & Medical', category: 'Healthcare Services' },
    'Hobbies Crafts (US)': { industry: 'Hobbies & Crafts', category: 'Creative Arts' },
    'Home Garden (US)': { industry: 'Home & Garden', category: 'Home Improvement' },
    'Legal Services Government (US)': { industry: 'Legal Services', category: 'Legal & Government' },
    'Media Publishing (US)': { industry: 'Media & Publishing', category: 'Media & Communications' },
    'Money Insurance (US)': { industry: 'Money & Insurance', category: 'Financial Services' },
    'Public Local Services (US)': { industry: 'Public & Local Services', category: 'Government Services' },
    'Restaurants Bars (US)': { industry: 'Restaurants & Bars', category: 'Food & Beverage' },
    'Shopping Fashion (US)': { industry: 'Shopping & Fashion', category: 'Retail & Fashion' },
    'Sports (US)': { industry: 'Sports', category: 'Sports & Recreation' },
    'Travel Vacation (US)': { industry: 'Travel & Vacation', category: 'Travel Services' },
    'Utilities (US)': { industry: 'Utilities', category: 'Utility Services' },
    'Vehicles Transportation (US)': { industry: 'Vehicles & Transportation', category: 'Transportation Services' },
  };
  
  return categoryMap[category] || { industry: 'Business Services', category: 'Other' };
}

export function generateSlug(companyName: string): string {
  return companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
