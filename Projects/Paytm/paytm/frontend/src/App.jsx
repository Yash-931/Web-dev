import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { Signin } from './pages/Signin'

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/signup' />
          <Route path='/signin' element={<Signin/>}/>
          <Route path='/dashboard'/>
          <Route path='/send'/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
