import { useContext } from "react";
import { Route, Redirect } from "react-router";
import {AuthContext} from '../contexts/auth'

const RouteWrapper = ({
component: Component,
isPrivate,
...rest
}) => {

  const {signed,loading}= useContext(AuthContext)
 // const loading = false
  //const signed = false //NAO TA LOGADO

  // SE ESTIVER CARREGANDO...APARECER A DIV
  if(loading){
    return(
      <div></div>
    )
  }
  //SE ELE NAO ESTA LOGADO E A ROTA QUE ELE QUER É PRIVADA
  // REDIRECIONA PARA ROTA PRINCIPAL
  if(!signed && isPrivate){
    return <Redirect to='/' />
  } 
  // SE ESTA LOGADO E A ROTA NAO É PRIVADA
  // REDIRECIONA PARA O DASHBOARD
  if(signed && !isPrivate ){
    return  <Redirect to='/dashboard' />
  }
  return(
    <Route
    {...rest}
    render={props =>(
      <Component {...props}/>
    )}
     />
  )
}

export default RouteWrapper
