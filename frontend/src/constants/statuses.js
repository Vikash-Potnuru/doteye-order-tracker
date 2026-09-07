export const getNextStatuses = (workflow, status) =>
  workflow.statusFlow[status] || []

export const canRaiseDispute = (workflow, status) =>
  workflow.disputeEligibleOrderStatuses.includes(status)

export const isActiveDispute = (workflow, status) =>
  workflow.activeDisputeStatuses.includes(status)
