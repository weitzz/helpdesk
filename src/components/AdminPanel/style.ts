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