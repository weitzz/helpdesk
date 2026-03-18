import styled from 'styled-components'

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #121212;
  padding: 16px;
`

export const Card = styled.div`
  width: 100%;
  max-width: 520px;
  background: #eaeaec;
  border-radius: 12px;
  padding: 32px 24px;

  @media(max-width: 700px){
    padding: 24px 16px;
  }
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;

  h1{
    color: #181c2e;
    text-align: center;
  }

  p{
    color: #4d5562;
    line-height: 1.5;
    text-align: center;
    margin-bottom: 8px;
  }

  a{
    color: #181c2e;
    text-align: center;
    padding-top: 6px;
  }
`
