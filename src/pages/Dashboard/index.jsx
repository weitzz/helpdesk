
import { useState, useEffect } from 'react'
import Header from '../../components/Header'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'
import { FaDesktop, FaPlus, FaSearch, FaEdit } from 'react-icons/fa'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { database } from '../../services/firebaseConnection'
import {
  Content,
  Container,
  BtnLink,
  ContainerBtn,
  FilterBar,
  CompanySection,
  Pagination,
  Table,
  ModalOverlay,
  ModalContent
} from './style'



const Dashboard = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState(null)
  const [selectedClient, setSelectedClient] = useState('todos')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    async function loadCalls() {
      try {
        const chamadosRef = collection(database, 'chamados')
        const q = query(chamadosRef, orderBy('created', 'desc'))
        const snapshot = await getDocs(q)

        const lista = snapshot.docs.map((doc) => {
          const data = doc.data()

          return {
            id: doc.id,
            client: data.client,
            clientId: data.clientId,
            subject: data.subject,
            status: data.status,
            created: data.created,
            attendedAt: data.attendedAt || null,
            descriptions: data.descriptions || '',
            userId: data.userId || ''
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

    loadCalls()
  }, [])

  function formatDate(created) {
    if (!created) {
      return '--'
    }

    const date = created.toDate ? created.toDate() : new Date(created)

    return date.toLocaleDateString('pt-BR')
  }

  function openModal(item) {
    setDetail(item)
  }

  function closeModal() {
    setDetail(null)
  }

  const clientOptions = Array.from(new Set(services.map((item) => item.client)))

  const filteredServices = selectedClient === 'todos'
    ? services
    : services.filter((item) => item.client === selectedClient)

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedClient])

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedServices = filteredServices.slice(startIndex, startIndex + itemsPerPage)

  const groupedServices = paginatedServices.reduce((acc, item) => {
    if (!acc[item.client]) {
      acc[item.client] = []
    }

    acc[item.client].push(item)
    return acc
  }, {})



  return (
    <>
    <Header/>
    <Content>
      <Navbar title='Chamados'>
        <FaDesktop size={25}/>
      </Navbar>
      {loading ? (
      <Container>
        <span>Buscando chamados...</span>
      </Container>
      ) : services.length === 0 ? (
      <Container>
        <span>Nenhum chamado registrado</span>
        <Link to='/new'>
          <FaPlus  size={25} color='#fff'/>
          Novo chamado</Link>
      </Container>
      ) : (
        <>
        <ContainerBtn>
        <BtnLink to='/new'>
          <FaPlus  size={25} color='#fff'/>
          Novo chamado</BtnLink>
        </ContainerBtn>

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
                <th scope= 'col'>Cliente</th>
                <th scope= 'col'>Assunto</th>
                <th scope= 'col'>Status</th>
                <th scope= 'col'>Cadastrado em...</th>
                <th scope= 'col'>Atendido em...</th>
                <th scope= 'col'>#</th>
              </tr>
              </thead>
              <tbody>
                {chamados.map((item) => (
                  <tr key={item.id}>
                    <td data-label='Cliente'>{item.client}</td>
                    <td data-label='Assunto'>{item.subject}</td>
                    <td data-label='Status'>
                      <span
                        className='badge'
                        style={{
                          backgroundColor: item.status === 'Aberto'
                            ? '#55ac55'
                            : item.status === 'Progresso'
                              ? '#999'
                              : '#5c5cfc'
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td data-label='date'>{formatDate(item.created)}</td>
                    <td data-label='Atendido em'>{formatDate(item.attendedAt)}</td>
                    <td data-label='#'>
                      <button
                        className='action'
                        style={{ backgroundColor: '#098de5' }}
                        onClick={() => openModal(item)}
                      >
                        <FaSearch size={17} color={'#Fff'} />
                      </button>
                      <Link
                        to={`/new/${item.id}`}
                        className='action'
                        style={{ backgroundColor: '#ff904d' }}
                      >
                        <FaEdit size={17} color={'#Fff'} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CompanySection>
        ))}

        <Pagination>
          <span>
            Pagina {currentPage} de {totalPages}
          </span>
          <div>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((page) => page + 1)}
            >
              Proxima
            </button>
          </div>
        </Pagination>
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

          <button onClick={closeModal}>Fechar</button>
        </ModalContent>
      </ModalOverlay>
    )}
    </>
  )
}

export default Dashboard
