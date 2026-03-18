import { FormEvent, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { AuthContext } from '../../contexts/auth'
import { Card, Container, Form } from './style'

const ResetPassword = () => {
  const [email, setEmail] = useState('')
  const { resetPassword, loadingAuth } = useContext(AuthContext)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      return
    }

    await resetPassword(trimmedEmail)
  }

  return (
    <Container>
      <Card>
        <Form onSubmit={handleSubmit}>
          <h1>Recuperar senha</h1>
          <p>Informe seu email para receber o link de redefinicao de senha.</p>
          <Input
            type="email"
            placeholder="email@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button type="submit" disabled={loadingAuth}>
            {loadingAuth ? 'Enviando...' : 'Enviar link de recuperacao'}
          </Button>
          <Link to="/">Voltar para o login</Link>
        </Form>
      </Card>
    </Container>
  )
}

export default ResetPassword
