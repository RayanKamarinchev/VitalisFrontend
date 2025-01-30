import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import '../css/test.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faAngleRight} from '@fortawesome/free-solid-svg-icons';
import {authGet, submitForm} from "../util/utils";
import {useAuth} from "../user/AuthProvider";
import {closedQuestion, formChoiceIdentifier, grades, groups, openQuestion} from "../util/constants";

function Edit() {
  const {id} = useParams();
  const auth = useAuth();
  const navigate = useNavigate()
  
  const [errors, setErrors] = useState("")
  const [test, setTest] = useState({});
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
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
  
  const handleClosedAnswerChange = (optionIndex, e) => {
    e.target.classList.toggle("selected")
    setQuestions((prevQuestions) =>
        prevQuestions.map((question, index) => {
          if (index !== currentQuestionIndex) return question;
          const newAnswerIndexes = [...question.answerIndexes];
          newAnswerIndexes[optionIndex] = !newAnswerIndexes[optionIndex];
          return {...question, answerIndexes: newAnswerIndexes};
        })
    );
  }
  
  async function getData() {
    try {
      const resp = await authGet(
          `${process.env.REACT_APP_API_BASE_URL}tests/take/${id}`,
          auth.token
      );
      setTest(resp.data);
      
      const loadedQuestions = [];
      let openQuestionIndex = 0;
      let closedQuestionIndex = 0;
      console.log(resp.data)
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
    let resp = await submitForm('tests/take/' + id, model, setErrors, auth.token);
    if (resp && resp.data === "success") {
      navigate('/tests/review/' + id + '/' + auth.user.id)
    }
    console.log(errors)
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
              {currentQuestion && (
                  <div className="game-content">
                    <div className="question-container">
                      <p>{currentQuestion.text}</p>
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
                        // <div className="answers-container">
                        //   {currentQuestion.options.map((option, index) => (
                        //       <div className="d-flex align-items-center" key={index}>
                        //         <input
                        //             checked={currentQuestion.answerIndexes[index] || false}
                        //             onChange={(e) => handleClosedAnswerChange(index, e)}
                        //             type="checkbox"
                        //             className="checkbox form-check-input"
                        //         />
                        //         <p className="answer flex-grow-1 edit">{option}</p>
                        //       </div>
                        //
                        //   ))}
                        // </div>
                        <div className="answers-container">
                          {currentQuestion.options.map((option, index) => (
                              <button
                                  type='button'
                                  key={index}
                                  className={'answer'}
                                  onClick={(e) => handleClosedAnswerChange(index, e)}
                                  // disabled={selectedAnswer !== null}
                              >
                                {option}
                              </button>
                          ))}
                        </div>
                    )}
                  </div>
              )}
              
              <div className="d-flex justify-content-end mt-3">
                <button type='submit' className="btn btn-primary ms-3">Submit</button>
              </div>
            </form>
        )}
      </div>
  );
}

export default Edit;