import { useState } from 'react'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

const SearchBar = ({ 
  onSearch, 
  placeholder = 'Search...', 
  className = '',
  showButton = false,
  ...props 
}) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch?.(query)
  }

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    if (!showButton) {
      onSearch?.(value)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <Input
        icon="Search"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="flex-1"
        {...props}
      />
      {showButton && (
        <Button type="submit" icon="Search" />
      )}
    </form>
  )
}

export default SearchBar