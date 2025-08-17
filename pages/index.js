import { useSelector } from 'react-redux';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function HomePage() {
  const user = useSelector(s => s.user);
  const isLoggedIn = !!user && !!user.email;

  return (
    <Layout>
      <div className="bg-gradient-to-br from-teal-50 to-white py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl font-extrabold text-teal-700 mb-4">Caprae Platform</div>
          <div className="text-xl text-gray-700 mb-6">Modern business acquisition, powered by AI.</div>
          <div className="mb-8 text-lg text-gray-600">Caprae connects buyers and sellers, streamlines negotiations, and automates due diligence for a seamless acquisition experience.</div>
          {isLoggedIn ? (
            <div className="flex justify-center gap-4 mb-8">
              <Link href="/onboarding/buyer">
                <button className="btn bg-teal text-white px-8 py-3 text-lg shadow">Continue as Buyer</button>
              </Link>
              <Link href="/onboarding/seller">
                <button className="btn bg-blue-600 text-white px-8 py-3 text-lg shadow">Continue as Seller</button>
              </Link>
            </div>
          ) : (
            <div className="mb-8">
              <Link href="/login">
                <button className="btn bg-teal text-white px-8 py-3 text-lg shadow">Login to Get Started</button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="max-w-5xl mx-auto py-12 px-4 grid md:grid-cols-2 gap-12">
        <div>
          <div className="text-2xl font-bold mb-4 text-teal-700">Why Choose Caprae?</div>
          <ul className="list-disc pl-6 text-gray-700 text-base mb-4 space-y-2">
            <li>AI-powered matching for faster, smarter deals</li>
            <li>End-to-end workflow: NDA, Due Diligence, Negotiation, Closing</li>
            <li>Secure document uploads and e-signatures</li>
            <li>Automated risk highlights and financial analysis</li>
            <li>Integrated messaging and notifications</li>
            <li>Role-based onboarding for buyers and sellers</li>
            <li>Dashboard to track all your deals and progress</li>
            <li>Modern, intuitive interface for all users</li>
          </ul>
        </div>
        <div>
          <div className="text-2xl font-bold mb-4 text-teal-700">How It Works</div>
          <ol className="list-decimal pl-6 text-gray-700 text-base mb-4 space-y-2">
            <li>Sign up and complete your profile</li>
            <li>Choose your role: Buyer or Seller</li>
            <li>Get matched and start a deal</li>
            <li>Follow guided steps to complete the acquisition</li>
            <li>Track status and communicate securely</li>
          </ol>
        </div>
      </div>
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-2xl font-bold text-teal-700 mb-4">Trusted by Business Leaders</div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded shadow p-6">
              <div className="font-semibold mb-2">"Caprae made our acquisition process effortless and secure."</div>
              <div className="text-sm text-gray-600">— CEO, Acme Corp</div>
            </div>
            <div className="bg-white rounded shadow p-6">
              <div className="font-semibold mb-2">"The AI matching saved us weeks of searching for the right buyer."</div>
              <div className="text-sm text-gray-600">— Founder, TechStart</div>
            </div>
            <div className="bg-white rounded shadow p-6">
              <div className="font-semibold mb-2">"I felt confident and informed at every step."</div>
              <div className="text-sm text-gray-600">— Investor, GrowthFund</div>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-white border-t py-6 mt-12">
        <div className="max-w-4xl mx-auto text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Caprae Platform. All rights reserved. | <Link href="/about"><span className="underline cursor-pointer">About</span></Link>
        </div>
      </footer>
    </Layout>
  );
}