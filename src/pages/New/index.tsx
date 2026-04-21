import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react'
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'
import { FaPlus } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '../../components/Button'
import Header from '../../components/Header'
import Input from '../../components/Input'
import Navbar from '../../components/Navbar'
import { AuthContext } from '../../contexts/auth'
import { usePermissions } from '../../hooks/usePermissions'
import { database } from '../../services/firebaseConnection'
import type { Customer, ServiceStatus, ServiceSubject, UserData } from '../../types'
import { canPerformAction } from '../../utils/rbacHelpers'
import { Container, Content, Form } from './style'

const listRef = collection(database, 'customers')

const New = () => {
  const [loadCustomers, setLoadCustomers] = useState(true)
  const [loadTechnicians, setLoadTechnicians] = useState(true)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [technicians, setTechnicians] = useState<UserData[]>([])
  const [customerSelected, setCustomerSelected] = useState(0)
  const [subject, setSubject] = useState<ServiceSubject>('Suporte')
  const [status, setStatus] = useState<ServiceStatus>('Aberto')
  const [descriptions, setDescriptions] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [attendedAt, setAttendedAt] = useState<Date | null>(null)
  const [assignedUserId, setAssignedUserId] = useState('')
  const { user } = useContext(AuthContext)
  const { permissions } = usePermissions()
  const { id } = useParams<'id'>()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      return
    }

    if (!id && !permissions.canCreateTicket) {
      toast.error('Seu perfil nao pode criar chamados.')
      navigate('/dashboard')
    }
  }, [id, navigate, permissions.canCreateTicket, user])

  useEffect(() => {
    async function loadCalled(list: Customer[], technicianList: UserData[]) {
      if (!id) {
        return
      }

      try {
        const docRef = doc(database, 'chamados', id)
        const snapshot = await getDoc(docRef)

        if (!snapshot.exists()) {
          toast.error('Chamado nao encontrado.')
          navigate('/dashboard')
          return
        }

        const data = snapshot.data()

        if (!user || !permissions.canEditTicket || !canPerformAction('edit', user.role, {
          clientId: typeof data.clientId === 'string' ? data.clientId : '',
          userId: typeof data.userId === 'string' ? data.userId : ''
        }, user.uid)) {
          toast.error('Seu perfil nao pode editar este chamado.')
          navigate('/dashboard')
          return
        }

        const customerIndex = list.findIndex(
          (item) => item.id === data.clientId || item.nameCustomers === data.client
        )

        setSubject((data.subject as ServiceSubject) || 'Suporte')
        setStatus((data.status as ServiceStatus) || 'Aberto')
        setDescriptions(typeof data.descriptions === 'string' ? data.descriptions : '')
        setAttendedAt(data.attendedAt?.toDate ? data.attendedAt.toDate() : null)
        const currentAssignedUserId = typeof data.userId === 'string' ? data.userId : ''
        const hasAssignedTechnician = technicianList.some((technician) => technician.uid === currentAssignedUserId)

        setAssignedUserId(hasAssignedTechnician ? currentAssignedUserId : '')
        setIsEdit(true)

        if (customerIndex >= 0) {
          setCustomerSelected(customerIndex)
        }
      } catch (error) {
        toast.error('Erro ao carregar o chamado.')
        navigate('/dashboard')
      }
    }

    async function loadFormData() {
      try {
        const [customersSnapshot, usersSnapshot] = await Promise.all([
          getDocs(listRef),
          getDocs(collection(database, 'users'))
        ])
        const list: Customer[] = []
        const technicianList: UserData[] = []

        customersSnapshot.forEach((item) => {
          const data = item.data()

          list.push({
            id: item.id,
            nameCustomers: typeof data.nameCustomers === 'string' ? data.nameCustomers : '',
            cnpj: typeof data.cnpj === 'string' ? data.cnpj : '',
            adress: typeof data.adress === 'string' ? data.adress : ''
          })
        })

        usersSnapshot.forEach((item) => {
          const data = item.data()

          if (data.role !== 'tecnico') {
            return
          }

          technicianList.push({
            uid: item.id,
            name: typeof data.name === 'string' ? data.name : '',
            email: typeof data.email === 'string' ? data.email : null,
            avatarUrl: typeof data.avatarUrl === 'string' ? data.avatarUrl : null,
            role: 'tecnico'
          })
        })

        setCustomers(list)
        setTechnicians(technicianList)

        if (list.length === 0) {
          return
        }

        if (id) {
          await loadCalled(list, technicianList)
        }
      } catch (error) {
        setCustomers([])
        setTechnicians([])
        toast.error('Erro ao buscar clientes.')
      } finally {
        setLoadCustomers(false)
        setLoadTechnicians(false)
      }
    }

    void loadFormData()
  }, [id, navigate, permissions.canEditTicket, user])

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!user) {
      return
    }

    if (customers.length === 0) {
      toast.info('Cadastre um cliente antes de criar um chamado.')
      return
    }

    if (technicians.length === 0) {
      toast.info('Cadastre um tecnico antes de atribuir o chamado.')
      return
    }

    if (!assignedUserId) {
      toast.info('Selecione um tecnico para atribuir o chamado.')
      return
    }

    setLoadingSubmit(true)

    try {
      const customer = customers[customerSelected]
      const chamadoData = {
        client: customer.nameCustomers,
        clientId: customer.id,
        subject,
        status,
        descriptions,
        userId: assignedUserId,
        attendedAt: status === 'Atendido'
          ? attendedAt || new Date()
          : null
      }

      if (isEdit && id) {
        await updateDoc(doc(database, 'chamados', id), chamadoData)
        toast.success('Chamado atualizado com sucesso!')
        navigate('/dashboard')
        return
      }

      await addDoc(collection(database, 'chamados'), {
        ...chamadoData,
        created: new Date()
      })

      toast.success('Chamado registrado com sucesso!')
      setDescriptions('')
      setCustomerSelected(0)
      setSubject('Suporte')
      setStatus('Aberto')
      setAttendedAt(null)
      setAssignedUserId('')
    } catch (error) {
      toast.error('Ops erro ao salvar chamado, tente mais tarde.')
    } finally {
      setLoadingSubmit(false)
    }
  }

  const handleChangeSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    setSubject(event.target.value as ServiceSubject)
  }

  const handleOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.value as ServiceStatus)
  }

  const handleChangeCustomers = (event: ChangeEvent<HTMLSelectElement>) => {
    setCustomerSelected(Number(event.target.value))
  }

  const handleChangeTechnicians = (event: ChangeEvent<HTMLSelectElement>) => {
    setAssignedUserId(event.target.value)
  }

  return (
    <>
      <Header />
      <Content>
        <Navbar title={isEdit ? 'Editando chamado' : 'Novo chamado'}>
          <FaPlus size={25} />
        </Navbar>
        <Container>
          <Form onSubmit={handleRegister}>
            <label>Cliente</label>
            {loadCustomers ? (
              <Input type="text" disabled placeholder="Carregando..." />
            ) : customers.length === 0 ? (
              <Input type="text" disabled placeholder="Nenhum cliente cadastrado" />
            ) : (
              <select value={customerSelected} onChange={handleChangeCustomers}>
                {customers.map((item, index) => (
                  <option key={item.id} value={index}>
                    {item.nameCustomers}
                  </option>
                ))}
              </select>
            )}

            <label>Assunto</label>
            <select value={subject} onChange={handleChangeSelect}>
              <option value="Suporte">Suporte</option>
              <option value="Visita Tecnica">Visita Tecnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>

            <label>Tecnico</label>
            {loadTechnicians ? (
              <Input type="text" disabled placeholder="Carregando..." />
            ) : technicians.length === 0 ? (
              <Input type="text" disabled placeholder="Nenhum tecnico cadastrado" />
            ) : (
              <select value={assignedUserId} onChange={handleChangeTechnicians}>
                <option value="">Selecione um tecnico</option>
                {technicians.map((technician) => (
                  <option key={technician.uid} value={technician.uid}>
                    {technician.name || technician.email || 'Tecnico sem nome'}
                  </option>
                ))}
              </select>
            )}

            <label>Status</label>
            <div className="status">
              <input
                type="radio"
                name="radio"
                value="Aberto"
                onChange={handleOptionChange}
                checked={status === 'Aberto'}
              />
              <span>Aberto</span>
              <input
                type="radio"
                name="radio"
                value="Progresso"
                onChange={handleOptionChange}
                checked={status === 'Progresso'}
              />
              <span>Progresso</span>
              <input
                type="radio"
                name="radio"
                value="Atendido"
                onChange={handleOptionChange}
                checked={status === 'Atendido'}
              />
              <span>Atendido</span>
            </div>
            <label>Descricao</label>
            <textarea
              placeholder="Descreva seu problema"
              value={descriptions}
              onChange={(event) => setDescriptions(event.target.value)}
            />

            <Button type="submit" disabled={loadingSubmit}>
              {loadingSubmit ? 'Salvando...' : isEdit ? 'Atualizar' : 'Registrar'}
            </Button>
            <Link to="/dashboard" className="btn">Voltar</Link>
          </Form>
        </Container>
      </Content>
    </>
  )
}

export default New
