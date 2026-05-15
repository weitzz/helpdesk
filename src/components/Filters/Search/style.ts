import styled from 'styled-components'

export const SearchContainer = styled.div`
  display: flex;
  flex: 1.4;
  flex-direction: column;
  gap: 8px;
  min-width: 220px;

  label{
    font-weight: 600;
    color: #181c2e;
  }

  input{
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    background: #fff;
    color: #181c2e;
  }

  @media(max-width: 700px){
    min-width: 100%;
  }
`
