import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Content = styled.div`
  margin-left: var(--sidebar-width, 200px);
  padding: 1px 16px;

  @media(max-width:700px){
   margin-left: 0;
  }
`

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
`

export const FilterBar = styled.div`
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f7f7f7;
  border-radius: 4px;
  padding: 16px;

  label{
    font-weight: 600;
    color: #181c2e;
  }

  select{
    min-width: 240px;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
  }

  @media(max-width: 700px){
    flex-direction: column;
    align-items: stretch;
  }
`

export const CompanySection = styled.section`
  margin-top: 20px;
  background: #f7f7f7;
  border-radius: 4px;
  padding: 20px;

  h2{
    color: #181c2e;
    margin-bottom: 6px;
  }

  p{
    color: #666;
    margin-bottom: 16px;
  }
`

export const Pagination = styled.div`
  margin: 24px 0 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #f7f7f7;
  border-radius: 4px;
  padding: 16px;

  span{
    color: #181c2e;
    font-weight: 600;
  }

  div{
    display: flex;
    gap: 8px;
  }

  button{
    background: #181c2e;
    color: #f7f7f7;
    border: 1px solid #181c2e;
    border-radius: 6px;
    padding: 10px 14px;
    cursor: pointer;
  }

  button:disabled{
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media(max-width: 700px){
    flex-direction: column;
    align-items: stretch;

    div{
      justify-content: center;
    }
  }
`

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
     border: none;
  font-size: 1em;
    thead{
     display: none;
    }

    tr{
       display: block;
    margin-bottom: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 8px;
    }

    td{
      display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    font-size: .9em;
    padding: 8px 4px;
    }

    td:before{
      content: attr(data-label);
      font-weight: 600;
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
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  td .action svg {
    vertical-align: middle;
  }
`

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 999;
`

export const ModalContent = styled.div`
  width: 100%;
  max-width: 600px;
  background: #f7f7f7;
  border-radius: 8px;
  padding: 24px;

  h2{
    margin-bottom: 20px;
    color: #181c2e;
  }

  strong{
    display: block;
    margin-bottom: 6px;
    color: #181c2e;
  }

  p{
    margin-bottom: 16px;
    line-height: 1.5;
  }

  button{
    background: #181c2e;
    color: #f7f7f7;
    border: none;
    border-radius: 6px;
    padding: 10px 16px;
    cursor: pointer;
  }
`
