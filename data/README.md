# 📁 Data Directory Structure

This directory contains sample data for CustomerEye reports. Organize your data files according to this structure for easy upload.

## 📂 Directory Structure

```
data/
├── fragrance11/                    # Free report example
│   ├── 1_given_rating_distributions_fragrance11.txt
│   ├── 1_given_rating_distributions_fragrance11.png
│   ├── 6_overall_reviews_wordcloud_fragrance11.txt
│   ├── 6_overall_reviews_wordcloud_fragrance11.png
│   ├── 15_overall_yearly_replies_fragrance11.txt
│   ├── 15_overall_yearly_replies_fragrance11.png
│   └── Conclusion.txt
│
├── remitly/                        # Premium report example
│   ├── 1_clrat1_given_ratings_distribution_remitly.txt
│   ├── 1_clrat1_given_ratings_distribution_remitly.png
│   ├── 2_c1rat2_sentiments_distribution_remitly.txt
│   ├── 2_c1rat2_sentiments_distribution_remitly.png
│   ├── 3_c1rat3_given_ratings_vs_sentiments_remitly.txt
│   ├── 3_c1rat3_given_ratings_vs_sentiments_remitly.png
│   ├── 4_c1rat4_average_ratings_and_sentiments_over_years_remitly.txt
│   ├── 4_c1rat4_average_ratings_and_sentiments_over_years_remitly.png
│   ├── 5_c1rats_average_ratings_and_sentiments_over_months_remitly.txt
│   ├── 5_c1rats_average_ratings_and_sentiments_over_months_remitly.png
│   ├── 6_c1rev1_overall_wordcloud_remitly.txt
│   ├── 6_c1rev1_overall_wordcloud_remitly.png
│   ├── 7_c1rev2_positive_wordcloud_remitly.txt
│   ├── 7_c1rev2_positive_wordcloud_remitly.png
│   ├── 8_c1rev3_negative_wordcloud_remitly.txt
│   ├── 8_c1rev3_negative_wordcloud_remitly.png
│   ├── 9_c1rev4_overall_most_common_words_remitly.txt
│   ├── 9_c1rev4_overall_most_common_words_remitly.png
│   ├── 10_c1rev5_positive_most_common_words_remitly.txt
│   ├── 10_c1rev5_positive_most_common_words_remitly.png
│   ├── 11_c1rev6_negative_most_common_words_remitly.txt
│   ├── 11_c1rev6_negative_most_common_words_remitly.png
│   ├── 12_c1rev7_overall_text_item_counts_remitly.txt
│   ├── 12_c1rev7_overall_text_item_counts_remitly.png
│   ├── 13_c1rev8_positive_text_item_counts_remitly.txt
│   ├── 13_c1rev8_positive_text_item_counts_remitly.png
│   ├── 14_c1rev9_negative_text_item_counts_remitly.txt
│   ├── 14_c1rev9_negative_text_item_counts_remitly.png
│   ├── 15_overall_yearly_replies_remitly.txt
│   ├── 15_overall_yearly_replies_remitly.png
│   └── Conclusion.txt
│
└── your-company/                   # Your custom data
    ├── 1_rating_distribution_your-company.txt
    ├── 1_rating_distribution_your-company.png
    ├── 2_wordcloud_your-company.txt
    ├── 2_wordcloud_your-company.png
    └── Conclusion.txt
```

## 📋 File Naming Conventions

### Pattern: `{sequence}_{section_type}_{company_name}.{extension}`

- **Sequence**: Number for ordering (1, 2, 3, etc.)
- **Section Type**: Descriptive name of the analysis
- **Company Name**: Company identifier
- **Extension**: File type (.txt, .png, .jpg, .pdf)

### Examples:

```
1_given_rating_distributions_fragrance11.txt
6_overall_reviews_wordcloud_fragrance11.png
15_overall_yearly_replies_remitly.txt
Conclusion.txt
```

## 🎯 Upload Instructions

### 1. Prepare Your Data

1. Create a directory for your company: `data/your-company/`
2. Add all your data files following the naming convention
3. Ensure you have both text and image files for each analysis

### 2. Upload via CLI

```bash
# For Fragrance11 (Free report)
npm run upload:fragrance11

# For Remitly (Premium report)  
npm run upload:remitly

# For custom data, modify the upload script
```

### 3. Upload via Web Interface

1. Go to `/admin/upload`
2. Fill in company information
3. Upload files
4. Submit

## 📊 Supported File Types

- **Text Files**: `.txt` - Analysis data and conclusions
- **Images**: `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg` - Charts and visualizations
- **PDFs**: `.pdf` - Complete reports
- **JSON**: `.json` - Structured data

## 🔍 Automatic Classification

The system automatically detects:

- **Section Type**: Based on filename keywords
- **File Type**: Based on file extension
- **Sequence**: From numbered prefixes
- **Company**: From directory name

## 📝 Sample Data

### Free Report (Fragrance11)
- Rating distribution analysis
- Overall word cloud
- Yearly replies analysis
- Conclusion

### Premium Report (Remitly)
- Rating distribution
- Sentiment analysis
- Rating vs sentiment correlation
- Yearly/monthly trends
- Multiple word clouds (overall, positive, negative)
- Common words analysis
- Text count metrics
- Customer engagement
- Comprehensive conclusion

## 🚀 Next Steps

1. **Organize your Google Drive data** according to this structure
2. **Create company directories** for each report
3. **Rename files** to follow the naming convention
4. **Test upload** with sample data
5. **Scale up** to all your reports

## 💡 Tips

- Keep filenames descriptive but concise
- Use consistent naming across all companies
- Include both text and image versions of analyses
- Always include a Conclusion.txt file
- Test with a small dataset first
