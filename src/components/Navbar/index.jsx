import styled from "styled-components"

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #f7f7f7;
  height: 60px;
 
span{
  font-size: 1.2rem;
  margin-left: 5px;
}


`;

const Navbar = ({children,title}) => {
  return (
    <Container >
       {children}
       <span>{title}</span>
    </Container>
  )
}

export default Navbar
