import './index.css'

const EmptyState = props => {
  const {title, description} = props

  return (
    <div className="emptyState">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export default EmptyState
