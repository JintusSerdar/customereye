import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to CustomerEye
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Generate and manage AI-powered customer insights and reports. Get valuable insights from your customer data with our advanced AI technology.
      </p>
      <div className="space-x-4">
        <Link
          href="/auth/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/auth/register"
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
