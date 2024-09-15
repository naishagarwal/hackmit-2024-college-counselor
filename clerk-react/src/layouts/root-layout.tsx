import { useEffect } from 'react';
import { ConfigProvider as AntDesignProvider } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
//
import design_token from './design-token';
import { selectCollegePlanFlag, setCollegePlan, setFetchCollegePlanFlag } from '../redux/slices/metadata';
import './RootLayout.css'; // Import the specific CSS for RootLayout
import SimilaritiesApi from '../apis/similarities';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

export default function RootLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fetchCollegePlanFlag = useSelector(selectCollegePlanFlag);

  const similaritiesApi = new SimilaritiesApi();

  useEffect(() => {
    async function fetchCollegePlan() {
      const college_plan = await similaritiesApi.generateCollegePlan({
        name: "Carlos",
        college: "MIT",
        major: "Computer Science",
        query: "Coding"
      });
      console.info("got the college plan", college_plan);
      dispatch(setCollegePlan({ plan: college_plan }));
      dispatch(setFetchCollegePlanFlag({ flag: false }));
    }

    if (fetchCollegePlanFlag) {
      fetchCollegePlan();
    }
  }, [fetchCollegePlanFlag]);

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
