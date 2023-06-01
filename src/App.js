import './App.css';

import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

import Test from "./Scenes/Test_1"

function App() {
  return (
    <Router>
      <Routes>
          <Route exact path='/' element={<Test/>}></Route>
      </Routes>
    </Router>
)}

export default App;
