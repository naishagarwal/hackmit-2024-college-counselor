import { ConfigProvider as AntDesignProvider } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
//
import design_token from './design-token';
import './RootLayout.scss'; // Import the specific CSS for RootLayout

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
      <AntDesignProvider theme={{ token: design_token }}>
        <header className="header">
          <div className="header-content">
            <p className="logo">LinkApp</p>
            <nav className="navbar">
              <ul className="navbar-list">
                <li><Link to="/app">Home</Link></li>
                <SignedIn>
                  <li><Link to="/app/my-plan">My Plan</Link></li>
                  <li><Link to="/app/uploader">Uploader</Link></li>
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
      </AntDesignProvider>
    </ClerkProvider>
  );
}
