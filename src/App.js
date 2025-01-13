import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './home/Home'
import './App.css';
import Navbar from "./public/Navbar";
import Footer from "./public/Foorer";
import AuthProvider from "./user/AuthProvider";
import PrivateRoute from "./user/PrivateRoute";
import TestHomePage from "./tests/TestHomePage";
import Login from "./user/Login";
import Tests from "./Tests";
import Register from "./user/Register";

function App() {
  return (
      <Router>
        <AuthProvider>
          <div className="App">
            <Navbar/>
            <div className="content">
              <Routes>
                <Route exact path="/" element={<Home/>}/>
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
