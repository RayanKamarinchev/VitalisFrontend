import React from 'react';

function FormInput({errors, handleInput, text, name, type, value = ""}) {
  return (
      <div className="form-group">
        <label htmlFor={name}>{text}</label>
        <input
            type={type}
            id={name}
            name={name}
            onChange={handleInput}
            className='form-control'
            value={value}
        />
        {errors[name] && <span className="text-danger">{errors[name]}</span>}
      </div>
  );
}

export default FormInput;