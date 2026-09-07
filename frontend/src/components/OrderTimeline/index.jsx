import {CheckCircle2, Circle} from 'lucide-react'
import {formatDate} from '../../utils/dateUtils'
import './index.css'

const OrderTimeline = props => {
  const {timeline} = props

  return (
    <div className="orderTimeline">
      {timeline.map((event, index) => (
        <div className="timelineItem" key={event.id || `${event.status}-${index}`}>
          <div className="timelineIcon">
            {index === timeline.length - 1 ? (
              <CheckCircle2 size={20} />
            ) : (
              <Circle size={18} />
            )}
          </div>
          <div className="timelineContent">
            <div className="timelineTop">
              <h3>{event.status}</h3>
              <span>{formatDate(event.timestamp)}</span>
            </div>
            <p>{event.note}</p>
            <small>Updated by: {event.updatedBy}</small>
          </div>
        </div>
      ))}
    </div>
  )
}

export default OrderTimeline
