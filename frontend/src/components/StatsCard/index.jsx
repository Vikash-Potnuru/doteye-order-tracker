import './index.css'

const StatsCard = props => {
  const {title, value, icon: Icon} = props

  return (
    <div className="statsCard">
      <div className="statsCardTop">
        <p>{title}</p>
        {Icon && <Icon size={20} />}
      </div>
      <h2>{value}</h2>
    </div>
  )
}

export default StatsCard
