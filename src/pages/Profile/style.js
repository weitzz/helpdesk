import styled from 'styled-components'


export const Content = styled.div`
  margin-left: 200px;
  padding: 1px 16px;

  @media(max-width:700px){
   margin-left: 0;
  }


`;

export const Container = styled.div`
  margin-top: 30px;
  display: flex;
  background: #f7f7f7;
  border-radius: 4px;
  padding: 10px;
  align-items: center;

  button{
    background: transparent;
    border-radius: 6px;
   border: 1px solid #181c2e;
    height: 40px;
    padding: 6px 12px;
    font-size: 1rem;
    color: #181c2e;
    cursor: pointer;
    max-width: 600px;
   transition: ease-in-out 0.6s;
    &:hover{
      background-color: #181c2e;
      color: #f7f7f7;
    }

  }
`;

export const LabelAvatar = styled.label`
  width:280px;
  width: 280px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  input{
    display: none;
  }
  span{
    z-index: 99;
    position: absolute;
    opacity: 0.7;
    transition: all 0.6s;

    &:hover{
      opacity: 1;
      transform: scale(1.4);
    }
  }

`;

export const FormProfile = styled.form`
  padding: 30px;
  margin-bottom: 15px ;
  display: flex;
  flex-direction: column;
  max-width: 600px;

  img{
    border-radius: 50%;
  object-fit: cover;
  }
label{
  font-size: 1.2rem;
  margin-bottom: 15px ;
}
input{
  margin-bottom: 15px ;
  padding: 10px;
  border: none;
  border-radius: 4px;
  max-width: 600px;
}

input:disabled{
  cursor: not-allowed;
}
button{
    background: #181c2e;
    border-radius: 6px;
    border: none;
    height: 40px;
    padding: 6px 12px;
    font-size: 1rem;
    color: #f7f7f7;
    cursor: pointer;
    max-width: 600px;
    transition: ease-in-out 0.6s;
    &:hover{
      border: 1px solid #181c2e;
      background-color: #f7f7f7;
      color: #181c2e;
    }

  }
`;