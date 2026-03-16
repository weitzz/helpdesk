import styled from 'styled-components'


export const Content = styled.div`
  margin-left: var(--sidebar-width, 200px);
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
  justify-content: center;
`;

export const LabelAvatar = styled.label`
  width: 280px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 0 auto 24px auto;

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

  img{
    width: 250px;
    height: 250px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #181c2e;
  }
`;

export const FormProfile = styled.form`
  width: 100%;
  padding: 30px;
  margin-bottom: 15px ;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  flex: 1;

  img{
    border-radius: 50%;
    object-fit: cover;
  }

  label{
    font-size: 1.2rem;
    margin-bottom: 10px ;
  }

  @media(max-width: 700px){
    padding: 20px 16px;

    ${LabelAvatar}{
      width: 100%;
    }

    ${LabelAvatar} img{
      width: 200px;
      height: 200px;
    }
  }
`;
