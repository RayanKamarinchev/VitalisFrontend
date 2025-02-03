import React from 'react';
import {Link, NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useAuth} from "../user/AuthProvider";

const Navbar = () => {
  let isUserLogged = localStorage["token"] !== undefined;
  const auth = useAuth();
  
  return (
      <header className="p-3 mb-3 border-bottom">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <a href="/"
               className="d-flex align-items-center mb-2 mb-lg-0 link-body-emphasis text-decoration-none pe-4">
              <img src="/logo/logo.png" height="50" width="200"/>
            </a>
            
            <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 fs-5">
              <li><NavLink to="/" className="nav-link px-2">Reaction predictor</NavLink></li>
              <li><NavLink to="/mol" className="nav-link px-2">Molecule info</NavLink></li>
              {
                isUserLogged && <li><NavLink to="/tests" className="nav-link px-2">Tests</NavLink></li>
              }
            </ul>
            {
              isUserLogged ?
                  <button className="btn btn-primary" onClick={() => auth.logOut()}>Log out</button>
                  :
                  <Link to="/login" className="btn btn-primary">Login <FontAwesomeIcon
                      icon="fa-solid fa-right-to-bracket"/></Link>
            }
          
          </div>
        </div>
      </header>
      // <nav classNameName="navbar">
      //     <h1>Book store</h1>
      //     <div classNameName="links">
      //         <Link to="/">Home</Link>
      //         <Link to="/create">New Blog</Link>
      //     </div>
      // </nav>
  );
};

export default Navbar;