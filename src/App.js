
import './App.css';
import React, { useEffect } from 'react';
import Question from './Components/Question';
import { nanoid } from 'nanoid' 



function App() {
  const he = require('he');
  const [firstLogin, setLogin] = React.useState(true)
  const [data, setData] = React.useState([])
  const [formQuestion, setFormQuestion] = React.useState(null) //To change with options
  const [displayScore, setDispalyScore]= React.useState(0)
  const [checkedAnswers, setCheckedAnswer]= React.useState(false)
  const [toggleQuestions, setToggleQuestions] = React.useState(false)

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };
  
  useEffect(()=>{
    fetch("https://opentdb.com/api.php?amount=5&type=multiple")
    .then(res => res.json())
    .then(data1 => {
      setData(data1)
      const questionsObj = data1.results.map(question => {
        let allChoices = [...question.incorrect_answers, question.correct_answer]
        shuffleArray(allChoices)
        return {
          question: question.question, 
          correct:question.correct_answer, 
          isCorrect:false, 
          id: nanoid(), 
          value:"",
          allOptions: allChoices
        }
      })
      setFormQuestion(questionsObj)
    })
  },[toggleQuestions])
    console.log(formQuestion);

  function renderQuestions() {
    if(data.results){
      const arrayQuestions= formQuestion.map((el,index) => {

        const decodedQ = he.decode(el.question);

        return <Question 
          key= {el.id}
          id = {el.id}
          question = {decodedQ} 
          incorrect ={el.incorrect} 
          correct = {el.correct}
          handleOptions ={toggleHeld}
          name= {index}
          allOptions = {el.allOptions}
        />
      })
      return arrayQuestions
    }else {
      return <p>Wait until server respond</p>
    }
  }

  //For the options in question
  function toggleHeld(id,value) {
    setFormQuestion(prevValues => {
      return prevValues.map((el) => {
        if(id === el.id){
          if(value === el.correct){
            return{...el, value:value, isCorrect:true}
          }else return{...el, value:value,isCorrect:false}
        }else return {...el}
      })
    })
    console.log(formQuestion,"after")
  }
  function Login() {


    setLogin(prev => !prev)
  }

  function checkAnswers() {
    if(!checkedAnswers){
      let countCorrect = formQuestion.reduce((acc, obj) => obj.isCorrect === true ? acc+1 : acc, 0);
      setDispalyScore(countCorrect)

      document.querySelectorAll(".question_container").forEach((element,index)=> {
        if(formQuestion[index].isCorrect===true){
          let correct = document.createElement("span")
          correct.innerText="Correct";
          correct.setAttribute("class","correct")
          element.appendChild(correct)
        }else {
          let incorrect = document.createElement("span")
          incorrect.innerText=`Incorrect the correct answer is: ${formQuestion[index].correct}`
          incorrect.setAttribute("class","incorrect")
          element.appendChild(incorrect)
        }
      })
      let score = document.createElement("span")
      score.innerText=`Score: ${countCorrect} out of 5`
      score.setAttribute("class","score")
      document.querySelector(".main").appendChild(score)
      setCheckedAnswer(true)
    }
    else{
      document.querySelectorAll(".question_container").forEach((element,index)=> {
        let toRemove = document.querySelector("span")
        element.removeChild(toRemove)
      })
      let theSpan = document.querySelector(".score")
      document.querySelector(".main").removeChild(theSpan)
      setToggleQuestions(prev => !prev)
      setCheckedAnswer(false)
    }
  }
  
  

  
  return (
    <main className='main'>
      {firstLogin && 
        <div className='intial_screen'>
          <h1 className='title'>Quizzical</h1>
          <p>This app generates quiz questions to evaluate our knowledge made by <a href='https://github.com/Stevers1'>Esteban Serrano</a></p>
          <button className="glow-on-hover" onClick={Login}>Start Quiz!</button>
        </div>
      }
      {!firstLogin && 
        <div className='q_container'>
          {renderQuestions()}
          <button className="btn draw-border" onClick={checkAnswers}>{checkedAnswers === true ? "New Questions" : "Check Answers"}</button>
        </div>
      }
      
    </main>

  );
}

export default App;
