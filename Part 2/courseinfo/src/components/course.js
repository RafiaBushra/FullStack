import React from 'react';

const Header = ({ name }) => {
    return (
      <h2>{name}</h2>
    )
  }
  
  const Part = ({ part }) => {
    return (
      <p>
        {part.name} {part.exercises}
      </p>    
    )
  }
   
  const Total = ({ parts }) => {
    const sum = parts.reduce((s, currentValue) => {
      const p = currentValue.exercises
      return s + p
    }, 0)
    return(
      <p>
        <b>Total of {sum} exercises.</b>
      </p>
    ) 
  }

  const Content = ({ parts }) => {
    let elements = []
    parts.forEach(element => {
      elements.push(<Part part = {element}/>)
    })
    return elements
  }
  
  const Course = ({ course }) => {
    return (
      <div>
        <Header key={course.id} name={course.name} />
        <Content key={course.id} parts={course.parts}/>
        <Total key={course.id} parts={course.parts} />
      </div>
    )
  }

  export default Course