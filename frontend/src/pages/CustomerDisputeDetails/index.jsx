import {Link, useParams} from 'react-router-dom'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import OrderTimeline from '../../components/OrderTimeline'
import {formatDate} from '../../utils/dateUtils'
import './index.css'

const CustomerDisputeDetails = props => {
  const {disputeId} = useParams()
  const {currentUser, disputes, orders, logout} = props

  const dispute = disputes.find(item => item.id === disputeId)

  const order = dispute
    ? orders.find(item => item.id === dispute.orderId)
    : null

  if (!dispute || dispute.raisedBy !== currentUser.id) {
    return (
      <Layout currentUser={currentUser} logout={logout}>
        <p>Dispute not found.</p>
      </Layout>
    )
  }

  return (
    <Layout currentUser={currentUser} logout={logout}>
      <PageHeader
        title={`Dispute ${dispute.id}`}
        description="Track your dispute resolution."
      />

      <div className="disputeDetailGrid">
        <section className="detailPanel">
          <h2>Dispute Details</h2>

          <div className="detailRows">
            <p>
              <span>Dispute ID</span>
              <strong>{dispute.id}</strong>
            </p>

            <p>
              <span>Order ID</span>
              <strong>{dispute.orderId}</strong>
            </p>

            <p>
              <span>Reason</span>
              <strong>{dispute.reasonCategory}</strong>
            </p>

            <p>
              <span>Created</span>
              <strong>{formatDate(dispute.createdAt)}</strong>
            </p>

            <p>
              <span>Updated</span>
              <strong>{formatDate(dispute.updatedAt)}</strong>
            </p>

            <p>
              <span>Status</span>
              <StatusBadge status={dispute.status} />
            </p>
          </div>

          <h3>Description</h3>
          <p className="description">{dispute.description}</p>
        </section>

        <section className="detailPanel">
          <h2>Resolution Information</h2>

          <p className="resolutionNotes">
            {dispute.adminResolutionNotes ||
              'No admin resolution notes yet.'}
          </p>

          <Link
            className="chatLink"
            to={`/customer/orders/${dispute.orderId}/chat`}
          >
            Open Related Chat
          </Link>

          {order && (
            <Link
              className="orderLink"
              to={`/customer/orders/${order.id}`}
            >
              View Order
            </Link>
          )}
        </section>
      </div>

      <section className="detailPanel">
        <h2>Order Audit Timeline</h2>
        {order && <OrderTimeline timeline={order.timelineHistory} />}
      </section>
    </Layout>
  )
}

export default CustomerDisputeDetails
