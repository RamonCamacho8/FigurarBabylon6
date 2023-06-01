import './App.css';

import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

import Test from "./Scenes/test"
import Tema_18 from './Tema_18_PhysicsV2';
import Tema_19 from './Tema_19_physics_Constrains';

function App() {
  return (
    <Router>
      <Routes>
          <Route exact path='/' element={<Test/>}></Route>
          <Route path='/tema_18' element={<Tema_18/>}></Route>
          <Route path='/tema_19' element={<Tema_19/>}></Route>
      </Routes>
    </Router>
)}

export default App;
