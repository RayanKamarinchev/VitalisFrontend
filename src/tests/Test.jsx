import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import '../css/test.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

function Test() {
  const { id } = useParams();
  
  const questions = [
    {
      category: "Science",
      question: "What is the largest planet in our solar system?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"],
      answer: 2,
    },
    {
      category: "History",
      question: "Who was the first President of the United States?",
      options: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"],
      answer: 1,
    },
  ];
  
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  
  useEffect(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setProgress(0);
  }, []);
  
  const handleAnswerClick = (selectedIndex) => {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const isCorrect = selectedIndex === currentQuestion.answer;
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    
    setSelectedAnswer(selectedIndex);
    setTimeout(() => {
      if (currentQuestionIndex + 1 < shuffledQuestions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setProgress(((currentQuestionIndex + 2) / shuffledQuestions.length) * 100);
      } else {
        alert(`Game Over! Your score: ${score + (isCorrect ? 1 : 0)}`);
        setSelectedAnswer(null);
      }
    }, 1000);
  };
  
  if (shuffledQuestions.length === 0) {
    return <div>Loading...</div>;
  }
  
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  
  return (
      <div className="container">
        <div className="game-card">
          <div className="d-flex align-items-center justify-content-between">
            <button
                className="btn arrow-btn"
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
                disabled={currentQuestionIndex === 0}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <h4>Question {currentQuestionIndex + 1}/{shuffledQuestions.length}</h4>
            <button
                className="btn arrow-btn"
                onClick={() =>
                    setCurrentQuestionIndex((prev) =>
                        Math.min(prev + 1, shuffledQuestions.length - 1)
                    )
                }
                disabled={currentQuestionIndex === shuffledQuestions.length - 1}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
          </div>
          
          <header className="d-flex">
            <h2 className="col-8 offset-2">Trivia Challenge</h2>
            <h4 className="col-2 text-start">Score: {score}/{shuffledQuestions.length}</h4>
          </header>
          
          <div className="game-content">
            <div className="progress-bar">
              <div id="progress" style={{ width: `${progress}%` }} />
            </div>
            
            <div className="question-container">
              <h2>{currentQuestion.question}</h2>
            </div>
            
            <div className="answers-container">
              {currentQuestion.options.map((option, index) => (
                  <button
                      key={index}
                      className={`answer ${
                          selectedAnswer === index
                              ? index === currentQuestion.answer
                                  ? 'correct'
                                  : 'incorrect'
                              : ''
                      }`}
                      onClick={() => handleAnswerClick(index)}
                      disabled={selectedAnswer !== null}
                  >
                    {option}
                  </button>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}

export default Test;