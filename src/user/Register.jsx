import {useState} from "react";
import '../css/login.css'
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {convertKeysToLowercase, submitForm} from "../util/utils";

const Register = () => {
  const navigate = useNavigate();
  
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  })
  
  const handleInput = (e) => {
    const {name, value} = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors({...errors, [name]: ''});
  };
  
  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    await submitForm('auth/register', input, setErrors)
    try {
      await axios.post(process.env.REACT_APP_API_BASE_URL + 'auth/register', input)
      navigate("/login")
    } catch (error) {
      let respErrors = error.response.data.errors
      if (!respErrors){
        let generalErrors = error.response.data.map((err) => err.description)
        if (generalErrors.length === 0){
          generalErrors = ["Something went wrong"]
        }
        respErrors = {general: generalErrors.join("\n")}
      }
      respErrors = convertKeysToLowercase(respErrors)
      console.log(respErrors)
      setErrors(respErrors)
    }
  };
  
  return (
      <div className="d-lg-flex half login">
        <div className="bg order-1 order-md-2"
             style={{backgroundImage: "url('/chemistry.jpg')"}}></div>
        <div className="contents order-2 order-md-1">
        <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-7 mt-5 mb-5">
                <h3>Register to <strong style={{fontSize: "inherit"}}>Vitalis</strong></h3>
                <p className="mb-4">The best way to learn it is to practice it.</p>
                <form onSubmit={handleSubmitEvent}>
                  <div className="form-group first">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" placeholder="" id="name" name="name"
                           onChange={handleInput}/>
                    {errors.name && <span className="text-danger">{errors.name}</span>}
                  </div>
                  <div className="form-group first">
                    <label htmlFor="email">Email</label>
                    <input type="text" className="form-control" placeholder="" id="email" name="email"
                           onChange={handleInput}/>
                    {errors.email && <span className="text-danger">{errors.email}</span>}
                  </div>
                  <div className="form-group last mb-3">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" placeholder="" id="password" name="password"
                           onChange={handleInput}/>
                    {errors.password && <span className="text-danger">{errors.password}</span>}
                  </div>
                  <div className="form-group last mb-3">
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <input type="password" className="form-control" placeholder="" id="confirmPassword"
                           name="confirmPassword"
                           onChange={handleInput}/>
                    {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword}</span>}
                  </div>
                  <div className="d-flex mb-5 flex-column text-start">
                    <p>Already have an account? <Link to='/login'>Log in</Link></p>
                    {errors.general && <p className="text-danger">{errors.general}</p>}
                  </div>
                  <input type="submit" value="Register" className="btn btn-block btn-primary"/>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Register;