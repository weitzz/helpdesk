import styled, { css } from 'styled-components'

export type ButtonVariant = 'primary' | 'outline' | 'success'

interface ButtonStyleProps {
  $variant: ButtonVariant
}

const variants: Record<ButtonVariant, ReturnType<typeof css>> = {
  primary: css`
    background: #181c2e;
    color: #f7f7f7;
    border: 1px solid #181c2e;

    &:hover{
      background: #f7f7f7;
      color: #181c2e;
    }
  `,
  outline: css`
    background: transparent;
    color: #181c2e;
    border: 1px solid #181c2e;

    &:hover{
      background: #181c2e;
      color: #f7f7f7;
    }
  `,
  success: css`
    background: #00923a;
    color: #f7f7f7;
    border: 1px solid #00923a;

    &:hover{
      background: #00593b;
      border-color: #00593b;
    }
  `
}

export const StyledButton = styled.button<ButtonStyleProps>`
  min-height: 40px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: ease-in-out 0.3s;
  ${({ $variant }) => variants[$variant]}

  &:disabled{
    opacity: 0.7;
    cursor: not-allowed;
  }
`
