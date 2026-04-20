import { FormEvent, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, Form, HelperLink, LogoContainer, LoginContainer } from './style'
import logo from '../../assets/UserAvatar.png'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { AuthContext } from '../../contexts/auth'
import { toast } from 'react-toastify'

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, loadingAuth } = useContext(AuthContext)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (email !== '' && password !== '') {
      // Validação básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        toast.error('Por favor, insira um email válido.')
        return
      }
      await signIn(email, password)
    } else {
      toast.error('Preencha todos os campos.')
    }
  }

  return (
    <Container>
      <LoginContainer>
        <LogoContainer>
          <img src={logo} alt="Sistema logo" />
        </LogoContainer>
        <Form onSubmit={handleSubmit}>
          <h1>Entrar</h1>
          <Input
            type="text"
            placeholder="email@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="*******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">{loadingAuth ? 'Carregando...' : 'Acessar'}</Button>
          <HelperLink as={Link} to="/reset-password">Esqueci minha senha</HelperLink>
          <Link to="/register">Criar uma conta</Link>
        </Form>
      </LoginContainer>
    </Container>
  )
}

export default SignIn
