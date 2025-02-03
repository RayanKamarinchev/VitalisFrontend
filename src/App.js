import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './home/Home'
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import './css/index.sass'
import Navbar from "./public/Navbar";
import Footer from "./public/Foorer";
import AuthProvider from "./user/AuthProvider";
import PrivateRoute from "./user/PrivateRoute";
import TestHomePage from "./tests/TestHomePage";
import Login from "./user/Login";
import Tests from "./tests/Tests";
import Register from "./user/Register";
import MoleculeInfo from "./mol/MoleculeInfo";
import MoleculeExp from "./mol/MoleculeExperiment";
import MoleculeExp2 from "./mol/MoleculeExperiment2";

function App() {
  return (
      <Router>
        <AuthProvider>
          <div className="App">
            <Navbar/>
            <div className="content">
              <Routes>
                <Route exact path="/" element={<Home/>}/>
                <Route exact path="/mol" element={<MoleculeExp2/>}/>
                <Route path="/tests/*" element={<PrivateRoute><Tests/></PrivateRoute>}/>
                {/*<Route exact path="/books" element={<AllBooks/>}/>*/}
                <Route exact path="/login" element={<Login/>}/>
                <Route exact path="/register" element={<Register/>}/>
                {/*<Route exact path="/register" element={<Register/>}/>*/}
              </Routes>
            </div>
            <Footer/>
          </div>
        </AuthProvider>
      </Router>
  );
}

export default App;
