// create a user context provider
import { Dispatch, SetStateAction, createContext, useState } from "react";

interface UserSettingsChat {
  model: { value: string; label: string };
  temp: number;
  vectorDbIndex:{
    value:string
    label:string
  } | null
}

interface User {
  userId: string;
  userSettingsChat: UserSettingsChat;
}


interface UserContextType {
    context: User;
    setContext: Dispatch<SetStateAction<User>>;
  }
  
  export const UserContext = createContext<UserContextType>({
    context: {
      userId: "",
      userSettingsChat: {
        model: { value: "qwen:0.5b", label: "qwen:0.5b" },
        temp: 0.7,
        vectorDbIndex: null
      },
    },
    setContext: () => {},
  });

const UserContextProvider = (props: any) => {
  const [context, setContext] = useState<User>({
    userId: "",
    userSettingsChat: {
      model: { value: "qwen:0.5b", label: "qwen:0.5b" },
      temp: 0.7,
      vectorDbIndex: null
    },
  });

  return (
    <UserContext.Provider value={{ context, setContext }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
