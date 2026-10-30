
import { Course } from './components'

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      parts: [
        { name: 'Fundamentals of React', exercises: 10 },
        { name: 'Using props to pass data', exercises: 7 },
        { name: 'State of a component', exercises: 14 },
      ],
    },
    {
      name: 'Node.js',
      parts: [
        { name: 'Routing', exercises: 3 },
        { name: 'Middleware', exercises: 7 },
      ],
    },
  ]

  return (
    <div>
      {courses.map((course) => (
        <Course key={course.name} course={course} />
      ))}
    </div>
  )
}

export default App
