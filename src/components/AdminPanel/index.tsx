import { useContext, useEffect, useState } from 'react'
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { AuthContext } from '../../contexts/auth'
import { ProtectedByRole } from '../ProtectedAccess'
import { database } from '../../services/firebaseConnection'
import type { UserData, UserRole } from '../../types'
import { getRoleColor, getRoleLabel } from '../../utils/rbacHelpers'
import Header from '../Header'
import Navbar from '../Navbar'
import { FaShieldAlt } from 'react-icons/fa'
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


export function AdminPanel() {
  const { user } = useContext(AuthContext)
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [newRole, setNewRole] = useState<UserRole>('cliente')

  useEffect(() => {
    if (user?.role === 'admin') {
      void loadUsers()
    }
  }, [user?.role])

  async function loadUsers() {
    setLoading(true)

    try {
      const snapshot = await getDocs(collection(database, 'users'))
      const usersList: UserData[] = snapshot.docs.map((userDoc) => {
        const data = userDoc.data()

        return {
          uid: userDoc.id,
          name: typeof data.name === 'string' ? data.name : '',
          email: typeof data.email === 'string' ? data.email : null,
          avatarUrl: typeof data.avatarUrl === 'string' ? data.avatarUrl : null,
          role: data.role === 'admin' || data.role === 'tecnico' || data.role === 'cliente'
            ? data.role
            : 'cliente'
        }
      })

      setUsers(usersList)
    } catch (error) {
      console.error('Erro ao carregar usuarios:', error)
      toast.error('Erro ao carregar usuarios.')
    } finally {
      setLoading(false)
    }
  }

  async function updateUserRole(userId: string, role: UserRole) {
    try {
      await updateDoc(doc(database, 'users', userId), { role })

      setUsers((prevState) => prevState.map((item) => (
        item.uid === userId ? { ...item, role } : item
      )))
      setSelectedUser(null)
      toast.success(`Role do usuario atualizado para: ${getRoleLabel(role)}`)
    } catch (error) {
      console.error('Erro ao atualizar role:', error)
      toast.error('Erro ao atualizar role do usuario.')
    }
  }

  return (
    <>
      <Header />
      <Content>
        <Navbar title="Painel de Administração">
          <FaShieldAlt size={25} />
        </Navbar>
        <ProtectedByRole
          roles={['admin']}
          fallback={
            <div style={{ padding: '20px' }}>
              <p style={{ color: '#ff6b6b' }}>Voce nao tem permissao para acessar este painel.</p>
            </div>
          }
        >
          <div style={{ padding: '20px' }}>
            <div style={{ backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3>Resumo</h3>
              <p>
                <strong>Usuario logado:</strong> {user?.name}{' '}
                <strong style={{ color: getRoleColor('admin') }}>
                  ({getRoleLabel('admin')})
                </strong>
              </p>
              <p>Total de usuarios no sistema: <strong>{users.length}</strong></p>
            </div>

            {loading ? (
              <p>Carregando usuarios...</p>
            ) : users.length === 0 ? (
              <p>Nenhum usuario encontrado.</p>
            ) : (
              <div>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#333', color: '#fff' }}>
                      <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Nome</th>
                      <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Email</th>
                      <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Role atual</th>
                      <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Alterar para</th>
                      <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Acoes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((account) => (
                      <tr key={account.uid} style={{ backgroundColor: account.uid === selectedUser ? '#f9f9f9' : '#fff' }}>
                        <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                          <strong>{account.name}</strong>
                          {account.uid === user?.uid && <span style={{ color: '#999' }}> (voce)</span>}
                        </td>
                        <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                          {account.email ?? 'Nao informado'}
                        </td>
                        <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                          <span
                            style={{
                              backgroundColor: getRoleColor(account.role),
                              color: '#fff',
                              padding: '4px 8px',
                              borderRadius: '4px'
                            }}
                          >
                            {getRoleLabel(account.role)}
                          </span>
                        </td>
                        <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                          {account.uid === selectedUser ? (
                            <select
                              value={newRole}
                              onChange={(event) => setNewRole(event.target.value as UserRole)}
                              style={{ padding: '6px' }}
                            >
                              <option value="cliente">Cliente</option>
                              <option value="tecnico">Tecnico</option>
                              <option value="admin">Admin</option>
                            </select>
                          ) : (
                            <span style={{ color: '#999' }}>-</span>
                          )}
                        </td>
                        <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>
                          {account.uid === selectedUser ? (
                            <>
                              <button
                                type="button"
                                onClick={() => updateUserRole(account.uid, newRole)}
                                style={{
                                  backgroundColor: '#4caf50',
                                  color: '#fff',
                                  border: 'none',
                                  padding: '8px 12px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  marginRight: '5px'
                                }}
                              >
                                Confirmar
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedUser(null)}
                                style={{
                                  backgroundColor: '#999',
                                  color: '#fff',
                                  border: 'none',
                                  padding: '8px 12px',
                                  borderRadius: '4px',
                                  cursor: 'pointer'
                                }}
                              >
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedUser(account.uid)
                                setNewRole(account.role)
                              }}
                              style={{
                                backgroundColor: '#2196f3',
                                color: '#fff',
                                border: 'none',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              Editar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px' }}>
                  <h4>Permissoes por role</h4>
                  <ul>
                    <li><strong>Cliente:</strong> pode criar e acompanhar os proprios chamados.</li>
                    <li><strong>Tecnico:</strong> pode atuar nos chamados atribuidos a ele.</li>
                    <li><strong>Admin:</strong> possui acesso completo ao sistema.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </ProtectedByRole>
      </Content>
    </>

  )
}
