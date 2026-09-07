import {useState} from 'react'
import {validateDispute} from '../../utils/validation'
import './index.css'

const DisputeForm = props => {
  const {orderId, onSubmit, onCancel, workflow} = props
  const [reasonCategory, setReasonCategory] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({})

  const handleSubmit = event => {
    event.preventDefault()

    const values = {reasonCategory, description}
    const validationErrors = validateDispute(values)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    onSubmit({
      orderId,
      reasonCategory,
      description: description.trim(),
    })
  }

  return (
    <form className="disputeForm" onSubmit={handleSubmit}>
      <div className="formGroup">
        <label>Order ID</label>
        <input value={orderId} disabled />
      </div>

      <div className="formGroup">
        <label htmlFor="reasonCategory">Reason Category</label>
        <select
          id="reasonCategory"
          value={reasonCategory}
          onChange={event => setReasonCategory(event.target.value)}
        >
          <option value="">Select a reason</option>
          {workflow.disputeCategories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        {errors.reasonCategory && <p className="formError">{errors.reasonCategory}</p>}
      </div>

      <div className="formGroup">
        <div className="labelRow">
          <label htmlFor="description">Description</label>
          <span>{description.length}/500</span>
        </div>
        <textarea
          id="description"
          value={description}
          maxLength={500}
          onChange={event => setDescription(event.target.value)}
          placeholder="Explain the issue with your order..."
          rows="7"
        />
        {errors.description && <p className="formError">{errors.description}</p>}
      </div>

      <div className="formActions">
        <button type="button" className="secondaryButton" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="primaryButton">
          Submit Dispute
        </button>
      </div>
    </form>
  )
}

export default DisputeForm
