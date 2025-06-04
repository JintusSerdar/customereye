'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Document {
  id: string;
  title: string;
  description: string | null;
  price: number;
  createdAt: string;
}

interface Purchase {
  id: string;
  document: Document;
  purchasedAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchPurchases();
    }
  }, [session]);

  const fetchPurchases = async () => {
    try {
      const response = await fetch('/api/purchases');
      if (response.ok) {
        const data = await response.json();
        setPurchases(data);
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Purchases</h2>
          {purchases.length === 0 ? (
            <p className="text-gray-500">You haven't purchased any documents yet.</p>
          ) : (
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-medium text-gray-900">
                    {purchase.document.title}
                  </h3>
                  {purchase.document.description && (
                    <p className="text-gray-500 mt-1">
                      {purchase.document.description}
                    </p>
                  )}
                  <div className="mt-2 text-sm text-gray-500">
                    Purchased on:{' '}
                    {new Date(purchase.purchasedAt).toLocaleDateString()}
                  </div>
                  <Link
                    href={`/documents/${purchase.document.id}`}
                    className="mt-2 inline-block text-blue-600 hover:text-blue-800"
                  >
                    View Document →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 