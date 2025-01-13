import React, {useState} from 'react';
import FormInput from "../public/FormInput";
import {groups, grades, formChoiceIdentifier} from "../util/constants";
import FormSelect from "../public/FormSelect";
import FormTextarea from "../public/FormTextarea";
import {inBetween} from "../util/validation";
import FormChoice from "../public/FormChoice";
import FormCheckbox from "../public/FormCheckbox";
import axios from "axios";
import {convertKeysToLowercase} from "../util/utils";

function Create(props) {
  const [input, setInput] = useState({
    isPublic: false,
    title: "",
    groups: new Array(groups.length).fill(false),
    description: "",
    grade: "7",
  })
  
  const handleInput = (e) => {
    let {name, value} = e.target;
    if (name[0] === formChoiceIdentifier) {
      let [realName, index] = name.split(formChoiceIdentifier).slice(1);
      let newArray = input[realName]
      newArray[index] = value === 'on'
      name = realName
      value = newArray
    } else if (value === 'on') {
      value = true
    } else if (value === 'off') {
      value = false
    }
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
  
  async function handleSubmitEvent(e) {
    e.preventDefault();
    
    try {
      const response = await axios.post(process.env.REACT_APP_API_BASE_URL + 'tests/create', input);
    } catch (error) {
      let respErrors = error.response.data.errors
      respErrors = convertKeysToLowercase(respErrors)
      setErrors(respErrors)
    }
  }
  return (
      <div className="row">
        <div className="col-sm-12 offset-lg-2 col-lg-8 offset-xl-4 col-xl-4">
          <form onSubmit={handleSubmitEvent}>
            <FormCheckbox name="isPublic" text="Is public" errors={errors} handleInput={handleInput}/>
            <FormInput name="title" text="Title" errors={errors} handleInput={handleInput}/>
            <FormChoice name="groups" text="Groups" options={groups} handleInput={handleInput} errors={errors}/>
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