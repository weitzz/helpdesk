import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/avatar2.jpg'
import styled from 'styled-components'
import { AuthContext } from '../../contexts/auth'
import Input from '../../components/Input'
import Button from '../../components/Button'

const Container = styled.div`
height: 100vh;
display: flex;
justify-content: center;
align-items: center;
background-color: #121212;

`;

const LoginContainer = styled.div`
  background: #eaeaec;
  width: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const LogoContainer = styled.div`
display: flex;
  justify-content: center;
  background: #181c2e;
  width: 100%;

img{
  padding: 20px;
  width: 200px;
  height: 150px;
}
`;
const Form = styled.form`
display: flex;
flex-direction: column;
margin-top: 1.5rem;
width: 90%;

  h1{
    text-align: center;
    margin-bottom: 0.5rem;
    color: #181c2e;
  }
  a{
    color: #181c2e;
    text-align: center;
    padding: 10px;
  }
`;

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { signIn, loadingAuth } = useContext(AuthContext)

  async function handleSubmit(e) {
    e.preventDefault()
    if (email !== '' && password !== '') {
      await signIn(email, password)
    }
  }

  return (

    <Container>
      <LoginContainer >
        <LogoContainer >
          <img src={logo} alt="Sistema logo" />
        </LogoContainer>
        <Form onSubmit={handleSubmit}>
          <h1>Entrar</h1>
          <Input type="text" placeholder='email@email.com'
            value={email} onChange={e => setEmail(e.target.value)} />
          <Input type="password" placeholder='*******'
            value={password} onChange={e => setPassword(e.target.value)} />
          <Button type='submit'>{loadingAuth ? 'Carregando...' : 'Acessar'}</Button>
          <Link to='/register'>Criar uma conta </Link>
        </Form>
      </LoginContainer>
    </Container>

  )
}

export default SignIn
