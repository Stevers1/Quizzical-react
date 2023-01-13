
import './App.css';
import React, { useEffect } from 'react';
import Question from './Components/Question';
import { nanoid } from 'nanoid' 


function App() {
  const he = require('he');
  const [firstLogin, setLogin] = React.useState(true)
  const [data, setData] = React.useState([])
  const [isHeld,setIsHeld] = React.useState(false)
  const [formQuestion, setFormQuestion] = React.useState(null)
  
  useEffect(()=>{
    fetch("https://opentdb.com/api.php?amount=5&type=multiple")
    .then(res => res.json())
    .then(data1 => {
      setData(data1)
      const questionsObj = data1.results.map(question => {
        return {question: question.question, correct:question.correct_answer, isCorrect:false, id: nanoid(), incorrect:question.incorrect_answers}
      })
      setFormQuestion(questionsObj)
    })
  },[])
    console.log(formQuestion);

  function renderQuestions() {
    if(data.results){
      const arrayQuestions= data.results.map((el,index) => {

        const decodedQ = he.decode(el.question);

        return <Question 
          key= {nanoid()}
          id = {nanoid()}
          wholeQ = {el}
          question = {decodedQ} 
          incorrect ={el.incorrect_answers} 
          correct = {el.correct_answer}
          handleOptions ={toggleHeld}
          isHeld = {isHeld}
          name= {index}
        />
      })
      return arrayQuestions
    }else {
      return <p>Wait until server respond</p>
    }
  }

  let quest 

  //For the options in question
  function toggleHeld(id,question) {
    
  }
  function Login() {


    setLogin(prev => !prev)
  }
  
  

  
  return (
    <main>
      {firstLogin && 
        <div className='intial_screen'>
          <h1 className='title'>Quizzical</h1>
          <p>This app generates quiz questions to evaluate our knowledge made by <a href='#'>Esteban Serrano</a></p>
          <button className="glow-on-hover" onClick={Login}>Start Quiz!</button>
        </div>
      }
      {!firstLogin && 
        renderQuestions()
      }
    </main>

  );
}

export default App;
