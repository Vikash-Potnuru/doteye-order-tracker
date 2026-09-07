import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="notFoundPage">
    <div>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/login">Go to Login</Link>
    </div>
  </div>
)

export default NotFound
