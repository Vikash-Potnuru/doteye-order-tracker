import {MessageCircle, Eye, AlertTriangle} from 'lucide-react'
import {Link} from 'react-router-dom'
import StatusBadge from '../StatusBadge'
import './index.css'

const OrderCard = props => {
  const {order, workflow, basePath = '/customer/orders'} = props

  return (
    <div className="orderCard">
      <div className="orderCardTop">
        <div>
          <p className="orderId">{order.id}</p>
          <p className="orderDate">
            {new Date(order.orderDate).toLocaleDateString('en-IN')}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="orderCardInfo">
        <p>{order.items.length} item(s)</p>
        <h3>₹{order.totalAmount.toLocaleString('en-IN')}</h3>
      </div>

      <div className="orderCardActions">
        <Link to={`${basePath}/${order.id}`} className="outlineButton">
          <Eye size={16} /> View
        </Link>

        <Link to={`/customer/orders/${order.id}/chat`} className="outlineButton">
          <MessageCircle size={16} /> Chat
        </Link>

        {workflow.disputeEligibleOrderStatuses.includes(order.status) && (
          <Link
            to={`/customer/orders/${order.id}/dispute`}
            className="outlineButton dangerButton"
          >
            <AlertTriangle size={16} /> Dispute
          </Link>
        )}
      </div>
    </div>
  )
}

export default OrderCard
