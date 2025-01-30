import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import '../css/test.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faAngleRight} from '@fortawesome/free-solid-svg-icons';
import {authGet, submitForm} from "../util/utils";
import {useAuth} from "../user/AuthProvider";
import FormInput from "../public/FormInput";
import {closedQuestion, formChoiceIdentifier, grades, groups, openQuestion} from "../util/constants";
import FormCheckbox from "../public/FormCheckbox";
import FormChoice from "../public/FormChoice";
import FormTextarea from "../public/FormTextarea";
import FormSelect from "../public/FormSelect";

function Edit() {
  const {id} = useParams();
  const auth = useAuth();
  const navigate = useNavigate()
  
  const [errors, setErrors] = useState("")
  const [test, setTest] = useState({});
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  
  const handleQuestionChange = (e) => {
    const newValue = e.target.value;
    setQuestions((prevQuestions) =>
        prevQuestions.map((question, index) =>
            index === currentQuestionIndex
                ? {...question, text: newValue}
                : question
        )
    );
  };
  const handleOpenAnswerChange = (e) => {
    const newValue = e.target.value;
    setQuestions(prevQuestions =>
        prevQuestions.map((question, index) =>
            index === currentQuestionIndex
                ? {...question, answer: newValue}
                : question
        )
    );
  };
  
  const handleOptionChange = (optionIndex, e) => {
    const newValue = e.target.value;
    setQuestions((prevQuestions) =>
        prevQuestions.map((question, index) => {
          if (index !== currentQuestionIndex) return question;
          const newOptions = [...question.options];
          newOptions[optionIndex] = newValue;
          return {...question, options: newOptions};
        })
    );
  };
  
  const handleAnswerChange = (optionIndex, e) => {
    const newValue = e.target.checked;
    setQuestions((prevQuestions) =>
        prevQuestions.map((question, index) => {
          if (index !== currentQuestionIndex) return question;
          const newAnswerIndexes = [...question.answerIndexes];
          newAnswerIndexes[optionIndex] = newValue;
          return {...question, answerIndexes: newAnswerIndexes};
        })
    );
  }
  
  const addNewClosedQuestion = () => {
    setQuestions((prev) => [...prev, closedQuestion]);
    setCurrentQuestionIndex(questions.length);
  };
  const addNewOpenQuestion = () => {
    setQuestions((prev) => [...prev, openQuestion]);
    setCurrentQuestionIndex(questions.length);
  };
  
  async function getData() {
    try {
      const resp = await authGet(
          `${process.env.REACT_APP_API_BASE_URL}tests/edit/${id}`,
          auth.token
      );
      setTest(resp.data);
      
      const loadedQuestions = [];
      let openQuestionIndex = 0;
      let closedQuestionIndex = 0;
      
      resp.data.questionsOrder.forEach((x) => {
        if (x === 0) {
          const openQuestion = {
            ...resp.data.openQuestions[openQuestionIndex],
            isOpen: true,
          };
          loadedQuestions.push(openQuestion);
          openQuestionIndex++;
        } else {
          const closedQuestion = {
            ...resp.data.closedQuestions[closedQuestionIndex],
            isOpen: false,
          };
          loadedQuestions.push(closedQuestion);
          closedQuestionIndex++;
        }
      });
      
      setQuestions(loadedQuestions);
    } catch (e) {
      console.error("Error fetching test data:", e);
    }
  }
  
  async function handleSubmitEvent(e) {
    e.preventDefault();
    let questionsModel = {
      closedQuestions: questions.filter((x) => !x.isOpen).map((x) => {
        const {isOpen, ...rest} = x;
        return rest;
      }),
      openQuestions: questions.filter((x) => x.isOpen).map((x) => {
        const {isOpen, ...rest} = x;
        return rest;
      }),
      questionsOrder: questions.map((x) => (x.isOpen ? 0 : 1)),
    };
    let model = {...test, ...questionsModel}
    setTest({...test, ...questionsModel});
    console.log(model)
    let resp = await submitForm('tests/edit/' + id, model, setErrors, auth.token);
    if (resp && resp.data === "success") {
      navigate('/tests')
    }
    setErrors("No empty fields are allowed in the test")
  }
  
  async function handleInput(e) {
    let {name, value} = e.target;
    setTest({...test, [name]: value})
    setErrors({...errors, [name]: ''});
  }
  
  useEffect(() => {
    getData();
  }, []);
  
  const currentQuestion = questions[currentQuestionIndex] || null;
  
  return (
      <div className="container game-card mb-5">
        {test && (
            <form onSubmit={handleSubmitEvent}>
              <div className="d-flex align-items-center justify-content-between">
                <button type="button"
                    className="btn arrow-btn"
                    onClick={() =>
                        setCurrentQuestionIndex((prev) => (prev > 0 ? prev - 1 : prev))
                    }
                    disabled={currentQuestionIndex === 0}
                >
                  <FontAwesomeIcon icon={faAngleLeft}/>
                </button>
                <h4>
                  Question {currentQuestionIndex + 1}/{questions.length}
                </h4>
                <button
                    type="button"
                    className="btn arrow-btn"
                    onClick={() =>
                        setCurrentQuestionIndex((prev) => (prev < questions.length - 1 ? prev + 1 : prev))
                    }
                    disabled={currentQuestionIndex === questions.length - 1}
                >
                  <FontAwesomeIcon icon={faAngleRight}/>
                </button>
              </div>
              {
                  currentQuestionIndex === -1 && (
                      <div>
                        <FormCheckbox name="isPublic" text="Is public" errors={errors} handleInput={handleInput}
                                      value={test.isPublic}/>
                        <FormInput name="title" text="Title" errors={errors} handleInput={handleInput} value={test.title}/>
                        <FormChoice name="groups" text="Groups" options={groups} handleInput={handleInput} errors={errors}
                                    value={test?.groups || ""}/>
                        <FormTextarea name="description" handleInput={handleInput} errors={errors}
                                      value={test.description}/>
                        <FormSelect name="grade" options={grades} handleInput={handleInput} errors={errors}
                                    value={test.grade}/>
                      </div>
                  )
              }
              {currentQuestion && (
                  <div className="game-content">
                    <div className="question-container">
                      <textarea
                          rows={1}
                          value={currentQuestion.text}
                          onChange={handleQuestionChange}
                          placeholder="Enter question here"
                      />
                    </div>
                    
                    {currentQuestion.isOpen ? (
                        <div className="open-answers-container">
                          <input
                              className={"answer-edit"}
                              value={currentQuestion.answer}
                              onChange={handleOpenAnswerChange}
                              placeholder="Enter answer here"
                          />
                        </div>
                    ) : (
                        <div className="answers-container">
                          {currentQuestion.options.map((option, index) => (
                              <div className="d-flex align-items-center" key={index}>
                                <input
                                    checked={currentQuestion.answerIndexes[index] || false}
                                    onChange={(e) => handleAnswerChange(index, e)}
                                    type="checkbox"
                                    className="checkbox form-check-input"
                                />
                                <input
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e)}
                                    placeholder={`Option ${index + 1}`}
                                    className="answer flex-grow-1 edit"
                                />
                              </div>
                          ))}
                        </div>
                    )}
                  </div>
              )}
              
              <div className="d-flex justify-content-end mt-3">
                <div>
                  <p className='text-danger'>{errors}</p>
                </div>
                <div className="dropdown col-2 justify-content-end d-flex">
                  <button
                      className="btn border dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                  >
                    Add question
                  </button>
                  <ul className="dropdown-menu col-2 text-start">
                    <li>
                      <button type='button' className="dropdown-item" onClick={addNewClosedQuestion}>
                        Closed question
                      </button>
                      <button type='button' className="dropdown-item" onClick={addNewOpenQuestion}>
                        Open question
                      </button>
                    </li>
                  </ul>
                </div>
                <button type='submit' className="btn btn-primary ms-3">Save</button>
              </div>
            </form>
        )}
      </div>
  );
}

export default Edit;