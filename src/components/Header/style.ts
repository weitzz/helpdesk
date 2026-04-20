import styled from 'styled-components'

interface SidebarProps {
  $collapsed: boolean
}

export const Sidebar = styled.div<SidebarProps>`
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

  .userInfo{
    width: calc(100% - 24px);
    min-width: 0;
    min-height: 72px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin: 0 auto 1rem;
    padding: 12px;
    text-align: center;

    @media(max-width:700px){
      width: auto;
      min-height: 0;
      flex: 1 1 160px;
      flex-direction: row;
      justify-content: flex-start;
      margin: 8px;
      padding: 8px 10px;
      text-align: left;
    }

    span{
      color: #f7f7f7;
      font-weight: 600;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: ${({ $collapsed }) => ($collapsed ? 'none' : 'block')};

      @media(max-width:700px){
        font-size: 1em;
        display: block;
      }
    }

    small{
      color: #f7f7f7;
      border-radius: 999px;
      display: ${({ $collapsed }) => ($collapsed ? 'none' : 'inline-flex')};
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      line-height: 1;
      max-width: 100%;
      padding: 5px 10px;
      white-space: nowrap;

      @media(max-width:700px){
        display: inline-flex;
        flex-shrink: 0;
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
    padding: 1rem;
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
      background-color: #043486;
    }
  }

  svg{
    margin-right: ${({ $collapsed }) => ($collapsed ? '0' : '8px')};
    flex-shrink: 0;
  }

  .linkText{
    display: ${({ $collapsed }) => ($collapsed ? 'none' : 'inline')};
    font-size: 1rem;
    @media(max-width:700px){
      display: inline;
    }
  }
`
