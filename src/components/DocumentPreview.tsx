import React from 'react';
import Image from 'next/image';

interface DocumentPreviewProps {
  title: string;
  description?: string;
  previewContent: {
    text?: string;
    images?: string[];
  };
  price: number;
  onPurchase: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  title,
  description,
  previewContent,
  price,
  onPurchase,
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      {description && (
        <p className="text-gray-600 mb-6">{description}</p>
      )}
      
      <div className="space-y-6">
        {previewContent.text && (
          <div className="prose max-w-none">
            <p className="text-gray-700">{previewContent.text}</p>
          </div>
        )}
        
        {previewContent.images && previewContent.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {previewContent.images.map((image, index) => (
              <div key={index} className="relative aspect-video">
                <Image
                  src={image}
                  alt={`Preview image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold">${price.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Full document access</p>
          </div>
          <button
            onClick={onPurchase}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
}; 