import { SearchContainer } from './style'

type FilterSearchProps = {
  id?: string
  searchTerm: string
  onSearch: (term: string) => void
  label: string
  placeholder?: string
}

const FilterSearch = ({ id = 'searchFilter', searchTerm, onSearch, label, placeholder }: FilterSearchProps) => {
  return (
    <SearchContainer>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(event) => onSearch(event.target.value)}
      />
    </SearchContainer>
  )
}

export default FilterSearch
