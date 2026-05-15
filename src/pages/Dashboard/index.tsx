import { useContext, useEffect, useState } from 'react'
import { FaDesktop, FaEdit, FaPlus, FaSearch } from 'react-icons/fa'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Header from '../../components/Header'
import Navbar from '../../components/Navbar'
import FilterOptions from '../../components/Filters/Options'
import FilterSearch from '../../components/Filters/Search'
import { FiltersContainer } from '../../components/Filters/style'
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
  ModalContent,
  ModalOverlay,
  ResultsInfo,
  OverviewGrid,
  OverviewCard,
  Table
} from './style'
import Badge from '../../components/Badge'
import Pagination from '../../components/Pagination'
import SummaryCards from '../../components/SummaryCard'

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const { hasPermission } = usePermissions()
  const [services, setServices] = useState<ServiceCall[]>([])
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<ServiceCall | null>(null)
  const [selectedClient, setSelectedClient] = useState('todos')
  const [selectedStatus, setSelectedStatus] = useState<'todos' | ServiceStatus>('todos')
  const [searchTerm, setSearchTerm] = useState('')
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
  const statusOptions = Array.from(new Set(visibleServices.map((item) => item.status)))
  const filteredServices = selectedClient === 'todos'
    ? visibleServices
    : visibleServices.filter((item) => item.client === selectedClient)
  const servicesByStatus = selectedStatus === 'todos'
    ? filteredServices
    : filteredServices.filter((item) => item.status === selectedStatus)
  const normalizedSearchTerm = searchTerm.trim().toLowerCase()
  const searchedServices = normalizedSearchTerm === ''
    ? servicesByStatus
    : servicesByStatus.filter((item) => (
      item.client.toLowerCase().includes(normalizedSearchTerm)
      || item.subject.toLowerCase().includes(normalizedSearchTerm)
      || item.descriptions.toLowerCase().includes(normalizedSearchTerm)
    ))

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedClient, selectedStatus, searchTerm])

  const totalPages = Math.max(1, Math.ceil(searchedServices.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedServices = searchedServices.slice(startIndex, startIndex + itemsPerPage)
  const openCount = searchedServices.filter((item) => item.status === 'Aberto').length
  const inProgressCount = searchedServices.filter((item) => item.status === 'Progresso').length
  const attendedCount = searchedServices.filter((item) => item.status === 'Atendido').length

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
              <div style={{ padding: '20px' }}>
                <SummaryCards title='Resumo' items={[{
                  label: "Usuário logado",
                  value: (
                    <>
                      {user?.name}{' '}
                      <strong style={{ color: getRoleColor(user.role) }}>
                        ({getRoleLabel(user.role)})
                      </strong>
                    </>
                  )
                },
                {
                  label: "Chamados visíveis",
                  value: <strong>{visibleServices.length}</strong>
                }

                ]} />
              </div>

            )}

            {hasPermission('canCreateTicket') && (
              <ContainerBtn>
                <BtnLink to="/new">
                  <FaPlus size={25} color="#fff" />
                  Novo chamado
                </BtnLink>
              </ContainerBtn>
            )}

            <FiltersContainer>
              <FilterOptions
                id="clientFilter"
                label="Empresa"
                options={clientOptions}
                selectedValue={selectedClient}
                onChange={setSelectedClient}
                defaultOptionLabel="Todas as empresas"
              />
              <FilterOptions
                id="statusFilter"
                label="Status"
                options={statusOptions}
                selectedValue={selectedStatus}
                onChange={(value) => setSelectedStatus(value as 'todos' | ServiceStatus)}
                defaultOptionLabel="Todos os status"
              />
              <FilterSearch
                id="searchFilter"
                label="Busca rapida"
                searchTerm={searchTerm}
                onSearch={setSearchTerm}
                placeholder="Buscar por cliente, assunto ou descricao"
              />
            </FiltersContainer>

            <OverviewGrid>
              <OverviewCard color={getStatusColor('Aberto')}>
                <strong>{searchedServices.length}</strong>
                <span>Chamados encontrados</span>
              </OverviewCard>
              <OverviewCard color={getStatusColor('Aberto')}>
                <strong>{openCount}</strong>
                <span>Em aberto</span>
              </OverviewCard>
              <OverviewCard color={getStatusColor('Progresso')}>
                <strong>{inProgressCount}</strong>
                <span>Em progresso</span>
              </OverviewCard>
              <OverviewCard color={getStatusColor('Atendido')}>
                <strong>{attendedCount}</strong>
                <span>Atendidos</span>
              </OverviewCard>
            </OverviewGrid>

            <CompanySection>
              <h2>Painel de chamados</h2>
              <ResultsInfo>
                Exibindo {paginatedServices.length} de {searchedServices.length} chamado(s) apos os filtros.
              </ResultsInfo>

              {searchedServices.length === 0 ? (
                <p>Nenhum chamado encontrado com os filtros aplicados.</p>
              ) : (
                <Table>
                  <thead>
                    <tr>
                      <th scope="col">Cliente</th>
                      <th scope="col">Assunto</th>
                      <th scope="col">Status</th>
                      <th scope="col">Cadastrado em</th>
                      <th scope="col">Atendido em</th>
                      <th scope="col">Acoes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedServices.map((item) => (
                      <tr key={item.id}>
                        <td data-label="Cliente">{item.client}</td>
                        <td data-label="Assunto">{item.subject}</td>
                        <td data-label="Status">
                          <Badge label={item.status} color={getStatusColor(item.status)} />
                        </td>
                        <td data-label="Cadastrado em">{formatDate(item.created)}</td>
                        <td data-label="Atendido em">{formatDate(item.attendedAt)}</td>
                        <td data-label="Acoes">
                          <button
                            type="button"
                            className="action"
                            style={{ backgroundColor: '#098de5' }}
                            onClick={() => openModal(item)}
                            aria-label={`Visualizar chamado de ${item.client}`}
                          >
                            <FaSearch size={17} color="#fff" />
                          </button>
                          {user && hasPermission('canEditTicket') && canPerformAction('edit', user.role, item, user.uid) && (
                            <Link
                              to={`/new/${item.id}`}
                              className="action"
                              style={{ backgroundColor: '#ff904d' }}
                              aria-label={`Editar chamado de ${item.client}`}
                            >
                              <FaEdit size={17} color="#fff" />
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </CompanySection>

            {searchedServices.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
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
