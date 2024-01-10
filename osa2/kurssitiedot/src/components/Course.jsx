const Header = ({ course }) => <h2>{course}</h2>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>


const Total = ({ parts }) => {
    const total = parts.reduce( (s,p) => s+p.exercises, 0)
    return (
      <p>
        <b>total of {total} exercises</b>
      </p>
    )
  }

const Content = ({ parts }) =>  {
    return (
      <>
      {parts.map(part=> <Part key={part.id} part={part}/> )}
    </>
    )
  }

const Course = ({ course }) =>
  <>
    <Header
      course={course.name} 
    />
    <Content
      parts={course.parts} 
    />   
    <Total
      parts={course.parts} 
    />  
  </>
  
  export default Course