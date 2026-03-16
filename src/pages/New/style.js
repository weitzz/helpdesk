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
  flex-direction: column;
  `;

export const Form = styled.form`
  padding: 30px;
  margin-bottom: 15px ;
  display: flex;
  flex-direction: column;
  width: 600px;

 .status input[type='radio']{
   margin: 15px 0;
 }
.status input[type='radio']:not(:first-child){
   margin-left: 15px;
 }
 .status span{
  padding-left: .5em;
 }

label{
  font-size: 1.2rem;
  margin-bottom: 15px ;
}
select{
  margin-bottom: 15px ;
  padding: 10px;
  border: none;
  border-radius: 4px;
  max-width: 600px;
}

textarea{
  height: 95px;
  resize: none;
  margin-bottom: 30px;
}
  .btn{
    border: 1px solid #181c2e;
    border-radius: 6px;
    height: 40px;
    padding: 6px 12px;
    font-size: 1rem;
    color: #181c2e;
    cursor: pointer;
    max-width: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    transition: ease-in-out 0.6s;
    &:hover{
      background-color: #181c2e;
      color: #f7f7f7;
    }
  }
  `;
