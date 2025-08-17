import Layout from '@/components/Layout';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveDeal } from '@/redux/dealsSlice';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const user = useSelector(s => s.user);
  const deals = useSelector(s => s.deals.deals);
  const dispatch = useDispatch();
  const router = useRouter();

  const closedDeals = deals.filter(d => d.closed);
  const inProgressDeals = deals.filter(d => !d.closed);
  const rejectedDeals = deals.filter(d => d.rejected);

  return (
    <Layout>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card md:col-span-2">
          <div className="text-lg font-semibold mb-1">Welcome back</div>
          <div className="text-sm text-gray-600">Role: {user.role || '—'}</div>
          <div className="mt-4">
            <div className="font-medium mb-2">Active Deals</div>
            <div className="text-sm text-gray-600">No active deals yet. Go to Matches to start.</div>
          </div>
        </div>
        <div className="card">
          <div className="font-medium mb-2">Alerts</div>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>Complete your profile to improve matching</li>
            <li>Check your messages</li>
          </ul>
        </div>
      </div>
      <div className="card max-w-2xl mx-auto mt-8">
        <div className="text-xl font-semibold mb-4">In Progress Deals</div>
        {inProgressDeals.length === 0 ? (
          <div className="text-sm text-gray-500">No in progress deals.</div>
        ) : (
          <div className="space-y-4">
            {inProgressDeals.map(deal => (
              <div key={deal.id} className="p-4 bg-gray-50 rounded shadow">
                <div className="font-medium text-lg mb-1">{deal.counterpartName}</div>
                <div className="text-sm text-gray-600 mb-1">Stage: {deal.stage}</div>
                <div className="text-sm text-yellow-600 mb-2">Status: In Progress</div>
                <button
                  className="btn bg-teal text-white"
                  onClick={() => {
                    dispatch(setActiveDeal(deal.id));
                    router.push('/deals');
                  }}
                >View Details</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="card max-w-2xl mx-auto mt-8">
        <div className="text-xl font-semibold mb-4">Closed Deals</div>
        {closedDeals.length === 0 ? (
          <div className="text-sm text-gray-500">No closed deals yet.</div>
        ) : (
          <div className="space-y-4">
            {closedDeals.map(deal => (
              <div key={deal.id} className="p-4 bg-gray-50 rounded shadow">
                <div className="font-medium text-lg mb-1">{deal.counterpartName}</div>
                <div className="text-sm text-gray-600 mb-1">Stage: {deal.stage}</div>
                <div className="text-sm text-green-600 mb-2">Status: Closed</div>
                <button
                  className="btn bg-teal text-white"
                  onClick={() => {
                    dispatch(setActiveDeal(deal.id));
                    router.push('/deals');
                  }}
                >View Details</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="card max-w-2xl mx-auto mt-8">
        <div className="text-xl font-semibold mb-4">Rejected Deals</div>
        {rejectedDeals.length === 0 ? (
          <div className="text-sm text-gray-500">No rejected deals.</div>
        ) : (
          <div className="space-y-4">
            {rejectedDeals.map(deal => (
              <div key={deal.id} className="p-4 bg-gray-50 rounded shadow">
                <div className="font-medium text-lg mb-1">{deal.counterpartName}</div>
                <div className="text-sm text-gray-600 mb-1">Stage: {deal.stage}</div>
                <div className="text-sm text-red-600 mb-2">Status: Rejected</div>
                <button
                  className="btn bg-teal text-white"
                  onClick={() => {
                    dispatch(setActiveDeal(deal.id));
                    router.push('/deals');
                  }}
                >View Details</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}