import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MedicalReportDemo from './components/Home'
import MedicalReportGen from './components/ReportGen'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <MedicalReportDemo/> */}
      <MedicalReportGen/>
    </>
  )
}

export default App
