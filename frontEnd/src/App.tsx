import { useEffect } from "react";
import "./App.css";
import UserContextProvider from "./components/UserContextProvider";
import Chat from "./pages/Chat";

function App() {

  async function getUsers() {
    const users = await fetch('http://localhost:8000/get_models')
    const json = await users.json()
    console.log(json)
  }

  useEffect(()=>{
    getUsers()
  },[])

  return <UserContextProvider>
    <Chat />
  </UserContextProvider>
}

export default App;
