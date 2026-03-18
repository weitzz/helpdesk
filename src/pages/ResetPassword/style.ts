import styled from 'styled-components'
import { AuthCard, AuthForm, AuthPageContainer } from '../../style/auth'

export const Container = AuthPageContainer

export const Card = styled(AuthCard)`
  max-width: 520px;
  padding: 32px 24px;

  @media (max-width: 700px) {
    padding: 24px 16px;
  }
`

export const Form = styled(AuthForm)`
  gap: 12px;

  h1 {
    margin-bottom: 0;
  }

  p {
    color: #4d5562;
    line-height: 1.5;
    text-align: center;
    margin-bottom: 8px;
  }

  a {
    padding-top: 6px;
  }
`
