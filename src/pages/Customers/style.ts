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
`

export const FormProfile = styled.form`
  padding: 30px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 600px;

  label{
    font-size: 1.2rem;
    margin-bottom: 15px;
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
`

export const TableContainer = styled.div`
  margin-top: 30px;
  background: #f7f7f7;
  border-radius: 4px;
  padding: 20px;

  h2{
    margin-bottom: 20px;
    color: #181c2e;
  }
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td{
    text-align: left;
    padding: 14px 10px;
    border-bottom: 1px solid #ddd;
  }

  th{
    text-transform: uppercase;
    font-size: 0.9rem;
    color: #555;
  }

  @media(max-width: 700px){
    display: block;
    overflow-x: auto;
  }
`
