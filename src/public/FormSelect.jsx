import React from 'react';

function FormSelect({name, options, handleInput, errors, value}) {
    return (
        <div className="form-group">
            <select
                name={name}
                id={name}
                className="form-control"
                onChange={handleInput}
                value={value}
            >
            {options.map((o, i) => (
                <option key={i} value={i} >{o}</option>
            ))}
            </select>
            {errors[name] && <span className="text-danger">{errors[name]}</span>}
        </div>
    );
}

export default FormSelect;