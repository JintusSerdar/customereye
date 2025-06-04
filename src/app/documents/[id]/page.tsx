import { DocumentPreview } from '@/components/DocumentPreview';

async function getDocument(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/${id}`, {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch document');
  }
  
  return res.json();
}

export default async function DocumentPage({
  params,
}: {
  params: { id: string };
}) {
  const document = await getDocument(params.id);

  const handlePurchase = async () => {
    // Implement purchase logic here
    // This should be handled by a client component
    console.log('Purchase initiated');
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <DocumentPreview
        title={document.title}
        description={document.description}
        previewContent={document.content}
        price={document.price}
        onPurchase={handlePurchase}
      />
    </main>
  );
} 