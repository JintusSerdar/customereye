# 🚀 Bulk Upload Guide for Google Drive Data

You have **two options** to upload your Google Drive data to CustomerEye. Choose the one that works best for you!

## 🎯 Option 1: Automated Google Drive API (Recommended)

**Best for:** Large datasets, hands-off approach, full automation

### Setup Steps:

1. **Get Google Drive API Access**
   - Follow the detailed guide in `GOOGLE_DRIVE_SETUP.md`
   - Get your folder ID and credentials

2. **Run Automated Upload**
   ```bash
   # Test with 3 companies first
   npm run bulk-upload 1ABC123DEF456GHI789 ./credentials.json --max-companies 3
   
   # Full upload (all companies)
   npm run bulk-upload 1ABC123DEF456GHI789 ./credentials.json
   ```

**Pros:** ✅ Fully automated, ✅ Downloads everything, ✅ Handles all file types
**Cons:** ❌ Requires Google API setup, ❌ More complex initial setup

---

## 🎯 Option 2: Manual Download + Local Processing (Easier)

**Best for:** Quick setup, manual control, smaller batches

### Setup Steps:

1. **Download Your Google Drive Data**
   - Go to your Google Drive folder
   - Select all folders (CA, UK, US)
   - Right-click → "Download" (this creates a ZIP)
   - Extract to a local folder like `./my-google-drive-data/`

2. **Organize the Structure**
   ```
   ./my-google-drive-data/
   ├── US/
   │   ├── Beauty Well-being (US)/
   │   │   ├── GPT/
   │   │   │   ├── company1/
   │   │   │   │   ├── 1_rating_distribution_company1.txt
   │   │   │   │   ├── 2_wordcloud_company1.txt
   │   │   │   │   ├── 3_yearly_replies_company1.txt
   │   │   │   │   └── Conclusion.txt
   │   │   │   └── company2/...
   │   │   └── GRAPH/
   │   │       ├── company1/
   │   │       │   ├── 1_rating_distribution_company1.png
   │   │       │   ├── 2_wordcloud_company1.png
   │   │       │   └── 3_yearly_replies_company1.png
   │   │       └── company2/...
   │   └── Business Services (US)/...
   ├── UK/...
   └── CA/...
   ```

3. **Run Local Processing**
   ```bash
   npm run organize-data ./my-google-drive-data
   ```

**Pros:** ✅ Simple setup, ✅ No API required, ✅ Full control
**Cons:** ❌ Manual download step, ❌ Need to organize files

---

## 🎯 Option 3: Web Interface (For Individual Companies)

**Best for:** Testing, individual uploads, manual review

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Visit the upload interface**
   - Go to: http://localhost:3001/admin/upload
   - Fill in company information
   - Upload files manually
   - Submit

**Pros:** ✅ Easy to use, ✅ Visual interface, ✅ Good for testing
**Cons:** ❌ Manual process, ❌ Not suitable for bulk uploads

---

## 📊 What Happens During Upload

### Automatic Processing:
1. **Scans your data structure** (countries → categories → companies)
2. **Downloads/processes files** (text and images)
3. **Categorizes companies** by industry and country
4. **Creates database records** for each company
5. **Organizes files** by section type automatically
6. **Generates report sections** with proper ordering

### File Mapping:
- **GPT folder** → Text files (analysis data)
- **GRAPH folder** → Image files (charts and visualizations)  
- **PDF folder** → Ignored (as requested)

### Section Detection:
- `*rating_distribution*` → Rating Distribution Analysis
- `*wordcloud*` → Word Cloud Analysis
- `*yearly_replies*` → Customer Engagement Analysis
- `Conclusion.txt` → Conclusion & Recommendations

---

## 🚀 Quick Start (Recommended)

### For Most Users - Option 2 (Manual Download):

1. **Download your Google Drive data** to a local folder
2. **Organize it** according to the structure above
3. **Run the upload:**
   ```bash
   npm run organize-data ./my-google-drive-data
   ```
4. **Visit your data:** http://localhost:3001

### For Power Users - Option 1 (Google Drive API):

1. **Follow the Google Drive setup guide**
2. **Get your folder ID and credentials**
3. **Run automated upload:**
   ```bash
   npm run bulk-upload <folder-id> ./credentials.json
   ```

---

## 📈 Expected Results

After successful upload, you'll have:

- ✅ **All companies** in your database
- ✅ **All files** downloaded and organized
- ✅ **Report sections** created automatically
- ✅ **Web interface** ready at http://localhost:3001
- ✅ **Search and filtering** working
- ✅ **PDF generation** ready

---

## 🔍 Monitoring Progress

The scripts will show detailed progress:

```
🌍 Processing country: US
📂 Processing category: Beauty Well-being (US)
🏢 Processing: fragrance11
✅ Report created: cmg92mlo70000njn7f9t7dnsb
📁 Uploaded 7 files for fragrance11
🎉 Processing completed!
✅ Success: 45 companies
❌ Errors: 2 companies
```

---

## 🚨 Troubleshooting

### Common Issues:

1. **"Directory not found"**
   - Check the path to your data folder
   - Make sure you've downloaded and extracted the files

2. **"Database connection failed"**
   - Make sure PostgreSQL is running
   - Check your `.env.local` file

3. **"Files not found"**
   - Verify the folder structure matches the expected format
   - Check that GPT and GRAPH folders exist

4. **"Permission denied"**
   - Make sure you have write access to the project directory
   - Check file permissions

### Debug Commands:

```bash
# Test database connection
DATABASE_URL="postgresql://serdarakin@localhost:5432/customereye" npx ts-node src/scripts/test-database.ts

# Check your data structure
ls -la ./my-google-drive-data/
ls -la ./my-google-drive-data/US/
ls -la ./my-google-drive-data/US/Beauty\ Well-being\ \(US\)/GPT/

# Test with a small batch
npm run organize-data ./my-google-drive-data/US/Beauty\ Well-being\ \(US\)/
```

---

## 🎉 Success!

Once complete, you'll have:
- ✅ **Hundreds of companies** in your database
- ✅ **Thousands of files** organized and accessible
- ✅ **Full web interface** at http://localhost:3001
- ✅ **Search and filtering** across all data
- ✅ **PDF generation** for any company
- ✅ **Ready for production** deployment

**Your CustomerEye platform will be fully populated with all your Google Drive data!** 🚀
