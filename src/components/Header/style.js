import styled from 'styled-components'

export const Sidebar = styled.div`
  width: ${({ $collapsed }) => ($collapsed ? '72px' : '200px')};
  background: #181c2e;
  position: fixed;
  height: 100vh;
  transition: width 0.3s ease;
  overflow-x: hidden;

  @media(max-width:700px){
    width: 100%;
    height: auto;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .toggle{
    width: 100%;
    border: 0;
    background: transparent;
    color: #f7f7f7;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'space-between')};
    cursor: pointer;

    span{
      display: ${({ $collapsed }) => ($collapsed ? 'none' : 'inline')};
      margin-left: 8px;
      font-weight: 600;
    }

    @media(max-width:700px){
      display: none;
    }
  }

  .avatarArea{
    height: ${({ $collapsed }) => ($collapsed ? '100px' : '150px')};
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
    padding: 0 12px;

    @media(max-width:700px){
      border: none;
      margin: 0;
      justify-content: flex-start;
    }

    span{
      color: #f7f7f7;
      margin-bottom: 1rem;
      font-weight: 600;
      display: ${({ $collapsed }) => ($collapsed ? 'none' : 'block')};

      @media(max-width:700px){
        font-size: 1em;
        margin-bottom: 0;
        margin-right: 10px;
        display: block;
      }
    }
  }

  img{
    border-radius: 50%;
    display: block;
    margin: auto;
    width: ${({ $collapsed }) => ($collapsed ? '56px' : '100px')};
    height: ${({ $collapsed }) => ($collapsed ? '56px' : '100px')};
    object-fit: cover;
    transition: all 0.3s ease;
  }

  a,
  .logoutButton{
    color: #f7f7f7;
    padding: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
    transition: ease-in-out .6s;
    white-space: nowrap;
    width: 100%;
    background: transparent;
    border: 0;
    cursor: pointer;

    &:hover{
      background-color: #001438;
    }
  }

  svg{
    margin-right: ${({ $collapsed }) => ($collapsed ? '0' : '8px')};
    flex-shrink: 0;
  }

  .linkText{
    display: ${({ $collapsed }) => ($collapsed ? 'none' : 'inline')};

    @media(max-width:700px){
      display: inline;
    }
  }
`;
