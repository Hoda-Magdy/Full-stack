import { useState } from "react";

// Button component for rendering individual feedback buttons
const Button = ({ text, onClick }) => {
  return <button onClick={onClick}>{text}</button>;
};

// StatisticLine component for rendering each statistical line
const StatisticLine = ({ text, value }) => {
  return (
    <p>
      {text}: {value}
    </p>
  );
};

// Statistics component to render all the statistics using StatisticLine
const Statistics = ({ good, neutral, bad, total, average, positivePercentage }) => {
  return (
    <div>
      <h1>Statistics</h1>
      <StatisticLine text="Good" value={good} />
      <StatisticLine text="Neutral" value={neutral} />
      <StatisticLine text="Bad" value={bad} />
      <StatisticLine text="Total" value={total} />
      <StatisticLine text="Average" value={average.toFixed(1)} />
      <StatisticLine text="Positive" value={positivePercentage} />
    </div>
  );
};

// App component to maintain the state and handle button clicks
const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const total = good + neutral + bad;
  const average = total === 0 ? 0 : (good - bad) / total;
  const positivePercentage = total === 0 ? "0%" : `${((good / total) * 100).toFixed(1)}%`;

  return (
    <div>
      <h1>Give feedback</h1>
      <Button text="Good" onClick={() => setGood(good + 1)} />
      <Button text="Neutral" onClick={() => setNeutral(neutral + 1)} />
      <Button text="Bad" onClick={() => setBad(bad + 1)} />
      
      {total > 0 ? (
        <Statistics
          good={good}
          neutral={neutral}
          bad={bad}
          total={total}
          average={average}
          positivePercentage={positivePercentage}
        />
      ) : (
        <p>No feedback given yet</p>
      )}
    </div>
  );
};

export default App;
