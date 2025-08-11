"use client";

import React from "react";
import Image from "next/image";

interface ReportPDFProps {
  companyName: string;
}

const ReportPDF: React.FC<ReportPDFProps> = ({ companyName }) => {
  return (
    <div id="pdf-report" className="max-w-4xl mx-auto bg-white shadow-lg">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-8 text-center">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <Image
            src="/logos/MainText.png"
            alt="CustomerEye Logo"
            width={200}
            height={60}
            className="h-12 w-auto"
          />
        </div>
        <h1 className="text-3xl font-bold mb-2">
          Customer Review Analysis Report
        </h1>
        <p className="text-lg opacity-90">
          {companyName} - Comprehensive Customer Insights
        </p>
        <p className="text-sm opacity-75 mt-2">
          Generated on {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Section 1: Ratings Distribution Analysis */}
        <section className="space-y-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
              1
            </div>
            <h2 className="text-2xl font-bold text-primary">
              Ratings Distribution Analysis
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                The given ratings distribution for customer reviews of the{" "}
                <strong>{companyName}</strong> provides valuable insights into
                customer satisfaction levels and feedback nuances. The
                distribution shows that the majority of customers{" "}
                <strong>(93.39%)</strong> have given a rating of 5, indicating a
                high level of satisfaction with the company. This suggests that
                the company has been successful in meeting or exceeding customer
                expectations in most cases.
              </p>

              <p className="text-gray-700 leading-relaxed">
                However, there are also a significant number of customers who
                have given lower ratings. The percentages for ratings 1, 2, 3,
                and 4 are relatively small{" "}
                <em>(1.95%, 0.71%, 1.13%, and 2.83% respectively)</em>, but they
                still represent a considerable number of dissatisfied customers.
                These ratings highlight areas where the company may need to
                improve in order to enhance customer satisfaction.
              </p>

              <p className="text-gray-700 leading-relaxed">
                One significant pattern that emerges from the ratings
                distribution is the lack of ratings between 2 and 4. This
                indicates that customers either had extremely positive
                experiences <em>(rating of 5)</em> or negative experiences{" "}
                <em>(ratings of 1 or 2)</em>. The absence of moderate ratings
                suggests that customers either had exceptional experiences or
                encountered significant issues with the company's products or
                services.
              </p>
            </div>

            <div className="flex items-center justify-center">
              <Image
                src="/temp/Picture1.png"
                alt="Ratings Distribution Chart"
                width={400}
                height={300}
                className="rounded-lg shadow-md"
              />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              The high percentage of customers giving a rating of 5 reflects an
              overall positive perception of the company. This is a crucial
              factor in shaping the brand reputation of{" "}
              <strong>{companyName}</strong>. Potential buyers are likely to be
              influenced by the overwhelmingly positive ratings, which can
              contribute to increased trust and confidence in the company.
            </p>

            <p className="text-gray-700 leading-relaxed">
              To further understand the correlations between rating
              distributions and key customer concerns or positive experiences,
              it would be beneficial to analyze the accompanying customer
              reviews in more detail. By examining the content of the reviews,
              it is possible to identify specific areas of improvement or
              strengths that customers appreciate.
            </p>
          </div>
        </section>

        {/* Section 2: Word Cloud Analysis */}
        <section className="space-y-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
              2
            </div>
            <h2 className="text-2xl font-bold text-primary">
              Word Cloud Analysis
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                The word cloud analysis for{" "}
                <strong>&apos;{companyName}&apos;</strong> reveals several key
                themes and notable terms that reflect customer feedback and
                sentiments. The word cloud provides a visual representation of
                the word frequencies, allowing us to identify the most
                frequently mentioned words and their respective percentages.
              </p>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-primary">1.</span>
                  <span>
                    <strong>Service:</strong> The word &quot;service&quot;
                    appears the most frequently, with a frequency count of{" "}
                    <strong>6,242</strong> and a percentage of{" "}
                    <strong>10.83%</strong>.
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-primary">2.</span>
                  <span>
                    <strong>Great:</strong> The term &quot;great&quot; is the
                    second most frequently mentioned word, with a frequency
                    count of <strong>5,557</strong> and a percentage of{" "}
                    <strong>9.64%</strong>.
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-primary">3.</span>
                  <span>
                    <strong>Customer:</strong> The word &quot;customer&quot;
                    appears with a frequency count of <strong>3,452</strong> and
                    a percentage of <strong>5.99%</strong>.
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-primary">4.</span>
                  <span>
                    <strong>Helpful:</strong> The term &quot;helpful&quot; has a
                    frequency count of <strong>3,324</strong> and a percentage
                    of <strong>5.77%</strong>.
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-primary">5.</span>
                  <span>
                    <strong>Easy:</strong> The word &quot;easy&quot; appears
                    with a frequency count of <strong>3,092</strong> and a
                    percentage of <strong>5.37%</strong>.
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <Image
                src="/temp/Picture2.png"
                alt="Word Cloud Analysis"
                width={400}
                height={300}
                className="rounded-lg shadow-md"
              />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Customers generally report positive experiences with{" "}
              <strong>{companyName}</strong>, highlighting excellent service,
              friendly staff, ease of use, and quick processes. The sentiment
              analysis and word cloud reinforce this satisfaction, with frequent
              positive terms indicating that the company is effectively meeting
              customer expectations.
            </p>

            <p className="text-gray-700 leading-relaxed">
              These positive perceptions are essential for customer loyalty,
              advocacy, and overall satisfaction. By identifying recurring
              themes in customer feedback,
              <strong>{companyName}</strong> can continue enhancing these
              strengths while addressing any areas for improvement to further
              boost satisfaction and loyalty.
            </p>
          </div>
        </section>

        {/* Section 3: Customer Engagement Analysis */}
        <section className="space-y-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
              3
            </div>
            <h2 className="text-2xl font-bold text-primary">
              Customer Engagement Analysis
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                In the years <strong>2019, 2020, and 2021</strong>,{" "}
                <strong>'{companyName}'</strong> did not provide any replies to
                customer reviews. This lack of engagement during this period
                could have potentially had a negative impact on customer
                satisfaction and overall sentiment. Customers may have felt
                ignored or neglected, leading to a decline in their trust and
                loyalty towards the company.
              </p>

              <p className="text-gray-700 leading-relaxed">
                However, in <strong>2022</strong>, there was a significant
                increase in the number of replies, with a total of{" "}
                <strong>1 reply</strong>. While this may seem like a small
                number, it indicates a shift in the company's approach to
                handling customer concerns.
              </p>

              <p className="text-gray-700 leading-relaxed">
                The real transformation in customer engagement occurred in{" "}
                <strong>2023</strong>, where there was a substantial jump in the
                number of replies to <strong>9,322</strong>. This increase
                signifies a more proactive approach by{" "}
                <strong>'{companyName}'</strong> in responding to customer
                feedback.
              </p>
            </div>

            <div className="flex items-center justify-center">
              <Image
                src="/temp/Picture3.png"
                alt="Customer Engagement Chart"
                width={400}
                height={300}
                className="rounded-lg shadow-md"
              />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              In <strong>2024</strong>, the trend of increased customer
              engagement continued, with a total of{" "}
              <strong>10,671 replies</strong>. This shows a sustained effort by
              the company to prioritize customer feedback and ensure that
              customers feel heard and valued.
            </p>

            <p className="text-gray-700 leading-relaxed">
              The timing of the replies is also a crucial factor to consider.
              The absence of replies in 2019, 2020, and 2021 indicates a delayed
              response time, which may have negatively impacted customer
              satisfaction. However, the increase in reply volumes in 2022,
              2023, and 2024 suggests that the company has made efforts to
              address customer feedback in a more timely manner.
            </p>
          </div>
        </section>

        {/* Section 4: Conclusion */}
        <section className="space-y-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
              4
            </div>
            <h2 className="text-2xl font-bold text-primary">
              Conclusion & Recommendations
            </h2>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              In conclusion, the analysis of customer reviews for the{" "}
              <strong>{companyName}</strong>
              provides valuable insights into customer satisfaction levels and
              feedback nuances. The majority of customers have given a rating of
              5, indicating a high level of satisfaction with the company.
              However, there are still a significant number of dissatisfied
              customers, highlighting areas where the company can improve.
            </p>

            <p className="text-gray-700 leading-relaxed">
              The word cloud analysis reveals key themes and terms that reflect
              customer feedback and sentiments. Customers frequently mention the
              service, great experiences, helpful staff, and easy processes.
              This positive sentiment reflects a high level of satisfaction and
              suggests that the company is meeting customer expectations.
            </p>

            <p className="text-gray-700 leading-relaxed">
              The lack of replies from the company in previous years may have
              negatively impacted customer satisfaction. However, there has been
              a significant increase in the number of replies in recent years,
              indicating a more proactive approach to addressing customer
              feedback.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-primary mb-4">
                Key Recommendations:
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="font-bold text-primary">1.</span>
                  <span>
                    <strong>Address specific concerns:</strong> Analyze the
                    feedback from customers who gave lower ratings and address
                    their specific concerns.
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="font-bold text-primary">2.</span>
                  <span>
                    <strong>Improve communication:</strong> Enhance
                    communication channels to ensure that customers' concerns
                    are heard and addressed promptly.
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="font-bold text-primary">3.</span>
                  <span>
                    <strong>Proactively seek feedback:</strong> Actively seek
                    feedback from customers to identify areas for improvement.
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="font-bold text-primary">4.</span>
                  <span>
                    <strong>Enhance employee training:</strong> Provide
                    comprehensive training to employees to ensure they have the
                    necessary skills and knowledge.
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="font-bold text-primary">5.</span>
                  <span>
                    <strong>Monitor and respond to online reviews:</strong>{" "}
                    Monitor online review platforms and respond to both positive
                    and negative reviews.
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed">
              Overall, by analyzing customer ratings, sentiments, word clouds,
              and engagement patterns, the <strong>{companyName}</strong> can
              gain valuable insights into customer concerns and positive
              experiences. This will enable them to enhance service quality,
              improve customer relations, and ultimately increase customer
              satisfaction and loyalty.
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 p-6 text-center text-gray-600">
        <p className="text-sm">
          © 2024 CustomerEye. All rights reserved. | Report generated by
          CustomerEye AI Analysis System
        </p>
      </div>
    </div>
  );
};

export default ReportPDF;
