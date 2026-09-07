import {useState} from 'react'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'
import SearchBar from '../../components/SearchBar'
import OrderCard from '../../components/OrderCard'
import EmptyState from '../../components/EmptyState'
import './index.css'

const CustomerOrders = props => {
  const {currentUser, orders, workflow, logout} = props

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [sort, setSort] = useState('newest')

  const searchValue = search.toLowerCase()

  const myOrders = orders
    .filter(order => order.customerId === currentUser.id)
    .filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchValue)
      const matchesStatus = status === 'All' || order.status === status

      return matchesSearch && matchesStatus
    })
    .sort((firstOrder, secondOrder) => {
      if (sort === 'newest') {
        return new Date(secondOrder.orderDate) - new Date(firstOrder.orderDate)
      }

      return new Date(firstOrder.orderDate) - new Date(secondOrder.orderDate)
    })

  return (
    <Layout currentUser={currentUser} logout={logout}>
      <PageHeader
        title="My Orders"
        description="Track and manage all your orders."
      />

      <div className="orderFilters">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by order ID"
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

        <select
          value={sort}
          onChange={event => setSort(event.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {myOrders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description="Try changing your search or status filter."
        />
      ) : (
        <div className="orderGridPage">
            {myOrders.map(order => (
            <OrderCard key={order.id} order={order} workflow={workflow} />
          ))}
        </div>
      )}
    </Layout>
  )
}

export default CustomerOrders
