import './index.css'

const StatusBadge = props => {
  const {status} = props

  return (
    <span className={`statusBadge status-${status.toLowerCase().replaceAll(' ', '-').replaceAll('(', '').replaceAll(')', '')}`}>
      {status}
    </span>
  )
}

export default StatusBadge
