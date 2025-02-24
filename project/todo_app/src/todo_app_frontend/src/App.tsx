import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { todo_app_backend } from "../../declarations/todo_app_backend";

function App() {
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('');

  const greet= async()=>{
    const greeting = await todo_app_backend.greet(name);
    setGreeting(greeting);
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <form className="card">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="button" onClick={greet}>Greet</button>
        <p>{greeting}</p>
      </form>
    </>
  )
}

export default App
