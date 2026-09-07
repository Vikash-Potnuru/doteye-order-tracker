import {useState} from 'react'
import Sidebar from '../Sidebar'
import Navbar from '../Navbar'
import './index.css'

const Layout = props => {
  const {children, currentUser, logout} = props
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="layout">
      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
        currentUser={currentUser}
        logout={logout}
      />

      <div className="mainArea">
        <Navbar
          openSidebar={() => setSidebarOpen(true)}
          currentUser={currentUser}
        />

        <main className="pageContent">{children}</main>
      </div>
    </div>
  )
}

export default Layout
