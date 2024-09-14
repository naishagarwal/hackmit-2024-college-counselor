import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import './RootLayout.css'; // Import the specific CSS for RootLayout

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

export default function RootLayout() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      routerPush={navigate}
      publishableKey={PUBLISHABLE_KEY}
    >
      <header className="header">
        <div className="header-content">
          <p className="logo">LinkUp</p>
          <nav className="navbar">
            <ul className="navbar-list">
              <li><Link to="/">Home</Link></li>
              {/* <li><Link to="/sign-in">Sign In</Link></li> */}
              {/* <li><Link to="/sign-up">Sign Up</Link></li> */}
              <SignedIn>
                <li><Link to="/app">Dashboard</Link></li>
                <li><Link to="/app/uploader">Upload LinkedIn</Link></li>
                <li><Link to="/app/profile">My Profile</Link></li>
                <li><UserButton /></li>
              </SignedIn>
            </ul>
          </nav>
          <SignedOut>
            <Link className="sign-in-button" to="/sign-in">Sign In</Link>
          </SignedOut>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </ClerkProvider>
  );
}
