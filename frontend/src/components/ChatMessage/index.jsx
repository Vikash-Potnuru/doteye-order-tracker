import {formatDate} from '../../utils/dateUtils'
import './index.css'

const ChatMessage = props => {
  const {message, currentUserId} = props

  if (message.isSystemMessage) {
    return (
      <div className="systemMessage">
        <p>{message.content}</p>
        <span>{formatDate(message.timestamp)}</span>
      </div>
    )
  }

  const isMine = message.senderId === currentUserId

  return (
    <div className={`chatMessage ${isMine ? 'myMessage' : 'otherMessage'}`}>
      <div className="messageBubble">
        <small>{message.senderName}</small>
        <p>{message.content}</p>
        <span>
          {formatDate(message.timestamp)} {isMine && (message.isRead ? '✓✓' : '✓')}
        </span>
      </div>
    </div>
  )
}

export default ChatMessage
