import {useState} from 'react'
import {Link} from 'react-router-dom'
import {Eye, MessageCircle, AlertTriangle, XCircle} from 'lucide-react'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'
import SearchBar from '../../components/SearchBar'
import StatusBadge from '../../components/StatusBadge'
import {getNextStatuses} from '../../constants/statuses'
import {cancelOrder, updateOrderStatus} from '../../services/orderService'
import './index.css'

const AdminOrders = props => {
  const {
    currentUser,
    logout,
    orders,
    disputes,
    workflow,
    refreshData,
    showNotification,
  } = props

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [pendingAction, setPendingAction] = useState(null)

  const searchValue = search.toLowerCase()

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchValue) ||
      order.customerName.toLowerCase().includes(searchValue)

    const matchesStatus =
      status === 'All' || order.status === status

    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async order => {
    const nextStatus = getNextStatuses(workflow, order.status)[0]

    if (!nextStatus) {
      showNotification('No valid status transition is available.')
      return
    }

    setPendingAction({type: 'status', order, nextStatus})
  }

  const handleCancel = order => {
    setPendingAction({type: 'cancel', order})
  }

  const confirmPendingAction = async () => {
    if (!pendingAction) return

    const {type, order, nextStatus} = pendingAction
    setPendingAction(null)

    try {
      if (type === 'status') {
        await updateOrderStatus(order.id, nextStatus, `Order status changed to ${nextStatus}.`)
        await refreshData()
        showNotification(`${order.id} changed to ${nextStatus}.`)
      } else {
        await cancelOrder(order.id, 'Order cancelled by admin.')
        await refreshData()
        showNotification(`${order.id} cancelled.`)
      }
    } catch (error) {
      showNotification(error.message)
    }
  }

  const getDispute = orderId =>
    disputes.find(dispute => dispute.orderId === orderId)

  return (
    <Layout currentUser={currentUser} logout={logout}>
      <PageHeader
        title="Order Management"
        description="Manage all customer orders and valid status transitions."
      />

      <div className="adminFilters">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search order or customer"
        />

        <select
          value={status}
          onChange={event => setStatus(event.target.value)}
        >
          <option value="All">All Statuses</option>

          {workflow.orderStatuses.map(item => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <div className="orderTableWrapper">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Dispute</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map(order => {
              const dispute = getDispute(order.id)

              return (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>
                    {new Date(order.orderDate).toLocaleDateString('en-IN')}
                  </td>
                  <td>
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td>
                    {dispute ? (
                      <StatusBadge status={dispute.status} />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <div className="tableActions">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        title="View"
                      >
                        <Eye size={16} />
                      </Link>

                      <button
                        onClick={() => handleStatusChange(order)}
                        title="Update Status"
                      >
                        <AlertTriangle size={16} />
                      </button>

                      {['Placed', 'Processing'].includes(order.status) && (
                        <button
                          onClick={() => handleCancel(order)}
                          title="Cancel Order"
                        >
                          <XCircle size={16} />
                        </button>
                      )}

                      <Link
                        to={`/admin/chat/${order.id}`}
                        title="Open Chat"
                      >
                        <MessageCircle size={16} />
                      </Link>

                      {dispute && (
                        <Link
                          to={`/admin/disputes/${dispute.id}`}
                          title="View Dispute"
                        >
                          Dispute
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

        {pendingAction && (
          <div className="confirmationOverlay" role="presentation">
            <div
              className="confirmationModal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirmation-title"
            >
              <h2 id="confirmation-title">Confirm order action</h2>
              <p>
                {pendingAction.type === 'status'
                  ? `Change ${pendingAction.order.id} from ${pendingAction.order.status} to ${pendingAction.nextStatus}?`
                  : `Cancel ${pendingAction.order.id}?`}
              </p>
              <div className="confirmationActions">
                <button
                  className="confirmationCancel"
                  onClick={() => setPendingAction(null)}
                >
                  Cancel
                </button>
                <button className="confirmationConfirm" onClick={confirmPendingAction}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
    </Layout>
  )
}

export default AdminOrders
