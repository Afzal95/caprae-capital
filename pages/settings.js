import Layout from '@/components/Layout';
import { useState } from 'react';

export default function Settings() {
  const [email, setEmail] = useState('user@example.com');
  const [notifications, setNotifications] = useState(true);

  return (
    <Layout>
      <div className="card max-w-md mx-auto mt-8">
        <div className="text-xl font-semibold mb-4">Settings</div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="input w-full"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Notifications</label>
          <input
            type="checkbox"
            checked={notifications}
            onChange={e => setNotifications(e.target.checked)}
          />{' '}
          Enable email notifications
        </div>
        <button className="btn bg-teal text-white w-full" onClick={() => window.location.href = '/'}>Save Settings</button>
      </div>
    </Layout>
  );
}