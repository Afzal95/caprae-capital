import React from 'react';

export default function DealDetails({ deal }) {
  if (!deal) return <div className="card">No deal details available.</div>;

  // Stub data for demonstration; replace with real business/owner/buyer details as needed
  const businessDetails = deal.business || {
    name: deal.counterpartName,
    industry: 'Technology',
    location: 'San Francisco, CA',
    description: 'A leading tech company specializing in SaaS.'
  };
  const ownerDetails = deal.owner || {
    name: 'John Doe',
    email: 'owner@example.com',
    phone: '+1-555-1234'
  };
  const buyerDetails = deal.buyer || {
    name: 'Jane Smith',
    email: 'buyer@example.com',
    phone: '+1-555-5678'
  };

  return (
    <div className="card max-w-2xl mx-auto mt-8">
      <div className="text-xl font-semibold mb-4">Deal Details</div>
      <div className="mb-4">
        <div className="font-medium mb-1">Business Details</div>
        <div className="text-sm text-gray-700">Name: {businessDetails.name}</div>
        <div className="text-sm text-gray-700">Industry: {businessDetails.industry}</div>
        <div className="text-sm text-gray-700">Location: {businessDetails.location}</div>
        <div className="text-sm text-gray-700">Description: {businessDetails.description}</div>
      </div>
      <div className="mb-4">
        <div className="font-medium mb-1">Owner Details</div>
        <div className="text-sm text-gray-700">Name: {ownerDetails.name}</div>
        <div className="text-sm text-gray-700">Email: {ownerDetails.email}</div>
        <div className="text-sm text-gray-700">Phone: {ownerDetails.phone}</div>
      </div>
      <div className="mb-4">
        <div className="font-medium mb-1">Buyer Details</div>
        <div className="text-sm text-gray-700">Name: {buyerDetails.name}</div>
        <div className="text-sm text-gray-700">Email: {buyerDetails.email}</div>
        <div className="text-sm text-gray-700">Phone: {buyerDetails.phone}</div>
      </div>
      <div className="mb-4">
        <div className="font-medium mb-1">Deal Status</div>
        <div className="text-sm text-gray-700">Stage: {deal.stage}</div>
        <div className="text-sm text-gray-700">Status: {deal.closed ? 'Closed' : 'In Progress'}</div>
      </div>
    </div>
  );
}
