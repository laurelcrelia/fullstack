import { useState } from 'react'

const Header = (props) => {
  console.log(props)
  return (
    <div>
      <h1>{props.header}</h1>
    </div>
  )
}

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Percentage = (props) => {
  console.log(props)
  return <p> positive {(100 * props.good) / props.all} %</p>
} 

const Statistics = (props) => {
  if (props.all === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
    <div>
      <p>good {props.good}</p>
      <p>neutral {props.neutral}</p>
      <p>bad {props.bad}</p>
      <p>all {props.all}</p>
      <p>average {props.average/props.all}</p>
      <Percentage all={props.all} good={props.good} />
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)

  return (
    <div>
      <Header header="give feedback" />
      <Button handleClick={() => setGood(good + 1) + setAll(all + 1) + setAverage(average + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1) + setAll(all + 1) + setAverage(average + 0)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1) + setAll(all + 1)+ setAverage(average -1)} text="bad" />
      <Header header="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} />
    </div>
  )
}

export default App
