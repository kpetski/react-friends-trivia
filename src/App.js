import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import { DB_CONFIG, adminPassword} from './config/config'
import firebase from '../node_modules/firebase/app'
import '../node_modules/firebase/database'

class App extends Component {
  constructor (props) {
    super(props)
    this.app = firebase.initializeApp(DB_CONFIG)
    this.database = this.app.database().ref().child('questions')
    this.state = {
      questions: [],
      isAdmin: false,
      questionRefKey: null,
      showAlerts: true
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
          return (
            <div key={index}>
              <h3>{question.question}</h3>
              {question.options && question.options.map((option, index) => {
                return <button className='btn-primary' key={index}>{`${option}`}</button>
              })}
            </div>
          )
        })}
      </div>
    return QuestionJSX
  }

  addQuestion = (event) => {
    event.preventDefault()
    var newRef = this.database.push({
      "answer" : document.getElementById('answerInput').value,
      "options" : [ document.getElementById('questionInput').value, 
        document.getElementById('incorrect1').value ? document.getElementById('incorrect1').value : 'AddAnswerHere',
        document.getElementById('incorrect2').value ? document.getElementById('incorrect2').value : 'AddAnswerHere',
        document.getElementById('incorrect3').value ? document.getElementById('incorrect3').value : 'AddAnswerHere'],
      "question" : document.getElementById('questionInput').value
    })
    this.setState({questionRefKey :newRef.key,
      showAlerts: true})
  }

  render () {
    return (
      <div>
        <header className='App App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>{this.state.isAdmin ? 'Admin' : 'Friends Trivia'}</h1>
        </header>
        <br />
        {this.state.isAdmin === false &&
        <div className='Body'>
          {this.state.questions[0] && this.getQuestion()}
        </div>
        }
        {this.state.isAdmin &&
        <div className='Body'>
          <form id='adminForm' onSubmit={this.addQuestion}>
            <div className='form-group'>
              <h2>Add New Question</h2>
              <label htmlFor="questionInput">Question:</label>
              <input type='text' className='form-control' id='questionInput' placeholder='Question' required />
              <label htmlFor="answerInput">Answer:</label>
              <input type='text' className='form-control' id='answerInput' placeholder='Answer' required/>
              <br />
              <h2>Other Incorrect Answer Options</h2>
              <input type='text' className='form-control' id='incorrect1' placeholder='incorrect answer 1' />
              <input type='text' className='form-control' id='incorrect2' placeholder='incorrect answer 2' />
              <input type='text' className='form-control' id='incorrect3' placeholder='incorrect answer 3' />
              <br />
              <button type='submit' className='btn btn-primary'>Add</button>
            </div>
          </form>
          {this.state.questionRefKey && this.state.showAlerts && <div className="alert alert-success alert-dismissible">
            <a href="#" className="close" data-dismiss="alert" aria-label="close" onClick={() => this.setState({showAlerts: false})}>&times;</a>
            {`Success! Question has been inserted with ID:  ${this.state.questionRefKey}`}
          </div>}

        </div>
        }
        <footer className='App App-footer'>
          <button className='btn-default' onClick={() => {
            if(this.state.isAdmin === false)
            {let password = window.prompt("Please Enter Password","")
            if(password === adminPassword) {
              this.setState({isAdmin: !this.state.isAdmin})}
            } else {
              this.setState({isAdmin: !this.state.isAdmin})
            }}}>Admin</button>
        </footer>
      </div>
    )
  }
}

export default App

// onClick={() => this.setState({showAlerts: false})}
// <button className='btn-default' onClick={() => this.setState({isAdmin: !this.state.isAdmin})}>Admin</button>
      

