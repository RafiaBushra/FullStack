import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = (props) => {
  return(
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}

const Statistic = (props) => {
  return(
    <tbody>
      <tr>
        <td>{props.text}</td>
        <td>{props.value}</td>
      </tr>      
    </tbody>
  )
}

const Statistics = (props) => {
  if (props.all === 0) {
    return(
      <div>
        <h2>statistics</h2>
        No feedback given
      </div>
    )
  }
  return (
    <div>      
      <h2>statistics</h2>
      <table>
        <Statistic text="good" value ={props.good} />
        <Statistic text="neutral" value ={props.neutral} />
        <Statistic text="bad" value ={props.bad} />
        <Statistic text="average" value ={(props.good-props.bad)/props.all} />
        <Statistic text="positive" value ={(props.good/props.all)*100} />
      </table>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  let all = good + neutral + bad
  
  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text='good'/>
      <Button handleClick={() => setNeutral(neutral + 1)} text='neutral'/>
      <Button handleClick={() => setBad(bad + 1)} text='bad'/>
      <Statistics good={good} neutral={neutral} bad={bad} all={all}/>
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)