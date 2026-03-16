import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from '../../contexts/auth'
import Avatar from '../../assets/avatar2.jpg'
import { FaHome, FaUserAlt, FaCog, FaSignOutAlt, FaBars } from "react-icons/fa";
import { Sidebar } from './style'

const Header = () => {
  const { user, logout } = useContext(AuthContext)
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sidebarCollapsed') === 'true')
  const [avatarSrc, setAvatarSrc] = useState(Avatar)
  const navigate = useNavigate()

  useEffect(() => {
    const sidebarWidth = collapsed ? '72px' : '200px'

    document.documentElement.style.setProperty('--sidebar-width', sidebarWidth)
    localStorage.setItem('sidebarCollapsed', String(collapsed))

    return () => {
      document.documentElement.style.setProperty('--sidebar-width', '200px')
    }
  }, [collapsed])

  useEffect(() => {
    if (!user?.avatarUrl) {
      setAvatarSrc(Avatar)
      return
    }

    let isMounted = true
    const image = new Image()

    image.onload = () => {
      if (isMounted) {
        setAvatarSrc(user.avatarUrl)
      }
    }

    image.onerror = () => {
      if (isMounted) {
        setAvatarSrc(Avatar)
      }
    }

    image.src = user.avatarUrl

    return () => {
      isMounted = false
    }
  }, [user?.avatarUrl])

  async function handleLogout() {
    await logout()
    navigate("/")
  }

  return (
    <Sidebar $collapsed={collapsed}>
      <button type="button" className="toggle" onClick={() => setCollapsed((value) => !value)}>
        <FaBars size={20} /></button>

      <div className="avatarArea">
        <img src={avatarSrc} alt="Foto avatar" onError={() => setAvatarSrc(Avatar)} />
      </div>

      <main>
        <span>{user.name}</span>
      </main>

      <Link to="/dashboard">
        <FaHome color='#f7f7f7' size={22} />
        <span className="linkText">Chamados</span>
      </Link>
      <Link to="/customers">
        <FaUserAlt color='#f7f7f7' size={22} />
        <span className="linkText">Clientes</span>
      </Link>
      <Link to="/profile">
        <FaCog color='#f7f7f7' size={22} />
        <span className="linkText">Configuracoes</span>
      </Link>
      <div>
        <button type="button" className="logoutButton" onClick={handleLogout}>
          <FaSignOutAlt color='#f7f7f7' size={22} />
          <span className="linkText">Sair</span>
        </button>
      </div>
    </Sidebar>
  )
}

export default Header
