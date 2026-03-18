import type { InputHTMLAttributes } from 'react'
import { StyledInput } from './style'

type InputProps = InputHTMLAttributes<HTMLInputElement>

const Input = (props: InputProps) => {
  return <StyledInput {...props} />
}

export default Input
