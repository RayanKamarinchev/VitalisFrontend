import React, {useEffect, useState} from 'react';
import {authGet, submitForm} from "../util/utils";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../user/AuthProvider";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSquareCheck, faSquareXmark} from '@fortawesome/free-solid-svg-icons';

function Review(props) {
  const {testId, userId} = useParams();
  const auth = useAuth();
  
  const [test, setTest] = useState({});
  const [questions, setQuestions] = useState([]);
  
  async function getData() {
    try {
      const resp = await authGet(
          `${process.env.REACT_APP_API_BASE_URL}tests/review/${testId}/${userId}`,
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
      console.log(loadedQuestions)
    } catch (e) {
      console.log("Error fetching test data:");
    }
  }
  
  useEffect(() => {
    getData();
  }, []);
  
  return (
      test && (
          <>
            <div>
              <h2>{test.title}</h2>
              <p>{test.description}</p>
            </div>
            {questions.map((currentQuestion, index) => (
                <div className="container game-card mb-5">
                  <div className="game-content">
                    <div className="question-container">
                      <p>{currentQuestion.text}</p>
                    </div>
                    {currentQuestion.isOpen ? (
                        <div className="open-answers-containe text-start">
                          <p className='fs-5'>{currentQuestion.correctAnswer === currentQuestion.answer ?
                              <FontAwesomeIcon className="text-success" icon={faSquareCheck}/>
                              : <FontAwesomeIcon className="text-danger" icon={faSquareXmark}/>} Your answer: {currentQuestion.answer}</p>
                          <p className='fs-5'><FontAwesomeIcon className="text-success" icon={faSquareCheck}/> Correct answer: {currentQuestion.correctAnswer}</p>
                        </div>
                    ) : (
                        <div className="answers-container">
                          {currentQuestion.options.map((option, index) => (
                              <p
                                  key={index}
                                  className={'answer edit ' + (currentQuestion.answerIndexes[index] ? 'selected ' : '')
                                      + (currentQuestion.correctAnswers.includes(index) ? 'correct' : '')}>
                                {option}
                              </p>
                          ))}
                        </div>
                    )}
                  </div>
                </div>
            ))}
          </>
      )
  );
}

export default Review;