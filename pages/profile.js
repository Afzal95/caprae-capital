import Layout from "@/components/Layout";
import { useSelector } from "react-redux";
function Field({ label, value }) {
  return (
    <div>
      <div className="text-sm font-medium text-gray-600">{label}</div>
      <div className="text-base text-gray-900">{value}</div>
    </div>
  );
}
export default function Profile() {
  // Hardcoded role for demonstration
  const role = "buyer"; // Change to "seller" to see seller profile
  return (
    <Layout>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {role === "buyer" ? "Buyer Profile" : "Seller Profile"}
        </h1>
        <div className="bg-white shadow rounded-2xl p-6 space-y-4">
          {role === "buyer" ? (
            <>
              <Field label="Funds Available" value="$2,000,000" />
              <Field label="Preferred Industries" value="Technology, Healthcare" />
              <Field label="Deal Size Range" value="$500,000 - $5,000,000" />
              <Field label="Location Preferences" value="San Francisco, CA; Austin, TX" />
              <Field label="Acquisition Experience" value="3 previous acquisitions" />
            </>
          ) : (
            <>
              <Field label="Business Name" value="Acme Corp" />
              <Field label="Industry" value="Technology" />
              <Field label="Location" value="San Francisco, CA" />
              <Field label="Founded" value="2010" />
              <Field label="Employees" value="120" />
              <Field label="Revenue" value="$8,000,000" />
              <Field label="Asking Price" value="$4,500,000" />
              <Field label="Motivation for Selling" value="Looking to pursue new ventures" />
              <Field label="Confidentiality Preferences" value="NDA required" />
              <Field label="Uploaded Documents" value="Business Plan.pdf, Financials.xlsx" />
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
