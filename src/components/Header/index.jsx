import { useContext } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { AuthContext } from '../../contexts/auth'
import Avatar from '../../assets/avatar2.jpg'
import { FaHome, FaUserAlt, FaCog } from "react-icons/fa";

const Sidebar = styled.div`
  width: 200px;
  background: #181c2e;
  position: fixed;
  height: 100vh;

  @media(max-width:700px){
    width: 100%;
    height: auto;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  div{
   height: 150px;
   padding-top: 30px;

   @media(max-width:700px){
    display: none;
  }
  }
  main{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #8b8b8b;
    margin-bottom: 1rem;
    @media(max-width:700px){
      border: none;
      margin: 0;
      justify-content: flex-start;
  }
    span{
      color: #f7f7f7;
      margin-bottom: 1rem;
      @media(max-width:700px){
        font-size: 1em;
        margin-bottom: 0;
        margin-right: 10px;
      }
    }
  }

img{
  border-radius: 50%;
  display: block;
  margin: auto;
  width: 100px;
  height: 100px;
  object-fit: cover;

}

a{
  color: #f7f7f7;
  padding: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: ease-in-out .6s;

  &:hover{
    background-color: #001438;
   
  }

}
svg{
  margin-right: 8px;

}
 
`;


const Header = () => {
  const { user } = useContext(AuthContext)
  return (
    <Sidebar>
      <div>
        <img src={user.avatarUrl === null ? Avatar : user.avatarUrl} alt="Foto avatar" />
      </div>
      <main>
        <span>{user.name}</span>
      </main>
      <Link to="/dashboard">
        <FaHome color='#f7f7f7' size={22} />
        Chamados
      </Link>
      <Link to="/customers">
        <FaUserAlt color='#f7f7f7' size={22} />
        Clientes
      </Link>
      <Link to="/profile">
        <FaCog color='#f7f7f7' size={22} />
        Configurações
      </Link>
    </Sidebar>
  )
}

export default Header
