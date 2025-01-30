import React from 'react';

function FormTextarea({name, handleInput, errors, placeholder = "Описание...", value}) {
    return (
        <div className="form-group">
            <label htmlFor={name}>{name}</label>
            <textarea
                name={name}
                id={name}
                rows="4"
                className="form-control"
                placeholder={placeholder}
                onChange={handleInput}
                value={value}
            />
            {errors[name] && <span className="small text-danger">{errors[name]}</span>}
        </div>
    );
}

export default FormTextarea;