import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './home/Home'
import './App.css';

function App() {
  return (
      <Router>
        <div className="App">
          {/*<Navbar/>*/}
          <div className="content">
            <Routes>
              <Route exact path="/" element={<Home/>}/>
              {/*<Route exact path="/books" element={<AllBooks/>}/>*/}
              {/*<Route exact path="/login" element={<Login/>}/>*/}
              {/*<Route exact path="/register" element={<Register/>}/>*/}
            </Routes>
          </div>
          {/*<Footer/>*/}
        </div>
      </Router>
  );
}

export default App;
