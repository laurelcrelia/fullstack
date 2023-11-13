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

const StatisticLine = ({ text, value }) => (
  <tbody>
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  </tbody>
)

const Statistics = (props) => {
  if (props.all === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
    <table>
      <StatisticLine text="good" value ={props.good} />
      <StatisticLine text="neutral" value ={props.neutral} />
      <StatisticLine text="bad" value ={props.bad} />
      <StatisticLine text="all" value ={props.all} />
      <StatisticLine text="average" value ={props.average/props.all} />
      <StatisticLine text="positive" value ={(100 * props.good) / props.all + " %"} />
    </table>
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
