const Header = ({ courseName }) => {
  return <h2>{courseName}</h2>;
};

const Part = ({ name, exercises }) => {
  return (
    <p>
      {name}: {exercises} exercises
    </p>
  );
};

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => (
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      ))}
    </div>
  );
};

const Course = ({ course }) => {
  return (
    <div>
      <Header courseName={course.name} />
      <Content parts={course.parts} />
    </div>
  );
};

const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      { name: 'Fundamentals of React', exercises: 10, id: 1 },
      { name: 'Using props to pass data', exercises: 7, id: 2 },
      { name: 'State of a component', exercises: 14, id: 3 },
      { name: 'Redux', exercises: 11, id: 4 }
    ]
  };

  return (
    <div>
      <Course course={course} />
    </div>
  );
};

export default App;
