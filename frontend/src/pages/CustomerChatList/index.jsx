import {Link} from 'react-router-dom'
import {MessageCircle} from 'lucide-react'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import EmptyState from '../../components/EmptyState'
import './index.css'

const CustomerChatList = props => {
  const {currentUser, orders, logout} = props

  const myOrders = orders
    .filter(order => order.customerId === currentUser.id)
    .sort(
      (firstOrder, secondOrder) =>
        new Date(secondOrder.orderDate) - new Date(firstOrder.orderDate)
    )

  return (
    <Layout currentUser={currentUser} logout={logout}>
      <PageHeader
        title="Support Chat"
        description="Choose an order to contact support."
      />

      {myOrders.length === 0 ? (
        <EmptyState
          title="No orders available"
          description="Support chat is available after you place an order."
        />
      ) : (
        <div className="chatOrderList">
          {myOrders.map(order => (
            <div className="chatOrderItem" key={order.id}>
              <div>
                <strong>{order.id}</strong>
                <p>
                  {order.items.length} item(s) ·{' '}
                  {new Date(order.orderDate).toLocaleDateString('en-IN')}
                </p>
              </div>

              <StatusBadge status={order.status} />

              <Link
                className="chatOrderLink"
                to={`/customer/orders/${order.id}/chat`}
              >
                <MessageCircle size={16} />
                Open Chat
              </Link>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}

export default CustomerChatList
