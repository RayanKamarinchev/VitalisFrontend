import {useState} from "react";
import {useAuth} from "./AuthProvider";
import '../css/login.css'
import {Link} from "react-router-dom";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [error, setError] = useState("")
  
  const handleInput = (e) => {
    let {name, value} = e.target;
    if (value === 'on'){
      value = true
    }else if(value === 'off'){
      value = false
    }
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };
  
  const auth = useAuth();
  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    setError(await auth.loginAction(input));
  };
  
  return (
      <div className="d-lg-flex half login">
        <div className="bg order-1 order-md-2"
             style={{backgroundImage: "url('/chemistry.jpg')"}}></div>
        <div className="contents order-2 order-md-1">
          <div className="container">
            <div className="row  justify-content-center">
              <div className="col-md-7 mt-5">
                <h3>Login to <strong style={{fontSize: "inherit"}}>Vitalis</strong></h3>
                <p className="mb-4">The best way to learn it is to practice it.</p>
                <form onSubmit={handleSubmitEvent}>
                  <div className="form-group first">
                    <label htmlFor="email">Email</label>
                    <input type="text" className="form-control" placeholder="" id="email" name="email"
                           onChange={handleInput}/>
                  </div>
                  <div className="form-group last mb-3">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" placeholder="" id="password" name="password"
                           onChange={handleInput}/>
                  </div>
                  <div className="d-flex mb-5 align-items-center">
                    <label className=" mb-0">
                      <input onChange={handleInput} name="rememberMe" id="rememberMe" type="checkbox" className="form-check-input me-1"/>
                      <span className="caption">Remember me</span>
                    </label>
                    <span className="ml-auto"><a href="#" className="forgot-pass">Forgot Password</a></span>
                  </div>
                  <div className="d-flex mb-5 flex-column text-start">
                    <p>Dont have an account? <Link to='/register'>Register</Link></p>
                    {error && <p className="text-danger">{error}</p>}
                  </div>
                  <input type="submit" value="Log In" className="btn btn-block btn-primary"/>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Login;