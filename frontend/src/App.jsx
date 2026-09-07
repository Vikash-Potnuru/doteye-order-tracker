import {Redirect, Route, Switch} from 'react-router-dom'
import {useEffect, useState} from 'react'

import Login from './pages/Login'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import CustomerDashboard from './pages/CustomerDashboard'
import CustomerOrders from './pages/CustomerOrders'
import OrderDetails from './pages/OrderDetails'
import CustomerChat from './pages/CustomerChat'
import CustomerChatList from './pages/CustomerChatList'
import CustomerDispute from './pages/CustomerDispute'
import CustomerDisputes from './pages/CustomerDisputes'
import CustomerDisputeDetails from './pages/CustomerDisputeDetails'
import AdminDashboard from './pages/AdminDashboard'
import AdminOrders from './pages/AdminOrders'
import AdminOrderDetails from './pages/AdminOrderDetails'
import AdminDisputes from './pages/AdminDisputes'
import AdminDisputeDetails from './pages/AdminDisputeDetails'
import AdminChat from './pages/AdminChat'
import ProtectedRoute from './routes/ProtectedRoute'
import {getOrders} from './services/orderService'
import {getDisputes} from './services/disputeService'
import {getAllMessages} from './services/messageService'
import {getOrderMetadata} from './services/orderMetadataService'
import socketService from './services/socketService'
import './App.css'

const getSavedUser = () => {
  try {
    const saved = localStorage.getItem('ordercareUser')
    const token = localStorage.getItem('ordercareToken')
    return saved && token ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

const App = () => {
  const [currentUser, setCurrentUser] = useState(getSavedUser)
  const [orders, setOrders] = useState([])
  const [disputes, setDisputes] = useState([])
  const [messages, setMessages] = useState([])
  const [workflow, setWorkflow] = useState({
    orderStatuses: [],
    statusFlow: {},
    disputeCategories: [],
    disputeStatuses: [],
    activeDisputeStatuses: [],
    disputeEligibleOrderStatuses: [],
  })
  const [notification, setNotification] = useState('')

  const loadData = async user => {
    if (!user) return
    try {
      const [ordersData, disputesData, messagesData, workflowData] = await Promise.all([
        getOrders(),
        getDisputes(),
        user.role === 'Admin' ? getAllMessages() : Promise.resolve([]),
        getOrderMetadata(),
      ])
      setOrders(ordersData)
      setDisputes(disputesData)
      setMessages(messagesData)
      setWorkflow(workflowData)
    } catch (error) {
      showNotification(error.message)
    }
  }

  useEffect(() => {
    if (!currentUser) return undefined
    socketService.connect(localStorage.getItem('ordercareToken'))
    loadData(currentUser)

    const removeOrder = socketService.onOrderUpdate(({order}) => {
      if (!order) return
      setOrders(current => current.map(item => item.id === order.id ? order : item))
    })
    const removeMessage = socketService.onNewMessage(({message}) => {
      if (!message) return
      setMessages(current => current.some(item => item.id === message.id) ? current : [...current, message])
    })
    const removeDispute = socketService.onDisputeUpdate(({dispute}) => {
      if (!dispute) return
      setDisputes(current => {
        const exists = current.some(item => item.id === dispute.id)
        return exists ? current.map(item => item.id === dispute.id ? dispute : item) : [...current, dispute]
      })
    })

    return () => {
      removeOrder?.()
      removeMessage?.()
      removeDispute?.()
    }
  }, [currentUser])

  const login = result => {
    localStorage.setItem('ordercareToken', result.token)
    localStorage.setItem('ordercareUser', JSON.stringify(result.user))
    setCurrentUser(result.user)
    return result.user
  }

  const logout = () => {
    socketService.disconnect()
    localStorage.removeItem('ordercareToken')
    localStorage.removeItem('ordercareUser')
    setCurrentUser(null)
    setOrders([])
    setDisputes([])
    setMessages([])
    setWorkflow({
      orderStatuses: [],
      statusFlow: {},
      disputeCategories: [],
      disputeStatuses: [],
      activeDisputeStatuses: [],
      disputeEligibleOrderStatuses: [],
    })
  }

  const refreshData = async () => loadData(currentUser)

  const showNotification = message => {
    setNotification(message)
    window.clearTimeout(window.__orderCareToast)
    window.__orderCareToast = window.setTimeout(() => setNotification(''), 3500)
  }

  const commonProps = {orders, disputes, messages, workflow, setOrders, setDisputes, setMessages, refreshData, showNotification}

  if (currentUser && !localStorage.getItem('ordercareToken')) return null

  return <>
    <Switch>
      <Route exact path="/login" render={routeProps => <Login {...routeProps} currentUser={currentUser} login={login} />} />
      <ProtectedRoute exact path="/" component={Home} currentUser={currentUser} logout={logout} {...commonProps} />
      <ProtectedRoute exact path="/customer/dashboard" allowedRole="customer" component={CustomerDashboard} currentUser={currentUser} logout={logout} {...commonProps} />
      <ProtectedRoute exact path="/customer/orders" allowedRole="customer" component={CustomerOrders} currentUser={currentUser} logout={logout} {...commonProps} />
      <ProtectedRoute exact path="/customer/orders/:orderId" allowedRole="customer" component={OrderDetails} currentUser={currentUser} logout={logout} {...commonProps} />
      <ProtectedRoute exact path="/customer/chat" allowedRole="customer" component={CustomerChatList} currentUser={currentUser} logout={logout} {...commonProps} />
      <ProtectedRoute exact path="/customer/orders/:orderId/chat" allowedRole="customer" component={CustomerChat} currentUser={currentUser} logout={logout} {...commonProps} />
      <ProtectedRoute exact path="/customer/orders/:orderId/dispute" allowedRole="customer" component={CustomerDispute} currentUser={currentUser} logout={logout} {...commonProps} />
      <ProtectedRoute exact path="/customer/disputes" allowedRole="customer" component={CustomerDisputes} currentUser={currentUser} logout={logout} {...commonProps} />
      <ProtectedRoute exact path="/customer/disputes/:disputeId" allowedRole="customer" component={CustomerDisputeDetails} currentUser={currentUser} logout={logout} {...commonProps} />
      <ProtectedRoute exact path="/admin/dashboard" allowedRole="admin" component={AdminDashboard} currentUser={currentUser} logout={logout} {...commonProps} />
      <ProtectedRoute exact path="/admin/orders" allowedRole="admin" component={AdminOrders} currentUser={currentUser} logout={logout} {...commonProps} />
      <ProtectedRoute exact path="/admin/orders/:orderId" allowedRole="admin" component={AdminOrderDetails} currentUser={currentUser} logout={logout} {...commonProps} />
      <ProtectedRoute exact path="/admin/chat/:orderId" allowedRole="admin" component={AdminChat} currentUser={currentUser} logout={logout} {...commonProps} />
      <ProtectedRoute exact path="/admin/disputes" allowedRole="admin" component={AdminDisputes} currentUser={currentUser} logout={logout} {...commonProps} />
      <ProtectedRoute exact path="/admin/disputes/:disputeId" allowedRole="admin" component={AdminDisputeDetails} currentUser={currentUser} logout={logout} {...commonProps} />
      <Route path="/not-found" component={NotFound} />
      <Redirect to={currentUser ? '/' : '/login'} />
    </Switch>
    {notification && <div className="globalToast">{notification}</div>}
  </>
}

export default App
