import { Link } from 'react-router-dom'

export default function DashboardPage() {
  return (
    <>
      <h1>Dashboard page</h1>
      <p>text</p>

      <ul>
        <li>
          <Link to="/">Return to index</Link>
        </li>
      </ul>
    </>
  )
}