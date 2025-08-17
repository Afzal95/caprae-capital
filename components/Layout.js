import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
export default function Layout({ children }) {
  const profileCompletion = useSelector((s) => s.user.profileCompletion);
  const user = useSelector((s) => s.user);
  const isLoggedIn = (!!user && !!user.email) || user?.isAuthenticated;
  const router = useRouter();
  // Restrict access to protected pages if not logged in
  React.useEffect(() => {
    const protectedRoutes = [
      "/dashboard",
      "/deals",
      "/profile",
      "/matches",
      "/messages",
      "/settings",
    ];
    if (!isLoggedIn && protectedRoutes.includes(router.pathname)) {
      router.replace("/");
    }
  }, [isLoggedIn, router.pathname]);
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow mb-6">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push(isLoggedIn ? "/role" : "/")}
          >
            {/* <img src="/logo.png" alt="Logo" className="h-8 w-8" /> */}
            <span className="font-bold text-xl text-teal-700">Caprae</span>
          </div>
        </div>
      </header>
      <div className="flex">
        <aside className="w-64 bg-white border-r p-4">
          <div className="font-bold text-teal text-lg mb-4">Caprae Platform</div>
          <nav className="space-y-2">
            <Link className="block px-3 py-2 rounded hover:bg-mint/20" href="/dashboard">Dashboard</Link>
            <Link className="block px-3 py-2 rounded hover:bg-mint/20" href="/matches">Matches</Link>
            <Link className="block px-3 py-2 rounded hover:bg-mint/20" href="/deals">Deals</Link>
            <Link className="block px-3 py-2 rounded hover:bg-mint/20" href="/messages">Messages</Link>
            <Link className="block px-3 py-2 rounded hover:bg-mint/20" href="/profile">Profile</Link>
            <Link className="block px-3 py-2 rounded hover:bg-mint/20" href="/settings">Settings</Link>
          </nav>
          {!isLoggedIn && (
            <div className="mt-6 text-sm text-gray-500">
              <div className="mb-2">You are viewing as a guest. Some features may be limited.</div>
              <Link href="/login" className="text-teal-600 underline">Login to access full features</Link>
            </div>
          )}
          {isLoggedIn && (
            <div className="mt-6 text-sm">
              <div className="mb-1 font-medium">Profile Completion</div>
              <div className="w-full bg-gray-100 rounded h-2">
                <div
                  className="bg-teal h-2 rounded"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>
          )}
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
