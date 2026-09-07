import {Link, useHistory, useParams} from 'react-router-dom'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'
import DisputeForm from '../../components/DisputeForm'
import {canRaiseDispute} from '../../constants/statuses'
import {createDispute} from '../../services/disputeService'
import './index.css'

const CustomerDispute = props => {
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

  if (!order || order.customerId !== currentUser.id) {
    return (
      <Layout currentUser={currentUser} logout={logout}>
        <p>Order not found.</p>
      </Layout>
    )
  }

  if (!canRaiseDispute(workflow, order.status)) {
    return (
      <Layout currentUser={currentUser} logout={logout}>
        <div className="notEligible">
          <h2>Dispute is not available</h2>
          <p>
            A dispute can only be raised for Shipped or Delivered orders.
          </p>
          <Link to={`/customer/orders/${order.id}`}>
            Back to Order
          </Link>
        </div>
      </Layout>
    )
  }

  const handleSubmit = async data => {
    try {
      const dispute = await createDispute({
        ...data,
        raisedBy: currentUser.id,
      })

      await refreshData()
      showNotification('Dispute created successfully.')
      history.push(`/customer/disputes/${dispute.id}`)
    } catch (error) {
      showNotification(error.message)
    }
  }

  return (
    <Layout currentUser={currentUser} logout={logout}>
      <PageHeader
        title="Raise a Dispute"
        description={`Create a dispute for order ${order.id}.`}
      />

      <DisputeForm
        orderId={order.id}
        workflow={workflow}
        onSubmit={handleSubmit}
        onCancel={() => history.push(`/customer/orders/${order.id}`)}
      />
    </Layout>
  )
}

export default CustomerDispute
