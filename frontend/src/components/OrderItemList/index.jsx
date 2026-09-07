import './index.css'

const OrderItemList = props => {
  const {items} = props

  return (
    <div className="orderItemList">
      {items.map(item => (
        <div className="orderItem" key={item.id}>
          <div>
            <h3>{item.name}</h3>
            <p>Quantity: {item.quantity}</p>
          </div>
          <p>₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
        </div>
      ))}
    </div>
  )
}

export default OrderItemList
