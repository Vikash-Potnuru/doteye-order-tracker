import {Link} from 'react-router-dom'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import EmptyState from '../../components/EmptyState'
import {formatDate} from '../../utils/dateUtils'
import './index.css'

const CustomerDisputes = props => {
  const {currentUser, disputes, logout} = props

  const myDisputes = disputes.filter(
    dispute => dispute.raisedBy === currentUser.id
  )

  return (
    <Layout currentUser={currentUser} logout={logout}>
      <PageHeader
        title="My Disputes"
        description="View and track your dispute cases."
      />

      {myDisputes.length === 0 ? (
        <EmptyState
          title="No disputes found"
          description="You do not have any dispute cases."
        />
      ) : (
        <div className="disputeTableWrapper">
          <table>
            <thead>
              <tr>
                <th>Dispute ID</th>
                <th>Order</th>
                <th>Reason</th>
                <th>Created</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {myDisputes.map(dispute => (
                <tr key={dispute.id}>
                  <td>{dispute.id}</td>
                  <td>{dispute.orderId}</td>
                  <td>{dispute.reasonCategory}</td>
                  <td>{formatDate(dispute.createdAt)}</td>
                  <td>
                    <StatusBadge status={dispute.status} />
                  </td>
                  <td>
                    <Link to={`/customer/disputes/${dispute.id}`}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}

export default CustomerDisputes
