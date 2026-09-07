import {useEffect, useRef, useState} from 'react'
import {Send, Circle} from 'lucide-react'
import ChatMessage from '../ChatMessage'
import TypingIndicator from '../TypingIndicator'
import {getMessages, markMessagesAsRead, sendMessage} from '../../services/messageService'
import socketService from '../../services/socketService'
import './index.css'

const ChatWindow = ({orderId, currentUser, messages, setMessages}) => {
  const [text, setText] = useState('')
  const [typingUser, setTypingUser] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)
  const typingTimer = useRef(null)

  useEffect(() => {
    let active = true
    const loadConversation = async () => {
      try {
        const items = await getMessages(orderId)
        if (active) {
          setMessages(current => [
            ...current.filter(message => message.orderId !== orderId),
            ...items,
          ])
        }
      } catch {
      } finally {
        if (active) setLoading(false)
      }
    }

    setLoading(true)
    loadConversation()

    socketService.joinOrderRoom(orderId)
    const removeMessage = socketService.onNewMessage(({message}) => {
      if (!message || message.orderId !== orderId) return
      setMessages(current => current.some(item => item.id === message.id) ? current : [...current, message])
    })
    const removeTypingStart = socketService.onTypingStart(data => {
      if (data.orderId === orderId && data.userId !== currentUser.id) setTypingUser(data.userName || 'Support')
    })
    const removeTypingStop = socketService.onTypingStop(data => {
      if (data.orderId === orderId) setTypingUser('')
    })

    const markConversationAsRead = async () => {
      try {
        await markMessagesAsRead(orderId)
        if (active) {
          setMessages(current => current.map(item => item.orderId === orderId ? {...item, isRead: true} : item))
        }
      } catch {
      }
    }

    markConversationAsRead()

    return () => {
      active = false
      socketService.leaveOrderRoom(orderId)
      removeMessage?.()
      removeTypingStart?.()
      removeTypingStop?.()
      window.clearTimeout(typingTimer.current)
    }
  }, [orderId, currentUser.id, setMessages])

  const orderMessages = messages.filter(message => message.orderId === orderId).sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp))

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: 'smooth'})
  }, [orderMessages.length, typingUser])

  const handleTyping = event => {
    setText(event.target.value)
    socketService.sendTypingStart(orderId)
    window.clearTimeout(typingTimer.current)
    typingTimer.current = window.setTimeout(() => socketService.sendTypingStop(orderId), 700)
  }

  const handleSend = async event => {
    event.preventDefault()
    const content = text.trim()
    if (!content || sending) return
    setSending(true)
    try {
      const newMessage = await sendMessage(orderId, content)
      setMessages(current => current.some(item => item.id === newMessage.id) ? current : [...current, newMessage])
      setText('')
      socketService.sendTypingStop(orderId)
    } catch (error) {
      window.alert(error.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="chatWindow">
      <div className="chatHeader">
        <div>
          <h2>Order #{orderId}</h2>
          <p><Circle size={8} fill="currentColor" /> Real-time Support Chat</p>
        </div>
      </div>
      <div className="chatMessages">
        {loading ? <p className="noMessages">Loading conversation...</p> : orderMessages.length === 0 ? <p className="noMessages">No messages yet. Start a conversation with support.</p> : orderMessages.map(message => <ChatMessage key={message.id} message={message} currentUserId={currentUser.id} />)}
        {typingUser && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
      <form className="chatInput" onSubmit={handleSend}>
        <input value={text} onChange={handleTyping} placeholder="Type a message..." maxLength={2000} disabled={sending} />
        <button type="submit" disabled={sending || !text.trim()}><Send size={17} /></button>
      </form>
    </div>
  )
}
export default ChatWindow
