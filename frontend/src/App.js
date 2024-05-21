import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import {Route, Routes} from 'react-router-dom';
import Display from './components/Display';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/home' element = {<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/display'element={<Display/>}/>
      </Routes>
    </div>
  );
}

export default App;
