import {Search} from 'lucide-react'
import './index.css'

const SearchBar = props => {
  const {value, onChange, placeholder = 'Search'} = props

  return (
    <div className="searchBar">
      <Search size={18} />
      <input
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

export default SearchBar
