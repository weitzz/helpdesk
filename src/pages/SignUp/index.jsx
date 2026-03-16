import React, { useState,useContext } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.jpg'
import { Container,LoginContainer,LogoContainer,Form } from './style'
import { AuthContext } from '../../contexts/auth'
import Input from '../../components/Input'
import Button from '../../components/Button'


const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name,setName] = useState('')

  const {signUp,loadingAuth} = useContext(AuthContext)


  async function handleSubmit(e){
    e.preventDefault()
      //DIFERENTE DE VAZIO OU SEJA,PODEMOS CADASTRAR O 
      //USUÁRIO
    if(name !== '' && email !== '' && password !== '' ){
     await signUp(email, password, name)
    }
  }

  return (
    <>
    <Container>
      <LoginContainer className="login">
        <LogoContainer className="logo">
          <img src={logo} alt="Sistema logo" />
        </LogoContainer>
        <Form onSubmit={handleSubmit}>
          <h1>Cadastrar</h1>
          <Input type="text" placeholder='Nome'
           value={name} onChange={e => setName(e.target.value)} />
          <Input type="text" placeholder='email@email.com'
           value={email} onChange={e => setEmail(e.target.value)} />
          <Input type="password" placeholder='*******' 
          value={password} onChange={e => setPassword(e.target.value)}/>
          <Button type='submit'>{loadingAuth ? 'Carregando...': 'Cadastrar'}</Button>
          <Link to='/'>Possuo uma conta</Link>
        </Form>
      </LoginContainer>
    </Container>
  
    </>
  )
}

export default SignUp
