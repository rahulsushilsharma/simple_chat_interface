import { createContext, useEffect } from "react";
import "./App.css";
import Chat from "./pages/Chat";

function App() {
  // useEffect(() => {
  //   embeding();
  // });
  
  return <Chat />;
}
export const userContext = createContext({
  userId:"",
  userSettingsChat:{
    model:"tinyllama",
    temp:"0.7"
  }
})
export default App;
