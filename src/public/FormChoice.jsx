import React from 'react';
import {formChoiceIdentifier} from "../util/constants";

function FormChoice({name, text, options, handleInput}) {
  return (
      <div className="list-group">
        <p className='align-self-start'>{text}</p>
        {options.map((item, index) => {
          let checkboxName = formChoiceIdentifier + name + formChoiceIdentifier + index;
          return (
              <label className="list-group-item align-items-start text-start" htmlFor={checkboxName}>
                <input
                    type="checkbox"
                    className="form-check-input me-1"
                    name={checkboxName}
                    onChange={handleInput}
                    id={checkboxName}
                />
                {item}
              </label>
          )
        })}
      </div>
  );
}

export default FormChoice;