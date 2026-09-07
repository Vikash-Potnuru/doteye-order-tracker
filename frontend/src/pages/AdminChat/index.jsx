import {Link, useParams} from 'react-router-dom'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'
import ChatWindow from '../../components/ChatWindow'
import './index.css'

const AdminChat = props => {
  const {orderId} = useParams()
  const {
    currentUser,
    logout,
    orders,
    messages,
    setMessages,
  } = props

  const order = orders.find(item => item.id === orderId)

  if (!order) {
    return (
      <Layout currentUser={currentUser} logout={logout}>
        <p>Order not found.</p>
      </Layout>
    )
  }

  return (
    <Layout currentUser={currentUser} logout={logout}>
      <PageHeader
        title={`Support Chat - ${order.id}`}
        description={`Customer: ${order.customerName}`}
      >
        <Link
          className="adminChatBack"
          to={`/admin/orders/${order.id}`}
        >
          Back to Order
        </Link>
      </PageHeader>

      <ChatWindow
        orderId={order.id}
        currentUser={currentUser}
        messages={messages}
        setMessages={setMessages}
      />
    </Layout>
  )
}

export default AdminChat
