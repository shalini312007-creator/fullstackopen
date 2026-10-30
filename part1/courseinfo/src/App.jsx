
const Course = ({ course }) => {
  return (
    <div>
      <h2>{course.name}</h2>
      {course.parts.map((part) => (
        <p key={part.id}>
          {part.name} {part.exercises}
        </p>
      ))}
      <strong>
        Total of {course.parts.reduce((sum, part) => sum + part.exercises, 0)} exercises
      </strong>
    </div>
  )
}

const App = () => {
  const courses = [
    {
      id: 1,
      name: 'Half Stack application development',
      parts: [
        { id: 1, name: 'Fundamentals of React', exercises: 10 },
        { id: 2, name: 'Using props to pass data', exercises: 7 },
        { id: 3, name: 'State of a component', exercises: 14 },
      ],
    },
  ]

  return (
    <div>
      <h1>Web development curriculum</h1>
      {courses.map((course) => (
        <Course key={course.id} course={course} />
      ))}
    </div>
  )
}

export default App
