import { useState } from "react";
import {useAuth} from "./AuthProvider";
import {emailRegex} from "../util/constants";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  })
  
  const validateEmail = (email) => {
    return emailRegex.test(email);
  }
  
  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors({ ...errors, [name]: '' });
  };
  
  const auth = useAuth();
  const handleSubmitEvent = (e) => {
    e.preventDefault();
    
    let isValid = true;
    let newErrors = { email: '', password: '', general: '' };
    
    if (!input.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(input.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }
    
    if (!input.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (input.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }
    
    if (!isValid) {
      setErrors(newErrors);
      return;
    }
    auth.loginAction(input);
    
    setErrors({ email: '', password: '', general: '' });
    setInput({ email: '', password: '' });
    
  };
  
  return (
      <form onSubmit={handleSubmitEvent}>
        <div className="form_control">
          <label htmlFor="user-email">Email:</label>
          <input
              type="email"
              id="user-email"
              name="email"
              placeholder="example@yahoo.com"
              aria-describedby="user-email"
              aria-invalid="false"
              onChange={handleInput}
          />
          {errors.email && <span className="text-danger">{errors.email}</span>}
        </div>
        <div className="form_control">
          <label htmlFor="password">Password:</label>
          <input
              type="password"
              id="password"
              name="password"
              aria-describedby="user-password"
              aria-invalid="false"
              onChange={handleInput}
          />
          {errors.email && <span className="text-danger">{errors.email}</span>}
        </div>
        <button className="btn-submit">Submit</button>
      </form>
  );
};

export default Login;