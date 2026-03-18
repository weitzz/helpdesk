import styled from 'styled-components'
import {
  AuthCard,
  AuthForm,
  AuthLogoContainer,
  AuthPageContainer,
} from '../../style/auth'

export const Container = AuthPageContainer

export const LoginContainer = AuthCard

export const LogoContainer = AuthLogoContainer

export const Form = styled(AuthForm)`
  margin-top: 1.5rem;
  padding-bottom: 16px;

  @media (max-width: 700px) {
    margin-top: 1rem;
  }
`

export const HelperLink = styled.a`
  color: #181c2e;
  text-align: center;
  padding: 10px;
  cursor: pointer;
`
