import {Redirect, useHistory} from 'react-router-dom'
import {useState} from 'react'
import {Eye, EyeOff, LogIn, UserPlus} from 'lucide-react'
import {loginUser, registerUser} from '../../services/authService'
import './index.css'

const Login = ({currentUser, login}) => {
  const history = useHistory()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (currentUser) return <Redirect to={currentUser.role === 'Admin' ? '/admin/dashboard' : '/customer/dashboard'} />

  const submit = async event => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = mode === 'login'
        ? await loginUser(email, password)
        : await registerUser(name, email, password)
      login(result)
      history.replace(result.user.role === 'Admin' ? '/admin/dashboard' : '/customer/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="loginPage">
      <div className="loginBox">
        <div className="loginLogo">
        <img src='https://doteyelabs.com/_next/static/media/logo.b3231902.png' alt='logo' className='loginLogoImg' />  
        </div>
        <h1>{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
        <p>Order tracking, support and dispute management</p>
        <form onSubmit={submit}>
          {mode === 'register' && <input required value={name} onChange={e => setName(e.target.value)} placeholder="Full name" />}
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" />
          <div className="passwordField">
            <input
              required
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button
              type="button"
              className="passwordToggle"
              onClick={() => setShowPassword(current => !current)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && <div className="loginError">{error}</div>}
          <button className="loginSubmit" disabled={loading} type="submit">
            {mode === 'login' ? <LogIn size={18}/> : <UserPlus size={18}/>} {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
        <button className="modeButton" type="button" onClick={() => {setMode(mode === 'login' ? 'register' : 'login'); setError('')}}>
          {mode === 'login' ? 'New customer? Create an account' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
export default Login
