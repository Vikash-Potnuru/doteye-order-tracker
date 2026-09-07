import {Link, useParams} from 'react-router-dom'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'
import ChatWindow from '../../components/ChatWindow'

const CustomerChat = props => {
  const {orderId} = useParams()
  const {currentUser, orders, messages, setMessages, logout} = props

  const order = orders.find(item => item.id === orderId)

  if (!order || order.customerId !== currentUser.id) {
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
        description="This conversation is permanently linked to this order."
      >
        <Link
          className="chatBackLink"
          to={`/customer/orders/${order.id}`}
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

export default CustomerChat
