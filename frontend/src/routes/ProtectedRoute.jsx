import {Redirect, Route} from 'react-router-dom'

const ProtectedRoute = props => {
  const {
    component: Component,
    currentUser,
    allowedRole,
    logout,
    ...otherProps
  } = props

  return (
    <Route
      {...otherProps}
      render={routeProps => {
        if (!currentUser) {
          return <Redirect to="/login" />
        }

        if (
          allowedRole &&
          currentUser.role.toLowerCase() !== allowedRole.toLowerCase()
        ) {
          return <Redirect to="/not-found" />
        }

        return (
          <Component
            {...routeProps}
            currentUser={currentUser}
            logout={logout}
            {...otherProps}
          />
        )
      }}
    />
  )
}

export default ProtectedRoute
