import './index.css'

const ErrorMessage = props => {
  const {message = 'Unable to load data. Please try again.'} = props

  return <p className="errorMessage">{message}</p>
}

export default ErrorMessage
