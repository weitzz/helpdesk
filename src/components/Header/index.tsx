import { useContext, useEffect, useState } from 'react'
import { FaBars, FaCog, FaHome, FaShieldAlt, FaSignOutAlt, FaUserAlt } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import Avatar from '../../assets/UserAvatar.png'
import { AuthContext } from '../../contexts/auth'
import { usePermissions } from '../../hooks/usePermissions'
import { getRoleColor, getRoleLabel } from '../../utils/rbacHelpers'
import { Sidebar } from './style'

const Header = () => {
  const { user, logout } = useContext(AuthContext)
  const { hasPermission, hasRole } = usePermissions()
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
        setAvatarSrc(user.avatarUrl as string)
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
    navigate('/')
  }

  return (
    <Sidebar $collapsed={collapsed}>
      <button type="button" className="toggle" onClick={() => setCollapsed((value) => !value)}>
        <FaBars size={20} />
      </button>

      <div className="avatarArea">
        <img src={avatarSrc} alt="Foto avatar" onError={() => setAvatarSrc(Avatar)} />
      </div>

      <main className='userInfo'>
        <span>{user?.name ?? ''}</span>
        {user && (
          <small style={{ color: getRoleColor(user.role) }}>
            {getRoleLabel(user.role)}
          </small>
        )}
      </main>

      <Link to="/dashboard">
        <FaHome color="#f7f7f7" size={22} />
        <span className="linkText">Chamados</span>
      </Link>
      {hasPermission('canViewCustomers') && (
        <Link to="/customers">
          <FaUserAlt color="#f7f7f7" size={22} />
          <span className="linkText">Clientes</span>
        </Link>
      )}
      {hasRole('admin') && (
        <Link to="/admin">
          <FaShieldAlt color="#f7f7f7" size={22} />
          <span className="linkText">Admin</span>
        </Link>
      )}
      <Link to="/profile">
        <FaCog color="#f7f7f7" size={22} />
        <span className="linkText">Configuracoes</span>
      </Link>

      <button type="button" className="logoutButton" onClick={handleLogout}>
        <FaSignOutAlt color="#f7f7f7" size={22} />
        <span className="linkText">Sair</span>
      </button>

    </Sidebar>
  )
}

export default Header
