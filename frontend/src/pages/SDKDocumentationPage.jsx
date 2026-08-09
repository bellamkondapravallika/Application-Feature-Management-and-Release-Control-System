const SDKDocumentationPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">SDK Documentation</h1>

      <div className="rounded-xl border p-5">
        <h2 className="text-xl font-semibold">Installation</h2>
        <pre className="mt-3 rounded bg-slate-900 p-3 text-green-400">
pip install feature-flag-sdk
        </pre>
      </div>

      <div className="rounded-xl border p-5">
        <h2 className="text-xl font-semibold">Configuration</h2>
        <pre className="mt-3 rounded bg-slate-900 p-3 text-green-400">
{`FLAG_API_URL=http://127.0.0.1:8000
API_KEY=test_key
CACHE_TTL=300`}
        </pre>
      </div>

      <div className="rounded-xl border p-5">
        <h2 className="text-xl font-semibold">Features</h2>
        <ul className="list-disc pl-6 mt-3">
          <li>Automatic API Communication</li>
          <li>Local Caching</li>
          <li>Fallback Handling</li>
          <li>Middleware Integration</li>
        </ul>
      </div>
    </div>
  );
};

export default SDKDocumentationPage;