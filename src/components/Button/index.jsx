import { StyledButton } from './style'

const Button = ({ variant = 'primary', ...props }) => {
  return <StyledButton $variant={variant} {...props} />
}

export default Button
