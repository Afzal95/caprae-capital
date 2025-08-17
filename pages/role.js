import { useDispatch } from 'react-redux';
import { setRole } from '@/redux/userSlice';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function RoleSelect() {
  const dispatch = useDispatch();
  const router = useRouter();
  const choose = (r) => {
    dispatch(setRole(r));
    router.push(r === 'buyer' ? '/onboarding/buyer' : '/onboarding/seller');
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row items-stretch min-h-[60vh]">
        <div className="md:w-1/2 flex flex-col justify-center items-center bg-teal-50 p-8">
          <div className="text-2xl font-bold mb-6 text-teal-700">Choose Your Role</div>
          <div className="flex flex-col gap-6 w-full max-w-xs">
            <Link href="/onboarding/buyer">
              <button className="btn bg-teal text-white w-full py-3 text-lg shadow">Buyer</button>
            </Link>
            <Link href="/onboarding/seller">
              <button className="btn bg-blue-600 text-white w-full py-3 text-lg shadow">Seller</button>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 flex flex-col justify-center p-8">
          <div className="text-3xl font-bold mb-4 text-gray-800">Welcome to Caprae</div>
          <div className="text-lg text-gray-700 mb-4">Caprae lets you buy or sell businesses with confidence. Choose your role to get started and unlock a guided workflow tailored to your needs.</div>
          <ul className="list-disc pl-6 text-gray-700 text-base mb-4 space-y-2">
            <li>Buyers: Discover opportunities, analyze risks, and negotiate deals.</li>
            <li>Sellers: Present your business, manage offers, and close securely.</li>
            <li>AI-powered matching and due diligence for both roles.</li>
            <li>Secure messaging and document management.</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}