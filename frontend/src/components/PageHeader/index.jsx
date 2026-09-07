import './index.css'

const PageHeader = props => {
  const {title, description, children} = props

  return (
    <div className="pageHeader">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div>{children}</div>
    </div>
  )
}

export default PageHeader
