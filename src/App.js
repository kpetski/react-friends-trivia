import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import { DB_CONFIG } from './config/config'
import firebase from '../node_modules/firebase/app'
import '../node_modules/firebase/database'

class App extends Component {
  constructor (props) {
    super(props)
    this.app = firebase.initializeApp(DB_CONFIG)
    this.database = this.app.database().ref().child('questions')
    this.state = {
      questions: []
    }
  }

  componentWillMount () {
    let prevQuestions = this.state.questions
    this.database.on('child_added', snap => {
      prevQuestions.push({
        question: snap.val().question,
        options: snap.val().options,
        answer: snap.val().answer
      })
      this.setState({
        questions: prevQuestions
      })
    })
  }

  getQuestion () {
    const QuestionJSX =
      <div>
        {this.state.questions.map((question, index) => {
          console.log(question.question)
          return (
            <div key={index}>
              <h3>{question.question}</h3>
              {question.options.map((option, index) => {
                return <button key={index}>{`${option}`}</button>
              })}
            </div>
          )
        })}
      </div>
    return QuestionJSX
  }

  render () {
    return (
      <div>
        <header className='App App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>Friends Trivia</h1>
        </header>
        <br />
        <div className='Body'>
          {this.state.questions[0] && this.getQuestion()}
        </div>
      </div>
    )
  }
}

export default App
