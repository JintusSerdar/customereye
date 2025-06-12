'use client';

import { useEffect, useState } from 'react';

type TextFile = { name: string; content: string };
type GraphFile = { name: string; url: string };

export default function CompanyReport({ params }: { params: { company: string } }) {
  const [texts, setTexts] = useState<TextFile[]>([]);
  const [graphs, setGraphs] = useState<GraphFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/reports/${params.company}`)
      .then(res => res.json())
      .then(data => {
        setTexts(data.texts);
        setGraphs(data.graphs);
        setLoading(false);
      });
  }, [params.company]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  // Example: You can adjust the order and mapping as needed
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Cover Page */}
      <section className="bg-white flex flex-col items-center justify-center min-h-screen p-12">
        <img
          src="/company-logos/180medical.png" // You can map company to logo or fetch from S3 if you upload logos
          alt="Company Logo"
          className="w-32 h-32 mb-6 rounded-lg shadow"
        />
        <h1 className="text-4xl font-bold text-blue-800 mb-2 text-center">AI-Enhanced<br />Customer Insights<br />Sentiment Analysis<br />2019 - 2024 Report</h1>
        <div className="mt-8 text-xl font-semibold text-gray-700 flex items-center">
          <span className="mr-2">by</span>
          <span className="text-orange-500 font-bold">Customereye</span>
        </div>
      </section>

      {/* Intro Pages (repeat as needed, or use markdown) */}
      <section className="bg-white max-w-3xl mx-auto my-8 p-8 rounded-lg shadow">
        <h2 className="text-3xl font-bold text-purple-700 mb-4">METHODOLOGY</h2>
        <h3 className="text-2xl font-semibold text-purple-600 mb-2">Overview</h3>
        <p className="text-gray-700 mb-4">
          In today&apos;s fast-paced and highly competitive business environment, understanding customer sentiments and preferences is crucial for success...
        </p>
        {/* Add more intro content as needed */}
      </section>

      {/* Custom Data Pages */}
      <section className="max-w-3xl mx-auto my-8">
        {/* Example: Ratings Page */}
        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <h2 className="text-3xl font-bold text-purple-700 mb-4">RATINGS</h2>
          <h3 className="text-2xl font-semibold text-purple-600 mb-2">Given Ratings</h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            {graphs[0] && (
              <img src={graphs[0].url} alt={graphs[0].name} className="w-80 h-auto rounded shadow" />
            )}
            <div>
              <p className="text-gray-700">{texts[0]?.content}</p>
            </div>
          </div>
        </div>
        {/* Repeat for other text/graph pairs */}
        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <h2 className="text-3xl font-bold text-purple-700 mb-4">REVIEWS</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            {graphs[1] && (
              <img src={graphs[1].url} alt={graphs[1].name} className="w-80 h-auto rounded shadow" />
            )}
            <div>
              <p className="text-gray-700">{texts[1]?.content}</p>
            </div>
          </div>
        </div>
        {/* Add more sections as needed */}
      </section>
    </div>
  );
}
