import {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import ChatWindow from '../../components/ChatWindow'
import {updateDisputeStatus} from '../../services/disputeService'
import {getOrderById} from '../../services/orderService'
import {formatDate} from '../../utils/dateUtils'
import {isActiveDispute} from '../../constants/statuses'
import './index.css'

const AdminDisputeDetails = props => {
  const {disputeId} = useParams()

  const {
    currentUser,
    logout,
    disputes,
    orders,
    messages,
    setMessages,
    refreshData,
    showNotification,
    workflow,
  } = props

  const dispute = disputes.find(item => item.id === disputeId)

  const [orderDetails, setOrderDetails] = useState(null)
  const [isLoadingOrder, setIsLoadingOrder] = useState(false)

  useEffect(() => {
    if (!dispute) {
      return undefined
    }

    const existingOrder = orders.find(
      item => item.id === dispute.orderId
    )

    if (existingOrder) {
      setOrderDetails(existingOrder)
      return undefined
    }

    let isMounted = true

    setIsLoadingOrder(true)

    getOrderById(dispute.orderId)
      .then(orderData => {
        if (isMounted) {
          setOrderDetails(orderData)
        }
      })
      .catch(() => {
        if (isMounted) {
          setOrderDetails(null)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingOrder(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [dispute, orders])

  const order = orderDetails

  const [notes, setNotes] = useState(
    dispute ? dispute.adminResolutionNotes : ''
  )

  if (!dispute || isLoadingOrder) {
    return (
      <Layout currentUser={currentUser} logout={logout}>
        <p>
          {dispute
            ? 'Loading dispute details...'
            : 'Dispute not found.'}
        </p>
      </Layout>
    )
  }

  if (!order) {
    return (
      <Layout currentUser={currentUser} logout={logout}>
        <p>Unable to load the parent order for this dispute.</p>
      </Layout>
    )
  }

  const moveToReview = async () => {
    try {
      await updateDisputeStatus(
        dispute.id,
        'Under Review',
        notes.trim()
      )

      await refreshData()
      showNotification('Dispute moved to Under Review.')
    } catch (error) {
      showNotification(error.message)
    }
  }

  const resolve = async status => {
    try {
      await updateDisputeStatus(dispute.id, status, notes.trim())

      await refreshData()
      showNotification(`Dispute resolved as ${status}.`)
    } catch (error) {
      showNotification(error.message)
    }
  }

  return (
    <Layout currentUser={currentUser} logout={logout}>
      <PageHeader
        title={`Dispute Resolution Portal - ${dispute.id}`}
        description="Review customer information, order details, chat and resolution."
      >
        <Link className="backLink" to="/admin/disputes">
          Back to Disputes
        </Link>
      </PageHeader>

      <div className="resolutionGrid">
        <section className="resolutionPanel">
          <h2>Dispute Details</h2>

          <p>
            <span>Dispute ID</span>
            <strong>{dispute.id}</strong>
          </p>

          <p>
            <span>Order ID</span>
            <strong>{dispute.orderId}</strong>
          </p>

          <p>
            <span>Customer</span>
            <strong>{order.customerName}</strong>
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
            <span>Status</span>
            <StatusBadge status={dispute.status} />
          </p>

          <h3>Customer Explanation</h3>
          <div className="customerExplanation">
            {dispute.description}
          </div>
        </section>

        <section className="resolutionPanel">
          <h2>Administrative Notes</h2>

          <textarea
            rows="8"
            value={notes}
            maxLength={1000}
            onChange={event => setNotes(event.target.value)}
            placeholder="Add official administrative notes..."
          />

          <div className="resolutionButtons">
            {dispute.status === 'Open' && (
              <button onClick={moveToReview}>
                Move to Under Review
              </button>
            )}

            {dispute.status === 'Under Review' && (
              <>
                <button
                  onClick={() => resolve('Resolved (Refunded)')}
                >
                  Resolve as Refunded
                </button>

                <button
                  className="rejectButton"
                  onClick={() => resolve('Resolved (Rejected)')}
                >
                  Resolve as Rejected
                </button>
              </>
            )}
          </div>

          {isActiveDispute(workflow, dispute.status) && (
            <p className="lockNote">
              The parent order remains Disputed while this case is active.
            </p>
          )}
        </section>
      </div>

      <section className="resolutionPanel">
        <div className="panelHeader">
          <h2>Associated Chat Logs</h2>

          <Link to={`/admin/chat/${order.id}`}>
            Open Full Chat
          </Link>
        </div>

        <ChatWindow
          orderId={order.id}
          currentUser={currentUser}
          messages={messages}
          setMessages={setMessages}
        />
      </section>
    </Layout>
  )
}

export default AdminDisputeDetails
