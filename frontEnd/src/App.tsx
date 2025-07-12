import "./App.css";
import Chat from "./pages/Chat";
import UserContextProvider from "./components/UserContextProvider";

function App() {

  return <UserContextProvider>
    <Chat />
  </UserContextProvider>
}

export default App;
