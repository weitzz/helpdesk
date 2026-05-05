import { useContext, useEffect, useState } from 'react'
import { FaDesktop, FaEdit, FaPlus, FaSearch } from 'react-icons/fa'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Header from '../../components/Header'
import Navbar from '../../components/Navbar'
import { AuthContext } from '../../contexts/auth'
import { usePermissions } from '../../hooks/usePermissions'
import { database } from '../../services/firebaseConnection'
import type { ServiceCall, ServiceDateValue, ServiceStatus, ServiceSubject } from '../../types'
import { canPerformAction, filterCallsByRole, getRoleColor, getRoleLabel, getStatusColor } from '../../utils/rbacHelpers'
import {
  BtnLink,
  CompanySection,
  Container,
  ContainerBtn,
  Content,
  FilterBar,
  ModalContent,
  ModalOverlay,
  Table
} from './style'
import Badge from '../../components/Badge'
import Pagination from '../../components/Pagination'

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const { hasPermission } = usePermissions()
  const [services, setServices] = useState<ServiceCall[]>([])
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<ServiceCall | null>(null)
  const [selectedClient, setSelectedClient] = useState('todos')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    async function loadCalls() {
      try {
        const chamadosRef = collection(database, 'chamados')
        const q = query(chamadosRef, orderBy('created', 'desc'))
        const snapshot = await getDocs(q)

        const lista: ServiceCall[] = snapshot.docs.map((item) => {
          const data = item.data()

          return {
            id: item.id,
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

        setServices(lista)
      } catch (error) {
        toast.error('Erro ao buscar chamados.')
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    void loadCalls()
  }, [])

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

  function openModal(item: ServiceCall) {
    setDetail(item)
  }

  function closeModal() {
    setDetail(null)
  }

  const visibleServices = user
    ? filterCallsByRole(services, user.role, user.uid)
    : []

  const clientOptions = Array.from(new Set(visibleServices.map((item) => item.client)))
  const filteredServices = selectedClient === 'todos'
    ? visibleServices
    : visibleServices.filter((item) => item.client === selectedClient)

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedClient])

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedServices = filteredServices.slice(startIndex, startIndex + itemsPerPage)
  const groupedServices = paginatedServices.reduce<Record<string, ServiceCall[]>>((acc, item) => {
    if (!acc[item.client]) {
      acc[item.client] = []
    }

    acc[item.client].push(item)
    return acc
  }, {})

  return (
    <>
      <Header />
      <Content>
        <Navbar title="Chamados">
          <FaDesktop size={25} />
        </Navbar>
        {loading ? (
          <Container>
            <span>Buscando chamados...</span>
          </Container>
        ) : visibleServices.length === 0 ? (
          <Container>
            <span>Nenhum chamado disponivel para o seu perfil.</span>
            {hasPermission('canCreateTicket') && (
              <Link to="/new">
                <FaPlus size={25} color="#fff" />
                Novo chamado
              </Link>
            )}
          </Container>
        ) : (
          <>
            {user && (
              <Container style={{ marginBottom: '16px', minHeight: 'unset', padding: '16px' }}>
                <div>
                  <strong>{user.name}</strong>
                  <p>
                    Perfil atual:{' '}
                    <strong style={{ color: getRoleColor(user.role) }}>
                      {getRoleLabel(user.role)}
                    </strong>
                  </p>
                  <p>Chamados visiveis: {visibleServices.length}</p>
                </div>
              </Container>
            )}

            {hasPermission('canCreateTicket') && (
              <ContainerBtn>
                <BtnLink to="/new">
                  <FaPlus size={25} color="#fff" />
                  Novo chamado
                </BtnLink>
              </ContainerBtn>
            )}

            <FilterBar>
              <label htmlFor="clientFilter">Empresa</label>
              <select
                id="clientFilter"
                value={selectedClient}
                onChange={(event) => setSelectedClient(event.target.value)}
              >
                <option value="todos">Todas as empresas</option>
                {clientOptions.map((client) => (
                  <option key={client} value={client}>
                    {client}
                  </option>
                ))}
              </select>
            </FilterBar>

            {Object.entries(groupedServices).map(([client, chamados]) => (
              <CompanySection key={client}>
                <h2>{client}</h2>
                <p>{chamados.length} chamado(s) registrado(s)</p>

                <Table>
                  <thead>
                    <tr>
                      <th scope="col">Cliente</th>
                      <th scope="col">Assunto</th>
                      <th scope="col">Status</th>
                      <th scope="col">Cadastrado em...</th>
                      <th scope="col">Atendido em...</th>
                      <th scope="col">#</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chamados.map((item) => (
                      <tr key={item.id}>
                        <td data-label="Cliente">{item.client}</td>
                        <td data-label="Assunto">{item.subject}</td>
                        <td data-label="Status">
                          <Badge label={item.status} color={getStatusColor(item.status)} />
                        </td>
                        <td data-label="date">{formatDate(item.created)}</td>
                        <td data-label="Atendido em">{formatDate(item.attendedAt)}</td>
                        <td data-label="date">{formatDate(item.created)}</td>
                        <td data-label="Atendido em">{formatDate(item.attendedAt)}</td>
                        <td data-label="#">
                          <button
                            type="button"
                            className="action"
                            style={{ backgroundColor: '#098de5' }}
                            onClick={() => openModal(item)}
                          >
                            <FaSearch size={17} color="#fff" />
                          </button>
                          {user && hasPermission('canEditTicket') && canPerformAction('edit', user.role, item, user.uid) && (
                            <Link
                              to={`/new/${item.id}`}
                              className="action"
                              style={{ backgroundColor: '#ff904d' }}
                            >
                              <FaEdit size={17} color="#fff" />
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CompanySection>
            ))}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </Content>
      {detail && (
        <ModalOverlay>
          <ModalContent>
            <h2>Detalhes do chamado</h2>
            <strong>Cliente</strong>
            <p>{detail.client}</p>

            <strong>Assunto</strong>
            <p>{detail.subject}</p>

            <strong>Status</strong>
            <p>{detail.status}</p>

            <strong>Data</strong>
            <p>{formatDate(detail.created)}</p>

            <strong>Atendido em</strong>
            <p>{formatDate(detail.attendedAt)}</p>

            <strong>Descricao</strong>
            <p>{detail.descriptions || 'Sem descricao informada.'}</p>

            <button type="button" onClick={closeModal}>Fechar</button>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  )
}

export default Dashboard
