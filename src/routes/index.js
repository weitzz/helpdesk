import { Routes, Route } from "react-router-dom";
import Private from "./Private";
import SignIn from '../pages/SignIn'
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Customers from "../pages/Customers";
import New from "../pages/New";
const RoutesApp = () => {
  return (
    <Routes>
      <Route exact path="/" element={ <SignIn/>} />
      <Route exact path='/register' element={ <SignUp/> }/>
      <Route exact path='/dashboard' element={<Private><Dashboard/></Private>} />
      <Route exact path='/profile' element={<Private><Profile/></Private>} />
      <Route exact path='/customers' element={<Private><Customers/></Private>}  />
      <Route exact path='/new' element={<Private><New /></Private>} />
      <Route exact path='/new/:id' element={<Private><New /></Private>} />
      
    </Routes>
   
  )
}

export default RoutesApp
