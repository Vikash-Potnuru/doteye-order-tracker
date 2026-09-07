import {Link, useHistory, useParams} from 'react-router-dom'
import {useEffect} from 'react'
import {
  MessageCircle,
  AlertTriangle,
  ArrowLeft,
  XCircle,
} from 'lucide-react'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import OrderItemList from '../../components/OrderItemList'
import OrderTimeline from '../../components/OrderTimeline'
import {
  canRaiseDispute,
  isActiveDispute,
} from '../../constants/statuses'
import {cancelOrder} from '../../services/orderService'
import socketService from '../../services/socketService'
import './index.css'

const OrderDetails = props => {
  const {orderId} = useParams()
  const history = useHistory()

  const {
    currentUser,
    orders,
    refreshData,
    showNotification,
    logout,
    workflow,
  } = props

  const order = orders.find(item => item.id === orderId)

  const canCancel = ['Placed', 'Processing'].includes(order?.status)

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return

    try {
      await cancelOrder(order.id, 'Order cancelled by customer.')
      await refreshData()
      showNotification('Order cancelled successfully.')
    } catch (error) {
      showNotification(error.message)
    }
  }

  useEffect(() => {
    if (!order) return undefined
    socketService.joinOrderRoom(orderId)
    return () => socketService.leaveOrderRoom(orderId)
  }, [orderId, order?.id])

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
        title={`Order ${order.id}`}
        description="View order details, timeline and support options."
      >
        <button
          className="backButton"
          onClick={() => history.goBack()}
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </PageHeader>

      {isActiveDispute(workflow, order.status) && (
        <div className="warningBanner">
          <AlertTriangle size={18} />
          This order has an active dispute. Normal status progression is locked.
        </div>
      )}

      <div className="detailsGrid">
        <section className="detailsCard">
          <div className="cardTitle">
            <h2>Order Summary</h2>
            <StatusBadge status={order.status} />
          </div>

          <div className="summaryGrid">
            <div>
              <span>Order ID</span>
              <strong>{order.id}</strong>
            </div>

            <div>
              <span>Customer</span>
              <strong>{order.customerName}</strong>
            </div>

            <div>
              <span>Order Date</span>
              <strong>
                {new Date(order.orderDate).toLocaleString('en-IN')}
              </strong>
            </div>

            <div>
              <span>Total Amount</span>
              <strong>
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </strong>
            </div>
          </div>
        </section>

        <section className="detailsCard">
          <div className="cardTitle">
            <h2>Actions</h2>
          </div>

          <div className="detailActions">
            <Link
              to={`/customer/orders/${order.id}/chat`}
              className="primaryLink"
            >
              <MessageCircle size={16} />
              Open Support Chat
            </Link>

            {canRaiseDispute(workflow, order.status) && (
              <Link
                to={`/customer/orders/${order.id}/dispute`}
                className="dangerLink"
              >
                <AlertTriangle size={16} />
                Raise Dispute
              </Link>
            )}

            {canCancel && (
              <button className="dangerLink" onClick={handleCancel}>
                <XCircle size={16} />
                Cancel Order
              </button>
            )}
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default OrderDetails
