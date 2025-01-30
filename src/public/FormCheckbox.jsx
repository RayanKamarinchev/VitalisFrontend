import React from 'react';

function FormCheckbox({errors, handleInput, text, name, value}) {
  return (
      <div className="form-group flex-row">
        <label htmlFor={name} style={{marginRight: "10px"}}>{text}</label>
        <input
            type="checkbox"
            id={name}
            name={name}
            onChange={handleInput}
            className="form-check-input me-1"
            value={value}
        />
        {errors[name] && <span className="text-danger">{errors[name]}</span>}
      </div>
  );
}

export default FormCheckbox;