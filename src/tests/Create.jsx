import React, {useState} from 'react';
import FormInput from "../public/FormInput";
import {groups, grades, minTestTitleLength, maxTestTitleLength} from "../util/constants";
import FormSelect from "../public/FormSelect";
import FormTextarea from "../public/FormTextarea";
import {inBetween} from "../util/validation";

function Create(props) {
  const [input, setInput] = useState({
    isPublic: false,
    title: "",
    groups: "",
    description: "",
    grade: "",
  })
  
  const handleInput = (e) => {
    const {name, value} = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors({...errors, [name]: ''});
  };
  
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  })
  
  function handleSubmitEvent(e) {
    const handleSubmitEvent = (e) => {
      e.preventDefault();
      
      // let newErrors = {};
      //
      // if (inBetween(input.title.length, minTestTitleLength, maxTestTitleLength)) {
      //   newErrors.title = 'Title is required';
      // }
      //
      // if (description) {
      //   newErrors.password = 'Password is required';
      // } else if (input.password.length < 8) {
      //   newErrors.password = 'Password must be at least 8 characters';
      // }
      //
      // if (Object.keys(newErrors).length > 0) {
      //   setErrors(newErrors);
      //   return;
      // }
      
      console.log(input)
      
      // setErrors({ email: '', password: '', general: '' });
      // setInput({ email: '', password: '' });
    };
  }
  
  return (
      <div className="row">
        <div className="col-sm-12 offset-lg-2 col-lg-8 offset-xl-3 col-xl-6">
          <form onSubmit={handleSubmitEvent}>
            <FormInput name="isPublic" text="Is public" type="checkbox" errors={errors} handleInput={handleInput}/>
            <FormInput name="title" text="Title" errors={errors} handleInput={handleInput}/>
            <FormSelect name="groups" options={groups} handleInput={handleInput} errors={errors}/>
            <FormTextarea name="description" handleInput={handleInput} errors={errors}/>
            <FormSelect name="grade" options={grades} handleInput={handleInput} errors={errors}/>
            <div className="text-center">
              <button className="btn btn-primary mt-3" type="submit" value="Save">Продължи</button>
            </div>
          </form>
        </div>
      </div>
  );
}

export default Create;