import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MedicalReportDemo from './components/Home'
import MedicalReportGen from './components/ReportGen'
import {
  BrowserRouter ,
  Routes,
  Route,
} from "react-router-dom";
function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={ <MedicalReportDemo/>}/>
      <Route path='/:id' element={<MedicalReportGen/>}/>
    </Routes>
    
    </BrowserRouter>
    
    </>
  )
}

export default App
