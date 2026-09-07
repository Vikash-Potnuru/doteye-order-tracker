import {NavLink, useHistory} from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingBag,
  MessageCircle,
  AlertTriangle,
  LogOut,
  X,
} from 'lucide-react'
import './index.css'

const Sidebar = props => {
  const {isOpen, closeSidebar, currentUser, logout} = props
  const history = useHistory()
  const isAdmin = currentUser.role === 'Admin'

  const handleLogout = () => {
    logout()
    history.push('/login')
  }

  return (
    <aside className={`sidebar ${isOpen ? 'sidebarOpen' : ''}`}>
      <img
        src="https://doteyelabs.com/_next/static/media/logo.b3231902.png"
        alt="DotEye Logo"
        className="sidebarLogoImg"
      />

      <div className="sidebarLogo">
        <div>
          <p className="sidebarLogoText">
            {isAdmin ? 'Admin Portal' : 'Customer Portal'}
          </p>
        </div>

        <button className="closeSidebar" onClick={closeSidebar}>
          <X size={20} />
        </button>
      </div>

      <nav>
        <NavLink
          exact
          to={isAdmin ? '/admin/dashboard' : '/customer/dashboard'}
          activeClassName="activeNav"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to={isAdmin ? '/admin/orders' : '/customer/orders'}
          activeClassName="activeNav"
        >
          <ShoppingBag size={18} />
          Orders
        </NavLink>

        <NavLink
          to={isAdmin ? '/admin/disputes' : '/customer/disputes'}
          activeClassName="activeNav"
        >
          <AlertTriangle size={18} />
          Disputes
        </NavLink>

        {!isAdmin && (
          <NavLink to="/customer/chat" activeClassName="activeNav">
            <MessageCircle size={18} />
            Support Chat
          </NavLink>
        )}
      </nav>

      <button className="logoutButton" onClick={handleLogout}>
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  )
}

export default Sidebar
