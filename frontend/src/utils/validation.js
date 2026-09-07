export const validateDispute = values => {
  const errors = {}
  const description = typeof values.description === 'string'
    ? values.description.trim()
    : ''

  if (!values.reasonCategory) {
    errors.reasonCategory = 'Please select a reason.'
  }

  if (!description) {
    errors.description = 'Please enter a description.'
  } else if (description.length < 20) {
    errors.description = 'Description must contain at least 20 characters.'
  } else if (description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters.'
  }

  return errors
}
