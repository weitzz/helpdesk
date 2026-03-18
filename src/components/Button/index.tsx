import type { ButtonHTMLAttributes } from 'react'
import { StyledButton, type ButtonVariant } from './style'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const Button = ({ variant = 'primary', ...props }: ButtonProps) => {
  return <StyledButton $variant={variant} {...props} />
}

export default Button
