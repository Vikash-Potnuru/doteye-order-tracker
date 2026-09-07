import {useEffect, useState} from 'react'
import {Menu, Bell, Moon, Sun} from 'lucide-react'
import './index.css'

const Navbar = props => {
  const {openSidebar, currentUser} = props
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem('ordercareTheme') === 'dark'
  )

  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light'
    document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light'
    localStorage.setItem('ordercareTheme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const toggleTheme = () => setIsDarkMode(currentMode => !currentMode)

  return (
    <header className="navbar">
      <button className="menuButton" onClick={openSidebar}>
        <Menu size={22} />
      </button>

      <div className="navbarUser">
        <button
          className="themeButton"
          type="button"
          onClick={toggleTheme}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="notificationButton">
          <Bell size={19} />
          <span></span>
        </button>

        <div>
          <strong>{currentUser.name}</strong>
          <small>{currentUser.role}</small>
        </div>
      </div>
    </header>
  )
}

export default Navbar
