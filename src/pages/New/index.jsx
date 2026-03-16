import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../../contexts/auth'
import { collection, getDocs, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
import Header from '../../components/Header'
import Navbar from '../../components/Navbar'
import { FaPlus } from 'react-icons/fa'
import { Content, Container, Form } from './style'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { database } from '../../services/firebaseConnection'
import Input from '../../components/Input'
import Button from '../../components/Button'

const listRef = collection(database, 'customers')

const New = () => {
  const [loadCustomers, setLoadCustomers] = useState(true)
  const [customers, setCustomers] = useState([])
  const [customerSelected, setCustomerSelected] = useState(0)
  const [subject, setSubject] = useState('Suporte')
  const [status, setStatus] = useState('Aberto')
  const [descriptions, setDescriptions] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [attendedAt, setAttendedAt] = useState(null)
  const { user } = useContext(AuthContext)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    async function loadCalled(list) {
      try {
        const docRef = doc(database, 'chamados', id)
        const snapshot = await getDoc(docRef)

        if (!snapshot.exists()) {
          toast.error('Chamado nao encontrado.')
          navigate('/dashboard')
          return
        }

        const data = snapshot.data()
        const customerIndex = list.findIndex(
          (item) => item.id === data.clientId || item.nameCustomers === data.client
        )

        setSubject(data.subject || 'Suporte')
        setStatus(data.status || 'Aberto')
        setDescriptions(data.descriptions || '')
        setAttendedAt(data.attendedAt || null)
        setIsEdit(true)

        if (customerIndex >= 0) {
          setCustomerSelected(customerIndex)
        }
      } catch (error) {
        toast.error('Erro ao carregar o chamado.')
        navigate('/dashboard')
      }
    }

    async function loadCustomers() {
      try {
        const snapshot = await getDocs(listRef)
        const list = []

        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            nameCustomers: doc.data().nameCustomers
          })
        })

        setCustomers(list)

        if (list.length === 0) {
          return
        }

        if (id) {
          await loadCalled(list)
        }
      } catch (error) {
        setCustomers([])
        toast.error('Erro ao buscar clientes.')
      } finally {
        setLoadCustomers(false)
      }
    }

    loadCustomers()
  }, [id, navigate])

  const handleRegister = async (event) => {
    event.preventDefault()

    if (customers.length === 0) {
      toast.info('Cadastre um cliente antes de criar um chamado.')
      return
    }

    setLoadingSubmit(true)

    try {
      const customer = customers[customerSelected]
      const chamadoData = {
        client: customer.nameCustomers,
        clientId: customer.id,
        subject: subject,
        status: status,
        descriptions: descriptions,
        userId: user.uid,
        attendedAt: status === 'Atendido'
          ? attendedAt || new Date()
          : null
      }

      if (isEdit) {
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
    } catch (error) {
      toast.error('Ops erro ao salvar chamado, tente mais tarde.')
    } finally {
      setLoadingSubmit(false)
    }
  }

  const handleChangeSelect = event => {
    setSubject(event.target.value)
  }

  const handleOptionChange = event => {
    setStatus(event.target.value)
  }

  const handleChangeCustomers = event => {
    setCustomerSelected(Number(event.target.value))
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
              <Input type='text' disabled={true} placeholder='Carregando...' />
            ) : (
              <select value={customerSelected} onChange={handleChangeCustomers}>
                {customers.map((item, index) => {
                  return (
                    <option key={item.id} value={index}>
                      {item.nameCustomers}
                    </option>
                  )
                })}
              </select>
            )}

            <label>Assunto</label>
            <select value={subject} onChange={handleChangeSelect}>
              <option value="Suporte">Suporte</option>
              <option value="Visita Tecnica">Visita Tecnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>
            <label>Status</label>
            <div className='status'>
              <input
                type="radio"
                name='radio'
                value='Aberto'
                onChange={handleOptionChange}
                checked={status === 'Aberto'}
              />
              <span>Aberto</span>
              <input
                type="radio"
                name='radio'
                value='Progresso'
                onChange={handleOptionChange}
                checked={status === 'Progresso'}
              />
              <span>Progresso</span>
              <input
                type="radio"
                name='radio'
                value='Atendido'
                onChange={handleOptionChange}
                checked={status === 'Atendido'}
              />
              <span>Atendido</span>
            </div>
            <label>Descricao</label>
            <textarea
              type='text'
              placeholder="Descreva seu problema"
              value={descriptions}
              onChange={event => setDescriptions(event.target.value)}
            />

            <Button type='submit' disabled={loadingSubmit}>
              {loadingSubmit ? 'Salvando...' : isEdit ? 'Atualizar' : 'Registrar'}
            </Button>
            <Link to='/dashboard' className='btn'>Voltar</Link>
          </Form>
        </Container>
      </Content>
    </>
  )
}

export default New
