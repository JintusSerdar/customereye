// Contact Us page for CustomerEye

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <div className="bg-white p-6 rounded shadow">
        <p className="mb-4">
          Have questions or want to get in touch? Fill out the form below or
          email us at{" "}
          <a
            href="mailto:info@customereye.com"
            className="text-blue-600 underline"
          >
            info@customereye.com
          </a>
          .
        </p>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="border p-2 rounded"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            className="border p-2 rounded"
            required
          />
          <textarea
            placeholder="Your Message"
            className="border p-2 rounded"
            rows={5}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
