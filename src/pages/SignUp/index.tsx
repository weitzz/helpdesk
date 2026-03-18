import { FormEvent, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import logo from '../../assets/logo.jpg'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { AuthContext } from '../../contexts/auth'
import { Container, Form, LoginContainer, LogoContainer } from './style'

const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const { signUp, loadingAuth } = useContext(AuthContext)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (name !== '' && email !== '' && password !== '') {
      // Validação de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        toast.error('Por favor, insira um email válido.')
        return
      }
      // Validação de senha forte
      if (password.length < 6) {
        toast.error('A senha deve ter pelo menos 6 caracteres.')
        return
      }
      await signUp(email, password, name)
    } else {
      toast.error('Preencha todos os campos.')
    }
  }

  return (
    <Container>
      <LoginContainer className="login">
        <LogoContainer className="logo">
          <img src={logo} alt="Sistema logo" />
        </LogoContainer>
        <Form onSubmit={handleSubmit}>
          <h1>Cadastrar</h1>
          <Input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <Button type="submit">{loadingAuth ? 'Carregando...' : 'Cadastrar'}</Button>
          <Link to="/">Possuo uma conta</Link>
        </Form>
      </LoginContainer>
    </Container>
  )
}

export default SignUp
