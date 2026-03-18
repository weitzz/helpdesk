import styled from 'styled-components'

export const AuthPageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #121212;
  padding: 16px;
`

export const AuthCard = styled.div`
  background: #eaeaec;
  width: 100%;
  max-width: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
`

export const AuthLogoContainer = styled.div`
  display: flex;
  justify-content: center;
  background: #181c2e;
  width: 100%;

  img {
    padding: 20px;
    width: 200px;
    height: 150px;
    object-fit: cover;
  }
`

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 90%;

  h1 {
    text-align: center;
    margin-bottom: 0.5rem;
    color: #181c2e;
  }

  a {
    color: #181c2e;
    text-align: center;
    padding: 10px;
  }

  @media (max-width: 700px) {
    width: 100%;

    h1 {
      font-size: 1.5rem;
    }
  }
`
