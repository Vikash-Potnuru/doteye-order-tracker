import {useState} from 'react'
import {Link} from 'react-router-dom'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import SearchBar from '../../components/SearchBar'
import {formatDate} from '../../utils/dateUtils'
import './index.css'

const AdminDisputes = props => {
  const {currentUser, logout, disputes, orders, workflow} = props

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')

  const searchValue = search.toLowerCase()

  const filtered = disputes.filter(dispute => {
    const order = orders.find(item => item.id === dispute.orderId)
    const customerName =
      dispute.customer?.name || dispute.customerName || (order ? order.customerName : '')

    const matchesSearch =
      dispute.id.toLowerCase().includes(searchValue) ||
      dispute.orderId.toLowerCase().includes(searchValue) ||
      customerName.toLowerCase().includes(searchValue)

    const matchesStatus =
      status === 'All' || dispute.status === status

    return matchesSearch && matchesStatus
  })

  return (
    <Layout currentUser={currentUser} logout={logout}>
      <PageHeader
        title="Dispute Management"
        description="Review customer disputes and finalise resolutions."
      />

      <div className="disputeFilters">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search dispute, order or customer"
        />

        <select
          value={status}
          onChange={event => setStatus(event.target.value)}
        >
          <option value="All">All Statuses</option>

          {workflow.disputeStatuses.map(item => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <div className="adminDisputeTable">
        <table>
          <thead>
            <tr>
              <th>Dispute</th>
              <th>Order</th>
              <th>Customer</th>
              <th>Reason</th>
              <th>Created</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(dispute => {
              const order = orders.find(
                item => item.id === dispute.orderId
              )

              return (
                <tr key={dispute.id}>
                  <td>{dispute.id}</td>
                  <td>{dispute.orderId}</td>
                  <td>
                    {dispute.customer?.name || dispute.customerName || (order ? order.customerName : '-')}
                  </td>
                  <td>{dispute.reasonCategory}</td>
                  <td>{formatDate(dispute.createdAt)}</td>
                  <td>
                    <StatusBadge status={dispute.status} />
                  </td>
                  <td>
                    <Link to={`/admin/disputes/${dispute.id}`}>
                      Open Portal
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default AdminDisputes
