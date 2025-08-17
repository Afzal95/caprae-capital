import Layout from "@/components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { BuyerCard, BusinessCard } from "@/components/ProfileCard";
import { acceptCard } from "@/redux/matchesSlice";
import { createDeal } from "@/redux/dealsSlice";
import { useMemo, useState } from "react";
import AIModal from "@/components/AIModal";
import BusinessProfileModal from "@/components/BusinessProfileModal";
import { useRouter } from "next/router";
function parseList(str = "") {
  return (str || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}
function moneyToNumber(str = "") {
  const m = (str || "").replace(/[,$\s]/g, "").match(/(\d+(?:\.\d+)?)/);
  if (!m) return null;
  return parseFloat(m[1]);
}
const defaultBusinesses = [
  {
    id: "b1",
    name: "Acme Corp",
    industry: "Technology",
    location: "San Francisco, CA",
    description: "Leading SaaS provider for enterprise clients.",
  },
  {
    id: "b2",
    name: "GreenLeaf Organics",
    industry: "Agriculture",
    location: "Fresno, CA",
    description: "Organic produce farm with established distribution.",
  },
  {
    id: "b3",
    name: "Urban Eats",
    industry: "Food & Beverage",
    location: "New York, NY",
    description: "Popular fast-casual restaurant chain.",
  },
  {
    id: "b4",
    name: "HealthFirst Clinics",
    industry: "Healthcare",
    location: "Austin, TX",
    description: "Multi-location urgent care clinics.",
  },
];
export default function Matches() {
  const role = useSelector((s) => s.user.role);
  const userInfo = useSelector((s) => s.user.info);
  const businessInfo = useSelector((s) => s.user.businessInfo);
  const buyers = useSelector((s) => s.matches.buyerCards);
  const businessesRaw = useSelector((s) => s.matches.businessCards);
  const deals = useSelector((s) => s.deals.deals || []);
  const dispatch = useDispatch();
  const router = useRouter();
  const [modal, setModal] = useState(null);
  const [bizModal, setBizModal] = useState(null);
  const businesses = useMemo(() => {
    if (role !== "buyer") return businessesRaw;
    const prefInd = parseList(userInfo.industries);
    const prefLoc = parseList(userInfo.locations);
    const maxBudget =
      moneyToNumber(userInfo.dealSize?.split("-")?.[1] || userInfo.funds) ||
      Infinity;
    const scored = businessesRaw.map((b) => {
      const indScore =
        prefInd.length && prefInd.includes((b.industry || "").toLowerCase())
          ? 1
          : 0;
      const locScore =
        prefLoc.length && prefLoc.includes((b.location || "").toLowerCase())
          ? 1
          : 0;
      const askNum = moneyToNumber(b.price);
      const budgetScore = askNum && askNum <= maxBudget ? 1 : 0;
      return { ...b, __score: indScore + locScore + budgetScore };
    });
    return scored.sort((a, b) => b.__score - a.__score);
  }, [role, userInfo, businessesRaw]);
  const acceptBuyer = (b) => {
    dispatch(acceptCard({ type: "buyer", id: b.id }));
    dispatch(createDeal(b.name));
    router.push("/deals");
  };
  const requestBusiness = (biz) => {
    dispatch(acceptCard({ type: "business", id: biz.id }));
    dispatch(createDeal(biz.name));
    router.push("/deals");
  };
  const showDefault = role !== "buyer" && role !== "seller";
  return (
    <Layout>
      <div className="mb-4">
        <div className="text-xl font-semibold">Matches</div>
        <div className="text-sm text-gray-600">Role: {role || "—"}</div>
      </div>
      {role === "buyer" && (
        <div className="mb-3 text-sm text-gray-700">
          Recommendations based on your profile (industries, locations, budget).
        </div>
      )}
      {showDefault && (
        <div className="mb-3 text-sm text-gray-700">
          Showing default business listings. Select a role for personalized matches.
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        {role === "seller" &&
          buyers.map((b) => {
            const closedDeal = deals.find(
              (d) => d.name === b.name && d.status === "closed"
            );
            return (
              <div key={b.id} className="card p-6 relative">
                <div className="font-semibold text-lg mb-1">{b.name}</div>
                <div className="text-sm text-gray-600 mb-1">Type: {b.type}</div>
                <div className="text-sm text-gray-600 mb-1">Funds: {b.funds}</div>
                <div className="text-sm text-gray-600 mb-1">Industries: {Array.isArray(b.industries) ? b.industries.join(", ") : b.industries}</div>
                <div className="text-sm text-gray-600 mb-1">Locations: {Array.isArray(b.locations) ? b.locations.join(", ") : b.locations}</div>
                <div className="text-sm text-gray-600 mb-1">Deal Size: {b.dealSize}</div>
                <div className="text-sm text-gray-700 mb-2">{b.description}</div>
                <button
                  className="btn bg-teal text-white mt-2"
                  onClick={() => setModal({
                    title: b.name,
                    body: `Type: ${b.type}\nFunds: ${b.funds}\nIndustries: ${Array.isArray(b.industries) ? b.industries.join(", ") : b.industries}\nLocations: ${Array.isArray(b.locations) ? b.locations.join(", ") : b.locations}\nDeal Size: ${b.dealSize}\n${b.description}`
                  })}
                >
                  View Details
                </button>
                {closedDeal && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Deal Closed</span>
                )}
              </div>
            );
          })}
        {role === "buyer" &&
          businesses.map((biz) => {
            const closedDeal = deals.find(
              (d) => d.name === biz.name && d.status === "closed"
            );
            return (
              <div key={biz.id} className="card p-6 relative">
                <div className="font-semibold text-lg mb-1">{biz.name}</div>
                <div className="text-sm text-gray-600 mb-1">Industry: {biz.industry}</div>
                <div className="text-sm text-gray-600 mb-1">Location: {biz.location}</div>
                <div className="text-sm text-gray-600 mb-1">Founded: {biz.founded}</div>
                <div className="text-sm text-gray-600 mb-1">Employees: {biz.employees}</div>
                <div className="text-sm text-gray-600 mb-1">Revenue: {biz.revenue}</div>
                <div className="text-sm text-gray-700 mb-2">{biz.description}</div>
                <button
                  className="btn bg-teal text-white mt-2"
                  onClick={() => setBizModal(biz)}
                >
                  View Details
                </button>
                {closedDeal && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Deal Closed</span>
                )}
              </div>
            );
          })}
        {showDefault && (
          businessInfo && businessInfo.name ? (
            (() => {
              const closedDeal = deals.find(
                (d) => d.name === businessInfo.name && d.status === "closed"
              );
              return (
                <div className="card p-6 relative">
                  <div className="font-semibold text-lg mb-1">{businessInfo.name}</div>
                  <div className="text-sm text-gray-600 mb-1">Industry: {businessInfo.industry}</div>
                  <div className="text-sm text-gray-600 mb-1">Location: {businessInfo.location}</div>
                  <div className="text-sm text-gray-600 mb-1">Founded: {businessInfo.founded}</div>
                  <div className="text-sm text-gray-600 mb-1">Employees: {businessInfo.employees}</div>
                  <div className="text-sm text-gray-600 mb-1">Revenue: {businessInfo.revenue}</div>
                  <div className="text-sm text-gray-700 mb-2">{businessInfo.description}</div>
                  <button
                    className="btn bg-teal text-white mt-2"
                    onClick={() => setBizModal(businessInfo)}
                  >
                    View Details
                  </button>
                  {closedDeal && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Deal Closed</span>
                  )}
                </div>
              );
            })()
          ) : (
            defaultBusinesses.map((biz) => {
              const closedDeal = deals.find(
                (d) => d.name === biz.name && d.status === "closed"
              );
              return (
                <div key={biz.id} className="card p-6 relative">
                  <div className="font-semibold text-lg mb-1">{biz.name}</div>
                  <div className="text-sm text-gray-600 mb-1">Industry: {biz.industry}</div>
                  <div className="text-sm text-gray-600 mb-1">Location: {biz.location}</div>
                  <div className="text-sm text-gray-600 mb-1">Founded: {biz.founded || "—"}</div>
                  <div className="text-sm text-gray-600 mb-1">Employees: {biz.employees || "—"}</div>
                  <div className="text-sm text-gray-600 mb-1">Revenue: {biz.revenue || "—"}</div>
                  <div className="text-sm text-gray-700 mb-2">{biz.description}</div>
                  <button
                    className="btn bg-teal text-white mt-2"
                    onClick={() => setBizModal(biz)}
                  >
                    View Details
                  </button>
                  {closedDeal && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Deal Closed</span>
                  )}
                </div>
              );
            })
          )
        )}
      </div>
      {modal && (
        <AIModal title={modal.title} onClose={() => setModal(null)}>
          {modal.body}
        </AIModal>
      )}
      {bizModal && (
        <BusinessProfileModal
          biz={bizModal}
          onClose={() => setBizModal(null)}
          onStartDeal={() => {
            dispatch(createDeal(bizModal.name));
            setBizModal(null);
            router.push("/deals");
          }}
          onSendMessage={(text) => {
            const action = dispatch(createDeal(bizModal.name));
            dispatch({
              type: "deals/sendMessage",
              payload: { dealId: action.payload.id, from: "buyer", text },
            });
            setBizModal(null);
            router.push("/deals");
          }}
        />
      )}
    </Layout>
  );
}
