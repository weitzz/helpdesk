import styled from 'styled-components'


export const Container = styled.div`
height: 100vh;
display: flex;
justify-content: center;
align-items: center;
background-color: #121212;

`;

export const LoginContainer = styled.div`
  background: #eaeaec;
  width: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const LogoContainer = styled.div`
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
export const Form = styled.form`
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
