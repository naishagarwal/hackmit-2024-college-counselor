import { Link } from 'react-router-dom'

export default function IndexPage() {
  return (
    <div>
      <h1>This is the index page</h1>
      <div>
        <ul>
          <li>
            <Link to="/sign-up">Sign Up</Link>
          </li>
          <li>
            <Link to="/sign-in">Sign In</Link>
          </li>
          <li>
            <Link to="/app">App</Link>
          </li>
          <li>
            <Link to="/app/uploader">Uploader (linkedin)</Link>
          </li>
          <li>
            <Link to="/app/profile">My profile</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}