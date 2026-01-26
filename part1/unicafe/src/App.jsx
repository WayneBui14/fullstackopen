import { useState } from 'react'
const Statistics = (props) => {
  const {good, neutral, bad} = props
  const all = good + neutral + bad
  const average = all === 0 ? 0 : (good - bad) / all
  const percentage = all === 0 ? 0 : (good / all) * 100
  return (
    <div>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {all}</p>
      <p>average {average}</p>
      <p>positive {percentage}</p>
    </div>
  )
}
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={() => setGood(good + 1)} >Good</button>
      <button onClick={() => setNeutral(neutral + 1)} >Neutral</button>
      <button onClick={() => setBad(bad + 1)} >Bad</button>

      <h1>statistic</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App