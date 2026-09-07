import {Redirect} from 'react-router-dom'

const Home = props => {
  const {currentUser} = props

  if (currentUser && currentUser.role === 'Admin') {
    return <Redirect to="/admin/dashboard" />
  }

  return <Redirect to="/customer/dashboard" />
}

export default Home
