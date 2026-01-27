import { useState } from 'react'

const Button = (props) => {
  const {handleClick, text} = props
  return (
      <button onClick={handleClick}>
        {text}
      </button>
  )
}

const StatisticLine = (props) => {
  const {text, value} = props
  return (
    <>
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    </>
  )
}

const Statistics = (props) => {
  const {good, neutral, bad} = props
  const all = good + neutral + bad
  const average = all === 0 ? 0 : (good - bad) / all
  const percentage = all === 0 ? 0 : (good / all) * 100
  if (all === 0) {
    return (
      <>
        <h1>statistic</h1>
        <p>No feedback given</p>
      </>
    )
  }
  return (
    <div>
      <h1>statistic</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={percentage + " %" } />
        </tbody>
      </table>
    </div>
  )
}
const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" handleClick={() => setGood(good + 1)} />
      <Button text="neutral" handleClick={() => setNeutral(neutral + 1)} />
      <Button text="bad" handleClick={() => setBad(bad + 1)} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App