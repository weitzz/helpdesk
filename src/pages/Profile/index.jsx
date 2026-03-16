import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/auth'
import { toast } from 'react-toastify';
import Header from '../../components/Header'
import Navbar from '../../components/Navbar'
import Input from '../../components/Input'
import Button from '../../components/Button'

import { Content, Container, LabelAvatar, FormProfile } from './style.js'
import { FaCog, FaUpload } from "react-icons/fa";
import Avatar from '../../assets/avatar.png'
import { database, storage } from '../../services/firebaseConnection';
import { doc, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'


const Profile = () => {
  const { user, logout, setUser, storageUser } = useContext(AuthContext)
  const [name, setName] = useState(user && user.name)
  const [email, setEmail] = useState(user && user.email)
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
  const [imageAvatar, setImageAvatar] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setName(user?.name || '')
    setEmail(user?.email || '')
    setAvatarUrl(user?.avatarUrl || '')
  }, [user])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  function handleFile(e) {
    const image = e.target.files[0]

    if (!image) {
      return
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']

    if (!validTypes.includes(image.type)) {
      toast.info('Envie uma imagem do tipo PNG ou JPG.')
      setImageAvatar(null)
      return
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setImageAvatar(image)
    setPreviewUrl(URL.createObjectURL(image))
  }


  async function handleUpload() {
    const currentUid = user.uid
    const fileExtension = imageAvatar.name.split('.').pop()
    const uploadRef = ref(storage, `images/${currentUid}/avatar_${Date.now()}.${fileExtension}`)
    const snapshot = await uploadBytes(uploadRef, imageAvatar)
    const downloadURL = await getDownloadURL(snapshot.ref)

    return downloadURL

  }

  async function handleSave(e) {
    e.preventDefault()

    const trimmedName = name.trim()

    if (!trimmedName) {
      toast.info('Preencha o nome para continuar.')
      return
    }

    setIsSubmitting(true)

    try {
      let urlPhoto = avatarUrl || null

      if (imageAvatar) {
        urlPhoto = await handleUpload()
      }

      const docRef = doc(database, 'users', user.uid)
      await setDoc(docRef, {
        name: trimmedName,
        avatarUrl: urlPhoto
      }, { merge: true })

      const data = {
        ...user,
        name: trimmedName,
        avatarUrl: urlPhoto
      }

      setUser(data)
      storageUser(data)
      setAvatarUrl(urlPhoto)
      setImageAvatar(null)

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl('')
      }

      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      toast.error('Nao foi possivel atualizar o perfil.')
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <Header />
      <Content>
        <Navbar title='Configurações'>
          <FaCog size={25} />
        </Navbar>

        <Container >
          <FormProfile onSubmit={handleSave}>
            <LabelAvatar>
              <span>
                <FaUpload color='#f7f7f7' size={25} />
              </span>
              <input type="file" accept='image/*' onChange={handleFile} />
              <img
                src={previewUrl || avatarUrl || Avatar}
                alt='Avatar do usuario'
                width='250'
                height='250'
              />
            </LabelAvatar>

            <label htmlFor="name">Nome:</label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='Digite seu nome'
            />
            <label htmlFor="email">Email:</label>
            <Input id="email" type="text" value={email} disabled={true} />

            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar alteracoes'}
            </Button>
          </FormProfile>
        </Container>
        <div>
          <Container>
            <Button variant='outline' onClick={() => logout()}>Sair</Button>
          </Container>
        </div>
      </Content>
    </div>
  )
}

export default Profile
