import { OptionsContainer } from './style'

type FilterOptionsProps = {
  id?: string
  label: string
  options: string[]
  selectedValue: string
  onChange: (value: string) => void
  defaultOptionLabel?: string
  defaultOptionValue?: string
}

const FilterOptions = ({
  id = 'filterOption',
  label,
  options,
  selectedValue,
  onChange,
  defaultOptionLabel,
  defaultOptionValue = 'todos'
}: FilterOptionsProps) => {
  return (
    <OptionsContainer>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={selectedValue}
        onChange={(event) => onChange(event.target.value)}
      >
        {defaultOptionLabel && (
          <option value={defaultOptionValue}>{defaultOptionLabel}</option>
        )}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </OptionsContainer>
  )
}

export default FilterOptions
