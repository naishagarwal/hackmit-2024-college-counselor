import { Link } from 'react-router-dom';

export default function IndexPage() {
  return (
    <div className="index-container">
      <h1 className="index-title">Welcome to LinkUp</h1>
      <nav className="index-nav">
        <ul className="index-navbar">
          <li>
            <Link to="/sign-up">Sign Up</Link>
          </li>
          <li>
            <Link to="/sign-in">Sign In</Link>
          </li>
          <li>
            <Link to="/app">Dashboard</Link>
          </li>
          <li>
            <Link to="/app/uploader">Upload LinkedIn</Link>
          </li>
          <li>
            <Link to="/app/profile">My Profile</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
