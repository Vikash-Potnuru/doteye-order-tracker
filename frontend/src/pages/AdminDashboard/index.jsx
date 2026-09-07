import {Link} from 'react-router-dom'
import {
  ShoppingBag,
  Clock3,
  Truck,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
} from 'lucide-react'
import Layout from '../../components/Layout'
import StatsCard from '../../components/StatsCard'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import {formatDate} from '../../utils/dateUtils'
import './index.css'

const AdminDashboard = props => {
  const {currentUser, logout, orders, disputes, messages} = props

  const count = status =>
    orders.filter(order => order.status === status).length

  const activeDisputes = disputes.filter(
    dispute =>
      dispute.status === 'Open' || dispute.status === 'Under Review'
  )

  return (
    <Layout currentUser={currentUser} logout={logout}>
      <PageHeader
        title="Admin Dashboard"
        description="Monitor post-purchase operations."
      />

      <div className="adminStats">
        <StatsCard
          title="Total Orders"
          value={orders.length}
          icon={ShoppingBag}
        />

        <StatsCard
          title="Pending Orders"
          value={count('Placed') + count('Processing')}
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

        <StatsCard
          title="Open Disputes"
          value={disputes.filter(d => d.status === 'Open').length}
          icon={MessageCircle}
        />
      </div>

      <div className="adminDashboardGrid">
        <section className="adminPanel">
          <div className="panelHeader">
            <h2>Recent Orders</h2>
            <Link to="/admin/orders">View all</Link>
          </div>

          {orders.slice(0, 5).map(order => (
            <div className="adminListItem" key={order.id}>
              <div>
                <strong>{order.id}</strong>
                <p>{order.customerName}</p>
              </div>

              <StatusBadge status={order.status} />
            </div>
          ))}
        </section>

        <section className="adminPanel">
          <div className="panelHeader">
            <h2>Recent Disputes</h2>
            <Link to="/admin/disputes">View all</Link>
          </div>

          {disputes.slice(0, 5).map(dispute => (
            <div className="adminListItem" key={dispute.id}>
              <div>
                <strong>{dispute.id}</strong>
                <p>{dispute.reasonCategory}</p>
              </div>

              <StatusBadge status={dispute.status} />
            </div>
          ))}
        </section>
      </div>

      <section className="adminPanel">
        <div className="panelHeader">
          <h2>Recent Support Messages</h2>
        </div>

        {messages
          .slice(-6)
          .reverse()
          .map(message => (
            <div className="adminListItem" key={message.id}>
              <div>
                <strong>{message.orderId}</strong>
                <p>{message.content}</p>
              </div>

              <span className="messageTime">
                {formatDate(message.timestamp)}
              </span>
            </div>
          ))}
      </section>
    </Layout>
  )
}

export default AdminDashboard
