import { useState,useContext } from 'react';
import {AuthContext} from '../../contexts/auth'
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';
import Header from '../../components/Header'
import Navbar from '../../components/Navbar'

import {Content,Container,LabelAvatar,FormProfile} from './style.js'
import { FaCog,FaUpload } from "react-icons/fa";
import Avatar from '../../assets/avatar2.jpg'


const Profile = () => {
const {user,signOut, setUser ,storageUser} = useContext(AuthContext)
const [name,setName]= useState(user && user.name)
const [email,setEmail]=useState(user && user.email)
const [avatarUrl,setAvatarUrl]=useState(user && user.avatarUrl)
const [imageAvatar,setImageAvatar] = useState(null)

function handleFile(e){
  if(e.target.files[0]){
    const image = e.target.files[0]

    if(image.type === 'image/jpg' || image.type === 'image/png'){
      setImageAvatar(image)
      setAvatarUrl(URL.createObjectURL(e.target.files[0]))
      toast.success('Salvo com sucesso!')
    }else{
      toast.info('Envie uma imagem do tipo PNG ou JPG')
      setImageAvatar(null)
      return null
    }
  }
}
async function handleUpload(){
const currentUid = user.uid
const uploadTask = await firebase.storage()
.ref(`images/${currentUid}/${imageAvatar.name}`)
.put(imageAvatar)
.then(async()=>{
  toast.info('Foto enviada com sucesso!')
  await firebase.storage().ref(`images/${currentUid}`)
  .child(imageAvatar.name).getDownloadURL()
  .then(async (url)=>{
   let urlPhoto = url
    await firebase.firestore().collection('users')
    .doc(user.uid)
    .update({
      avatarUrl:urlPhoto,
      name: name
    })
    .then(()=>{
      let data ={
        ...user,
        avatarUrl: urlPhoto,
        name: name
      }
      setUser(data)
      storageUser(data)
      toast.success('Modificado com sucesso!')
    })
  })
})

}

async function handleSave(e){
 e.preventDefault()
  if(imageAvatar === null && name !== ''){
    await firebase.firestore().collection('users')
    .doc(user.uid).update({
      name: name
    })
    .then(()=>{
      let data ={
        ...user,
        name: name
      }
      setUser(data)
      storageUser(data)
      toast.success('Modificado com sucesso!')
    })
  }else if(name !== '' && imageAvatar !== null){
    handleUpload()
  }
}

  return (
    <div>
      <Header/>
      <Content>
      <Navbar title='Configurações'>
        <FaCog size={25}/>
      </Navbar>

      <Container >
        <FormProfile onSubmit={handleSave}>
          <LabelAvatar >
            <span>
              <FaUpload color='#f7f7f7' size={25}/>
            </span>
            <input type="file" accept='image/*' onChange={handleFile}  />
            {avatarUrl === null ? 
              <img src={Avatar} alt='Avatar' width='200' height='200' />  
              : <img src={avatarUrl} alt='Avatar' width='250' height='250' /> 
          }
          </LabelAvatar>

          <label htmlFor="">Nome:</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)}/>
          <label htmlFor="">Email:</label>
          <input type="text" value={email} disabled={true}/>

          <button type='submit'>Salvar</button>
        </FormProfile>
      </Container>
      <div>
          <Container>
          <button onClick={()=> signOut()}>Sair</button>
          </Container>
      </div>
      </Content>
    </div>
  )
}

export default Profile
