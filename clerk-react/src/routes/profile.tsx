import { Link } from 'react-router-dom'

export default function ProfilePage() {
  return (
    <>
      <h1>Profile overview page</h1>
      <p>text</p>

      <ul>
        <li>
          <Link to="/">Return to index</Link>
        </li>
      </ul>
    </>
  )
}