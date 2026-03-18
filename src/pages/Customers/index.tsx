import { FormEvent, useEffect, useState } from 'react'
import { addDoc, collection, getDocs } from 'firebase/firestore'
import { FiUser } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '../../components/Button'
import Header from '../../components/Header'
import Input from '../../components/Input'
import Navbar from '../../components/Navbar'
import { database } from '../../services/firebaseConnection'
import type { Customer } from '../../types'
import { Container, Content, FormProfile, Table, TableContainer } from './style'

const Customers = () => {
  const [nameCustomers, setNameCustomers] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [adress, setAdress] = useState('')
  const [customersList, setCustomersList] = useState<Customer[]>([])
  const [loadingCustomers, setLoadingCustomers] = useState(true)

  useEffect(() => {
    void loadCustomers()
  }, [])

  async function loadCustomers() {
    try {
      const snapshot = await getDocs(collection(database, 'customers'))
      const list: Customer[] = []

      snapshot.forEach((item) => {
        const data = item.data()

        list.push({
          id: item.id,
          nameCustomers: typeof data.nameCustomers === 'string' ? data.nameCustomers : '',
          cnpj: typeof data.cnpj === 'string' ? data.cnpj : '',
          adress: typeof data.adress === 'string' ? data.adress : ''
        })
      })

      setCustomersList(list)
    } catch (error) {
      toast.error('Erro ao buscar clientes.')
    } finally {
      setLoadingCustomers(false)
    }
  }

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (nameCustomers !== '' && cnpj !== '' && adress !== '') {
      try {
        await addDoc(collection(database, 'customers'), {
          nameCustomers,
          cnpj,
          adress
        })

        setNameCustomers('')
        setCnpj('')
        setAdress('')
        toast.info('Cadastrado com sucesso!')
        await loadCustomers()
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
        <Navbar title="Clientes">
          <FiUser size={25} />
        </Navbar>

        <Container>
          <FormProfile onSubmit={handleAdd}>
            <label>Nome Fantasia</label>
            <Input
              type="text"
              placeholder="Nome da empresa"
              value={nameCustomers}
              onChange={(e) => setNameCustomers(e.target.value)}
            />
            <label>Cnpj</label>
            <Input
              type="text"
              placeholder="CNPJ"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
            />
            <label>Endereco</label>
            <Input
              type="text"
              placeholder="Rua..."
              value={adress}
              onChange={(e) => setAdress(e.target.value)}
            />
            <Button type="submit">Cadastrar</Button>
            <Link to="/dashboard" className="btn">Voltar</Link>
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
