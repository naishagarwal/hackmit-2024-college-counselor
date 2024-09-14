import { Link } from 'react-router-dom'

export default function DashboardPage() {
  return (
    <>
      <h1>Dashboard</h1>
      <p>Your Plan</p>

      <ul>
        <li>
          <Link to="/">Return to Home</Link>
        </li>
      </ul>
    </>
  )
}