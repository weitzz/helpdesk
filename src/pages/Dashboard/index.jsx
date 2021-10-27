
import { useState } from 'react'
import Header from '../../components/Header'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'
import {FaDesktop, FaPlus,FaSearch,FaEdit} from 'react-icons/fa'


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
  justify-content: center;
  flex-direction: column;
  
  span{
    margin: 30px 0;
    font-weight: 600;
    font-size: 1.2rem;
  }

  a{
    background-color:#00923a;
    color: #f7f7f7;
    display: flex;
    flex-direction: row;
    padding: 8px 16px;
    justify-content: space-around;
    align-items: center;
    font-size: 1.1rem;
    border-radius: 6px;
    transition:  ease-in 0.2s;

    &:hover{
      background-color: #00593b;
      transform: scale(1.1);
    }
    svg{
      margin-right: 8px;
    }
  }
  `

export const BtnLink = styled(Link)`
    background-color:#00923a;
    width: 200px;
    color: #f7f7f7;
    display: flex;
    flex-direction: row;
    padding: 8px 16px;
    justify-content: space-around;
    align-items: center;
    font-size: 1.1rem;
    border-radius: 6px;
    transition:  ease-in 0.2s;

    &:hover{
      background-color: #00593b;
      transform: scale(1.1);
    }

` 
export const ContainerBtn = styled.div`
  margin: 30px 0;
  display: flex;
  justify-content: flex-end;
`;
export const Table = styled.table`
  margin: 0;
  padding: 0;
  border: 1px solid #ccc;
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;
  @media screen and (max-width: 600px){
    border: none;
    font-size: 1.3em;
  }

  @media screen and (max-width: 600px){
    thead{
      border: none;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
    }
    tr{
      border-bottom: 3px solid #ddd;
      display: block;
      margin-bottom: .65em;
    }
    td{
      border-bottom: 1px solid #ddd;
      display: block;
      font-size: .8em;
      text-align: right;
    }

    td:before{
      content: attr(data-label);
      float: left;
      font-weight: 600;
      text-transform: uppercase;
    }
    td:last-child{
      border-bottom: 0;
    }

  }

  table caption{
    font-size: 1.2rem;
    margin: .5em 0 .75em ;
  }

  tr{
    background-color: #f8f8f8;
    border: 1px solid #ddd;
    padding: .35em;
  }
  th,td{
    padding: .62em;
    text-align: center;
  }
  th{
    text-transform: uppercase;
  }
  td .badge{
    padding: 6px;
    border-radius: 4px;
    color: #f8f8f8;
    font-weight: 600;
  }
  td .action{
    border: 0;
    margin-right: 8px;
    padding: 6px;
    border-radius: 4px;
    cursor: pointer;
  }
  td .action svg {
    vertical-align: middle;
  }
`;





const Dashboard = () => {
  const [services,setServices] = useState([1])
  

  return (
    <>
    <Header/>
    <Content>
    <Navbar title='Chamados'>
        <FaDesktop size={25}/>
      </Navbar>
      {services.length === 0 ? (
      <Container>
        <span>Nenhum chamado registrado</span>
        <Link to='/new'>
          <FaPlus  size={25} color='#fff'/>
          Novo chamado</Link>
      </Container>
      ) : (
        <>
        <ContainerBtn>
        <BtnLink to='/new'>
          <FaPlus  size={25} color='#fff'/>
          Novo chamado</BtnLink>
        </ContainerBtn>

        <Table>
          <thead>
          <tr>
            <th scope= 'col'>Cliente</th>
            <th scope= 'col'>Assunto</th>
            <th scope= 'col'>Status</th>
            <th scope= 'col'>Cadastrado em...</th>
            <th scope= 'col'>#</th>
          </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label='Cliente'>Sujeito</td>
              <td data-label='Assunto'>Suporte</td>
              <td data-label='Status'>
                <span  className='badge' style={{backgroundColor:'#55ac55'}}>Aberto</span>
              </td>
              <td data-label='date'>20/05/2022</td>
              <td data-label='#' >
                <button className='action' style={{backgroundColor:'#098de5'}}><FaSearch size={17}  color={'#Fff'}/></button>
                <button className='action' style={{backgroundColor:'#ff904d'}}><FaEdit size={17} color={'#Fff'}/></button>
              </td>
            </tr>
          </tbody>
        </Table>
        </>
      )}
    </Content>
    </>
  )
}

export default Dashboard
