# 🚀 Google Drive Bulk Upload Setup

This guide will help you set up automated bulk upload from your Google Drive to CustomerEye.

## 📋 Prerequisites

- Google Drive account with your data
- Google Cloud Console access
- Node.js and npm installed

## 🔧 Setup Steps

### 1. Google Cloud Console Setup

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project** (or use existing)
   - Click "Select a project" → "New Project"
   - Name: "CustomerEye Drive Integration"
   - Click "Create"

3. **Enable Google Drive API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google Drive API"
   - Click "Enable"

4. **Create Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Desktop application"
   - Name: "CustomerEye Desktop"
   - Click "Create"

5. **Download Credentials**
   - Click the download button (⬇️) next to your OAuth client
   - Save as `credentials.json` in your project root

### 2. Get Your Google Drive Folder ID

1. **Open your Google Drive** in a web browser
2. **Navigate to your data folder** (the one with CA, UK, US folders)
3. **Copy the folder ID from the URL**
   - URL looks like: `https://drive.google.com/drive/folders/1ABC123DEF456GHI789`
   - The folder ID is: `1ABC123DEF456GHI789`

### 3. Test the Setup

```bash
# Test with a small batch first
npm run bulk-upload 1ABC123DEF456GHI789 ./credentials.json --max-companies 3

# Full upload (all companies)
npm run bulk-upload 1ABC123DEF456GHI789 ./credentials.json
```

## 📁 Expected Google Drive Structure

Your Google Drive should be organized like this:

```
📁 Your Data Folder (root folder ID)
├── 📁 CA (Canada)
│   ├── 📁 Animals Pets (CA)
│   │   ├── 📁 GPT
│   │   │   ├── 📁 company1
│   │   │   │   ├── 1_rating_distribution_company1.txt
│   │   │   │   ├── 2_wordcloud_company1.txt
│   │   │   │   ├── 3_yearly_replies_company1.txt
│   │   │   │   └── Conclusion.txt
│   │   │   └── 📁 company2...
│   │   └── 📁 GRAPH
│   │       ├── 📁 company1
│   │       │   ├── 1_rating_distribution_company1.png
│   │       │   ├── 2_wordcloud_company1.png
│   │       │   └── 3_yearly_replies_company1.png
│   │       └── 📁 company2...
│   └── 📁 Beauty Well-being (CA)...
├── 📁 UK (United Kingdom)
│   └── (same structure as CA)
└── 📁 US (United States)
    ├── 📁 Animals Pets (US)
    ├── 📁 Beauty Well-being (US)
    ├── 📁 Business Services (US)
    ├── 📁 Construction (US)
    ├── 📁 Education Training (US)
    ├── 📁 Electronics Technology (US)
    ├── 📁 Events Entertainment (US)
    ├── 📁 Food Beverages Tobacco (US)
    ├── 📁 Health Medical (US)
    ├── 📁 Hobbies Crafts (US)
    ├── 📁 Home Garden (US)
    ├── 📁 Legal Services Government (US)
    ├── 📁 Media Publishing (US)
    ├── 📁 Money Insurance (US)
    ├── 📁 Public Local Services (US)
    ├── 📁 Restaurants Bars (US)
    ├── 📁 Shopping Fashion (US)
    ├── 📁 Sports (US)
    ├── 📁 Travel Vacation (US)
    ├── 📁 Utilities (US)
    └── 📁 Vehicles Transportation (US)
```

## 🎯 What the Script Does

### Automatic Processing:
1. **Scans your Google Drive** structure
2. **Downloads all files** (text and images)
3. **Categorizes companies** by country and industry
4. **Creates database records** for each company
5. **Organizes files** by section type
6. **Generates report sections** automatically

### File Mapping:
- **GPT folder** → Text files (analysis data)
- **GRAPH folder** → Image files (charts and visualizations)
- **PDF folder** → Ignored (as requested)

### Section Detection:
- `*rating_distribution*` → Rating Distribution Analysis
- `*wordcloud*` → Word Cloud Analysis  
- `*yearly_replies*` → Customer Engagement Analysis
- `Conclusion.txt` → Conclusion & Recommendations

## 🚀 Usage Examples

### Test with 3 companies:
```bash
npm run bulk-upload 1ABC123DEF456GHI789 ./credentials.json --max-companies 3
```

### Full upload:
```bash
npm run bulk-upload 1ABC123DEF456GHI789 ./credentials.json
```

### Custom output directory:
```bash
npm run bulk-upload 1ABC123DEF456GHI789 ./credentials.json --output-dir ./my-downloads
```

## 📊 Expected Results

After running the script, you'll have:

- **Database records** for all companies
- **Downloaded files** in organized folders
- **Report sections** created automatically
- **Web interface** ready at http://localhost:3001

## 🔍 Monitoring Progress

The script will show:
```
🌍 Processing country: US
📂 Processing category: Beauty Well-being (US)
🏢 Found company: fragrance11 (4 text files, 3 images)
📁 Downloaded: 1_rating_distribution_fragrance11.txt
📁 Downloaded: 2_wordcloud_fragrance11.txt
✅ Report created: cmg92mlo70000njn7f9t7dnsb
📁 Uploaded 7 files for fragrance11
```

## 🚨 Troubleshooting

### Common Issues:

1. **Authentication Error**
   - Make sure `credentials.json` is in the project root
   - Check that Google Drive API is enabled
   - Verify OAuth client is set up correctly

2. **Folder Not Found**
   - Double-check the folder ID in the URL
   - Ensure you have access to the folder
   - Try with a smaller test folder first

3. **Permission Denied**
   - Make sure the OAuth client has proper scopes
   - Re-authenticate if needed
   - Check folder permissions in Google Drive

4. **Rate Limiting**
   - Google Drive API has rate limits
   - The script includes delays to avoid issues
   - If you hit limits, wait and retry

### Debug Commands:

```bash
# Check database connection
DATABASE_URL="postgresql://serdarakin@localhost:5432/customereye" npx ts-node src/scripts/test-database.ts

# Test with minimal data
npm run bulk-upload <folder-id> ./credentials.json --max-companies 1

# Check downloaded files
ls -la ./downloads/
```

## 🎉 Success!

Once complete, you'll have:
- ✅ All companies in your database
- ✅ All files downloaded and organized
- ✅ Reports ready for viewing
- ✅ Web interface fully functional

Visit http://localhost:3001 to see your data!
