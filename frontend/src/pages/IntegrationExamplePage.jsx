const IntegrationExamplesPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Integration Examples</h1>

      <div className="rounded-xl border p-5">
        <h2 className="text-xl font-semibold">FastAPI Example</h2>
        <pre className="mt-3 rounded bg-slate-900 p-3 text-green-400 overflow-auto">
{`from feature_flag_sdk.client import FeatureFlagClient

client = FeatureFlagClient()

enabled = client.is_enabled(
    "new_dashboard",
    user_id="user_101"
)`}
        </pre>
      </div>

      <div className="rounded-xl border p-5">
        <h2 className="text-xl font-semibold">Django Example</h2>
        <pre className="mt-3 rounded bg-slate-900 p-3 text-green-400 overflow-auto">
{`from feature_flag_sdk.client import FeatureFlagClient

client = FeatureFlagClient()

enabled = client.is_enabled(
    "new_dashboard",
    user_id="user_101"
)`}
        </pre>
      </div>
    </div>
  );
};

export default IntegrationExamplesPage;