import {Link, useParams} from 'react-router-dom'
import {useEffect} from 'react'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import OrderItemList from '../../components/OrderItemList'
import OrderTimeline from '../../components/OrderTimeline'
import socketService from '../../services/socketService'
import './index.css'

const AdminOrderDetails = props => {
  const {orderId} = useParams()
  const {currentUser, logout, orders} = props

  const order = orders.find(item => item.id === orderId)

  useEffect(() => {
    if (!order) return undefined
    socketService.joinOrderRoom(orderId)
    return () => socketService.leaveOrderRoom(orderId)
  }, [orderId, order?.id])

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
        title={`Admin View - ${order.id}`}
        description="Inspect complete order information and audit history."
      >
        <Link className="adminBackLink" to="/admin/orders">
          Back to Orders
        </Link>
      </PageHeader>

      <div className="adminOrderSummary">
        <div>
          <span>Customer</span>
          <strong>{order.customerName}</strong>
        </div>

        <div>
          <span>Date</span>
          <strong>
            {new Date(order.orderDate).toLocaleString('en-IN')}
          </strong>
        </div>

        <div>
          <span>Total</span>
          <strong>
            ₹{order.totalAmount.toLocaleString('en-IN')}
          </strong>
        </div>

        <div>
          <span>Status</span>
          <StatusBadge status={order.status} />
        </div>
      </div>

      <section className="adminOrderCard">
        <h2>Items</h2>
        <OrderItemList items={order.items} />
      </section>

      <section className="adminOrderCard">
        <h2>Audit Timeline</h2>
        <OrderTimeline timeline={order.timelineHistory} />
      </section>
    </Layout>
  )
}

export default AdminOrderDetails
