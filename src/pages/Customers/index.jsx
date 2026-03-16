import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Header from '../../components/Header'
import { FiUser } from 'react-icons/fi'
import { database } from '../../services/firebaseConnection'
import { addDoc, collection, getDocs } from 'firebase/firestore'
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom'
import { Content, Container, FormProfile, TableContainer, Table } from './style'
import Input from '../../components/Input'
import Button from '../../components/Button'

const Customers = () => {
  const [nameCustomers, setNameCustomers] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [adress, setAdress] = useState('')
  const [customersList, setCustomersList] = useState([])
  const [loadingCustomers, setLoadingCustomers] = useState(true)

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    try {
      const snapshot = await getDocs(collection(database, 'customers'))
      const list = []

      snapshot.forEach((doc) => {
        list.push({
          id: doc.id,
          nameCustomers: doc.data().nameCustomers,
          cnpj: doc.data().cnpj,
          adress: doc.data().adress
        })
      })

      setCustomersList(list)
    } catch (error) {
      toast.error('Erro ao buscar clientes.')
    } finally {
      setLoadingCustomers(false)
    }
  }

  async function handleAdd(e) {
    e.preventDefault()

    if (nameCustomers !== '' && cnpj !== '' && adress !== '') {
      try {
        await addDoc(collection(database, 'customers'), {
          nameCustomers: nameCustomers,
          cnpj: cnpj,
          adress: adress
        })

        setNameCustomers('')
        setCnpj('')
        setAdress('')
        toast.info('Cadastrado com sucesso!')
        loadCustomers()
      } catch (error) {
        toast.error('Erro ao cadastrar empresa')
      }
    } else {
      toast.error('Preencha todos os campos!')
    }
  }

  return (
    <>
      <Header />
      <Content>
        <Navbar title='Clientes'>
          <FiUser size={25} />
        </Navbar>

        <Container>
          <FormProfile onSubmit={handleAdd}>
            <label>Nome Fantasia</label>
            <Input
              type="text"
              placeholder='Nome da empresa'
              value={nameCustomers}
              onChange={e => { setNameCustomers(e.target.value) }}
            />
            <label>Cnpj</label>
            <Input
              type="text"
              placeholder='CNPJ'
              value={cnpj}
              onChange={e => { setCnpj(e.target.value) }}
            />
            <label>Endereco</label>
            <Input
              type="text"
              placeholder='Rua...'
              value={adress}
              onChange={e => { setAdress(e.target.value) }}
            />
            <Button type='submit'>Cadastrar</Button>
            <Link to='/dashboard' className='btn'>Voltar</Link>
          </FormProfile>
        </Container>

        <TableContainer>
          <h2>Clientes cadastrados</h2>
          {loadingCustomers ? (
            <p>Carregando clientes...</p>
          ) : customersList.length === 0 ? (
            <p>Nenhum cliente cadastrado ainda.</p>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CNPJ</th>
                  <th>Endereco</th>
                </tr>
              </thead>
              <tbody>
                {customersList.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nameCustomers}</td>
                    <td>{item.cnpj}</td>
                    <td>{item.adress}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </TableContainer>
      </Content>
    </>
  )
}

export default Customers
