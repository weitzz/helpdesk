import { useContext, useEffect, useState } from 'react'
import { collection, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { AuthContext } from '../../contexts/auth'
import { ProtectedByRole } from '../ProtectedAccess'
import { database } from '../../services/firebaseConnection'
import type { ServiceCall, ServiceDateValue, ServiceStatus, ServiceSubject, UserData, UserRole } from '../../types'
import { getRoleColor, getRoleLabel, getStatusColor } from '../../utils/rbacHelpers'
import Header from '../Header'
import Navbar from '../Navbar'
import { FaShieldAlt } from 'react-icons/fa'
import { Content } from './style'
import Table from '../Table'
import type { Column } from '../Table'
import { ContainerInfos } from '../ContainerInfos'
import Badge from '../Badge'


export function AdminPanel() {
  const { user } = useContext(AuthContext)
  const [users, setUsers] = useState<UserData[]>([])
  const [calls, setCalls] = useState<ServiceCall[]>([])
  const [callAssignments, setCallAssignments] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [newRole, setNewRole] = useState<UserRole>('cliente')

  useEffect(() => {
    if (user?.role === 'admin') {
      void loadAdminData()
    }
  }, [user?.role])

  async function loadAdminData() {
    setLoading(true)

    try {
      const [usersSnapshot, callsSnapshot] = await Promise.all([
        getDocs(collection(database, 'users')),
        getDocs(query(collection(database, 'chamados'), orderBy('created', 'desc')))
      ])

      const usersList: UserData[] = usersSnapshot.docs.map((userDoc) => {
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

      const callsList: ServiceCall[] = callsSnapshot.docs.map((callDoc) => {
        const data = callDoc.data()

        return {
          id: callDoc.id,
          client: typeof data.client === 'string' ? data.client : '',
          clientId: typeof data.clientId === 'string' ? data.clientId : '',
          subject: (data.subject as ServiceSubject) || 'Suporte',
          status: (data.status as ServiceStatus) || 'Aberto',
          created: data.created ?? null,
          attendedAt: data.attendedAt ?? null,
          descriptions: typeof data.descriptions === 'string' ? data.descriptions : '',
          userId: typeof data.userId === 'string' ? data.userId : ''
        }
      })

      setUsers(usersList)
      setCalls(callsList)
      setCallAssignments(Object.fromEntries(callsList.map((call) => [call.id, call.userId])))
    } catch (error) {
      console.error('Erro ao carregar dados do admin:', error)
      toast.error('Erro ao carregar dados do painel.')
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

  async function assignCallToTechnician(callId: string) {
    const technicianId = callAssignments[callId]

    if (!technicianId) {
      toast.info('Selecione um tecnico para atribuir o chamado.')
      return
    }

    try {
      await updateDoc(doc(database, 'chamados', callId), { userId: technicianId })

      setCalls((prevState) => prevState.map((item) => (
        item.id === callId ? { ...item, userId: technicianId } : item
      )))
      toast.success('Chamado atribuido ao tecnico com sucesso!')
    } catch (error) {
      console.error('Erro ao atribuir chamado:', error)
      toast.error('Erro ao atribuir chamado ao tecnico.')
    }
  }

  function handleAssignmentChange(callId: string, technicianId: string) {
    setCallAssignments((prevState) => ({
      ...prevState,
      [callId]: technicianId
    }))
  }

  function getAssignedTechnicianName(userId: string) {
    const account = users.find((userItem) => userItem.uid === userId)

    return account?.role === 'tecnico' ? account.name : 'Nao atribuido'
  }

  function formatDate(created: ServiceDateValue) {
    if (!created) {
      return '--'
    }

    if (typeof created === 'object' && created !== null && 'toDate' in created && typeof created.toDate === 'function') {
      return created.toDate().toLocaleDateString('pt-BR')
    }

    const date = created instanceof Date ? created : new Date(String(created))
    return date.toLocaleDateString('pt-BR')
  }

  const technicians = users.filter((account) => account.role === 'tecnico')
  const userTableColumns: Column<UserData>[] = [
    {
      key: 'name',
      label: 'Nome',
      render: (value: string, row: UserData) => (
        <>
          <strong>{value}</strong>
          {row.uid === user?.uid && <span style={{ color: '#999' }}> (voce)</span>}
        </>
      )
    },
    {
      key: 'email',
      label: 'Email',
      render: (value: string | null) => value ?? 'Nao informado'
    },
    {
      key: 'role',
      label: 'Role atual',
      render: (value: UserRole) => (
        <Badge label={getRoleLabel(value)} color={getRoleColor(value)} />
      )
    },
    {
      key: 'avatarUrl',
      label: 'Alterar para',
      render: (_value: string | null, row: UserData) => (
        row.uid === selectedUser ? (
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
        )
      )
    },
    {
      key: 'uid',
      label: 'Acoes',
      render: (value: string, row: UserData) => (
        row.uid === selectedUser ? (
          <>
            <button
              type="button"
              onClick={() => updateUserRole(value, newRole)}
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
              setSelectedUser(value)
              setNewRole(row.role)
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
        )
      )
    }
  ]
  const callsTableColumns: Column<ServiceCall>[] = [
    {
      key: 'client',
      label: 'Cliente'
    },
    {
      key: 'subject',
      label: 'Assunto'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: ServiceStatus) => (
        <Badge label={value} color={getStatusColor(value)} />
      )
    },
    {
      key: 'created',
      label: 'Criado em',
      render: (value: ServiceDateValue) => formatDate(value)
    },
    {
      key: 'userId',
      label: 'Tecnico atual',
      render: (value: string) => getAssignedTechnicianName(value)
    },
    {
      key: 'id',
      label: 'Atribuir para',
      render: (value: string) => (
        <select
          value={callAssignments[value] ?? ''}
          onChange={(event) => handleAssignmentChange(value, event.target.value)}
          style={{ padding: '6px', width: '100%' }}
        >
          <option value="">Selecione um tecnico</option>
          {technicians.map((technician) => (
            <option key={technician.uid} value={technician.uid}>
              {technician.name}
            </option>
          ))}
        </select>
      )
    },
    {
      key: 'clientId',
      label: 'Acao',
      render: (_value: string, row: ServiceCall) => (
        <button
          type="button"
          onClick={() => assignCallToTechnician(row.id)}
          disabled={(callAssignments[row.id] ?? '') === row.userId}
          style={{
            backgroundColor: (callAssignments[row.id] ?? '') === row.userId ? '#999' : '#2196f3',
            color: '#fff',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: (callAssignments[row.id] ?? '') === row.userId ? 'not-allowed' : 'pointer'
          }}
        >
          Atribuir
        </button>
      )
    }
  ]

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
            <ContainerInfos />
            {loading ? (
              <p>Carregando usuarios...</p>
            ) : users.length === 0 ? (
              <p>Nenhum usuario encontrado.</p>
            ) : (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <Table<UserData> columns={userTableColumns} data={users} />
                </div>
                <div style={{ backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                  <h3>Atribuir chamados para tecnicos</h3>
                  {technicians.length === 0 ? (
                    <p>Nenhum tecnico cadastrado. Altere o role de um usuario para Tecnico antes de atribuir chamados.</p>
                  ) : calls.length === 0 ? (
                    <p>Nenhum chamado encontrado.</p>
                  ) : (
                    <div style={{ marginTop: '12px' }}>
                      <Table<ServiceCall> columns={callsTableColumns} data={calls} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </ProtectedByRole>
      </Content>
    </>

  )
}
