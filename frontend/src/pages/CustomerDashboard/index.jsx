import {Link} from 'react-router-dom'
import {
  ShoppingBag,
  Clock3,
  Truck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import Layout from '../../components/Layout'
import StatsCard from '../../components/StatsCard'
import PageHeader from '../../components/PageHeader'
import OrderCard from '../../components/OrderCard'
import {formatDate} from '../../utils/dateUtils'
import './index.css'

const CustomerDashboard = props => {
  const {currentUser, orders, disputes, workflow, logout} = props

  const myOrders = orders.filter(
    order => order.customerId === currentUser.id
  )

  const myDisputes = disputes.filter(
    dispute => dispute.raisedBy === currentUser.id
  )

  const recentOrders = [...myOrders].sort(
    (firstOrder, secondOrder) =>
      new Date(secondOrder.orderDate) - new Date(firstOrder.orderDate)
  )

  const count = status =>
    myOrders.filter(order => order.status === status).length

  const activeDisputes = myDisputes.filter(dispute =>
    workflow.activeDisputeStatuses.includes(dispute.status)
  )

  return (
    <Layout currentUser={currentUser} logout={logout}>
      <PageHeader
        title="Customer Dashboard"
        description={`Welcome back, ${currentUser.name}.`}
      />

      <div className="statsGrid">
        <StatsCard
          title="Total Orders"
          value={myOrders.length}
          icon={ShoppingBag}
        />

        <StatsCard
          title="Processing Orders"
          value={count('Processing')}
          icon={Clock3}
        />

        <StatsCard
          title="Shipped Orders"
          value={count('Shipped')}
          icon={Truck}
        />

        <StatsCard
          title="Delivered Orders"
          value={count('Delivered')}
          icon={CheckCircle2}
        />

        <StatsCard
          title="Active Disputes"
          value={activeDisputes.length}
          icon={AlertTriangle}
        />
      </div>

      <div className="dashboardSection">
        <div className="sectionHeader">
          <h2>Recent Orders</h2>
          <Link to="/customer/orders">View all</Link>
        </div>

        <div className="orderGrid">
          {recentOrders.map(order => (
            <OrderCard key={order.id} order={order} workflow={workflow} />
          ))}
        </div>
      </div>

      <div className="dashboardSection activitySection">
        <div className="sectionHeader">
          <h2>Recent Activity</h2>
        </div>

        <div className="activityList">
          {recentOrders.map(order => {
            const lastEvent =
              order.timelineHistory[order.timelineHistory.length - 1]

            return (
              <div className="activityItem" key={order.id}>
                <div>
                  <strong>{order.id}</strong>
                  <p>Current status: {order.status}</p>
                </div>

                <span>{formatDate(lastEvent.timestamp)}</span>
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}

export default CustomerDashboard
