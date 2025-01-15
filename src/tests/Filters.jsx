import React, {useEffect, useState} from 'react';
import {formChoiceIdentifier, grades, groups, sortingOptions} from "../util/constants";
import {authGet, urlBuilder} from "../util/utils";
import '../css/sideSearch.css'

function Filters({setModel}) {
  const [input, setInput] = useState({
    sorting: 0,
    search: "",
    groups: new Array(groups.length).fill(false),
    grade: 0
  })
  
  const trigger = document.getElementById("trigger")
  const filter = document.getElementsByClassName("cd-filter")[0]
  const gallery = document.getElementsByClassName("cd-gallery")[0]
  
  function toggleClass(ref, className) {
    if (ref.classList.contains(className))
      ref.classList.remove(className);
    else
      ref.classList.add(className);
  }
  
  function onTrigger() {
    toggleClass(trigger, "filter-is-visible");
    toggleClass(filter, "filter-is-visible");
    toggleClass(gallery, "filter-is-visible");
  }
  function OnCloseOpen(e) {
    toggleClass(e.target, "closed")
    toggleClass(e.target.parentNode.children[1], "hide")
  }
  
  function handleInput(e){
    let {name, value} = e.target
    if (name[0] === formChoiceIdentifier){
      let [realName, index] = name.split(formChoiceIdentifier).slice(1);
      console.log([realName, index])
      let newArray = input[realName]
      newArray[index] = value === 'on'
      name = realName
      value = newArray
    }
    setInput({...input, [name]: value})
  }
  async function handleSubmit(e){
    e.preventDefault()
    try {
      let resp = await authGet(urlBuilder(process.env.REACT_APP_API_BASE_URL + 'tests', input))
      setModel(resp.data)
    }catch (e){
      console.log(e)
    }
  }
  
  useEffect(() => {
    [...document.querySelectorAll(".cd-filter-block h4")].map(x=>x.onclick = OnCloseOpen)
  }, []);
  
  return (
      <>
        <div className="cd-filter">
          <form onSubmit={handleSubmit}>
            <div className="cd-filter-block">
              <h4>Подредба</h4>
              <div className="cd-filter-content">
                <div className="cd-select cd-filters">
                  <select className="filter" name="Sorting" onChange={handleInput}>
                    {sortingOptions.map((x,i) => (
                      <option value={i} key={i}>{x}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="cd-filter-block">
              <h4>Потърси</h4>
              <div className="cd-filter-content">
                <input onChange={handleInput} type="search" name="SearchTerm" placeholder="Потърси..."/>
              </div>
            </div>
            
            <div className="cd-filter-block">
              <h4>Органчни групи</h4>
              <div className="cd-filter-content">
                <div className="cd-filters">
                  <div className="list-group filter">
                    {groups.map((item, index) => {
                      let checkboxName = formChoiceIdentifier + "groups" + formChoiceIdentifier + index;
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
                </div>
              </div>
            </div>
            
            <div className="cd-filter-block">
              <h4>Клас</h4>
              <div className="cd-filter-content">
                <div className="cd-select cd-filters">
                  <select className="filter" name="Grade" onChange={handleInput}>
                    <option value="0">Всички</option>
                    {grades.map((x) => (
                        <option key={x} value={x}>{`${x} клас`}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary">Приложи</button>
          </form>
          
          <a style={{cursor: 'pointer'}} className="cd-close" onClick={onTrigger}>X</a>
        </div>
        
        <a id="trigger" style={{cursor: 'pointer'}} className="cd-filter-trigger" onClick={onTrigger}>
          Филтри
        </a>
      </>
  );
}

export default Filters;