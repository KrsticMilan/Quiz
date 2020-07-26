import React, { useState } from "react";
import { fetchQuizQuestions } from "./API";
//Components
import QuestionCard from "./components/QuestionCard/QuestionCard";
//Types
import { QuestionState, Difficulty, Category } from "./API";
//Styles
import { GlobalStyle, Wrapper, Settings } from "./App.styles";

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};
//const TOTAL_QUESTIONS = 10;
//const category = Math.floor(Math.random() * (32 - 9) + 9);
const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [category, setCategory] = useState(0);
  const [TOTAL_QUESTIONS, setTOTAL_QUESTIONS] = useState(1);
  const [difficulty, setDifficulty] = useState("easy");

  console.log(questions);

  const handleNumberOfQuestions = (e: React.FormEvent<HTMLInputElement>) => {
    const value = Number(e.currentTarget.value);
    setTOTAL_QUESTIONS(value);
  };

  const randomNumberOfQuestions = () => {
    const number = Math.floor(Math.random() * (50 - 1) + 1);
    setTOTAL_QUESTIONS(number);
  };

  const handleCategory = (e: React.FormEvent<HTMLInputElement>) => {
    // console.log(e.currentTarget.value);
    const value = Number(e.currentTarget.value);
    console.log(value);
    setCategory(value);
  };

  const randomCategory = () => {
    const number = Math.floor(Math.random() * (32 - 9) + 9);
    setCategory(number);
  };

  const handleDifficulty = (e: React.FormEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    setDifficulty(value);
  };

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestion = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      //Difficulty.HARD,
      difficulty,
      category
    );
    setQuestions(newQuestion);
    //error
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };

  const resetTrivia = () => {
    setGameOver(true);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value;
      const correct = questions[number].correct_answer === answer;
      if (correct) setScore((prev) => prev + 1);
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    const nextQuestion = number + 1;
    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>REACT QUIZ</h1>
        {gameOver ? (
          <Settings>
            <label htmlFor="questions">Number Of Questions: </label>
            <input
              id="questions"
              type="number"
              min="1"
              value={TOTAL_QUESTIONS}
              onChange={handleNumberOfQuestions}
            />
            <div>
              <button onClick={randomNumberOfQuestions}>Random</button>
            </div>
            <label htmlFor="category">Category: </label>
            <input
              id="category"
              type="number"
              min="0"
              max="32"
              value={category}
              onChange={handleCategory}
            />
            <div>
              <button onClick={randomCategory}>Random</button>
            </div>
            <label htmlFor="difficulty">Difficulty</label>
            <select
              name="difficulty"
              id="difficulty"
              value={difficulty}
              onChange={handleDifficulty}
            >
              <option value="easy">EASY</option>
              <option value="medium">MEDIUM</option>
              <option value="hard">HARD</option>
            </select>
            <button className="start" onClick={startTrivia}>
              Start
            </button>
          </Settings>
        ) : null}
        {!gameOver ? <p className="score">Score:{score}</p> : null}
        {loading && <p>Loading Questions ...</p>}
        {!loading && !gameOver && (
          <QuestionCard
            questionNumber={number + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}
        {!gameOver &&
        !loading &&
        userAnswers.length === number + 1 &&
        number !== TOTAL_QUESTIONS - 1 ? (
          <button className="next" onClick={nextQuestion}>
            Next Question
          </button>
        ) : null}
        {!gameOver && userAnswers.length === TOTAL_QUESTIONS ? (
          <button className="start" onClick={resetTrivia}>
            Reset
          </button>
        ) : null}
      </Wrapper>
    </>
  );
};

export default App;
