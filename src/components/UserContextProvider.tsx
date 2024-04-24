// create a user context provider
import { Dispatch, SetStateAction, createContext, useState } from "react";

export interface Model {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
  details: Details;
}

export interface Details {
  parent_model: string;
  format: string;
  family: string;
  families: string[];
  parameter_size: string;
  quantization_level: string;
}

interface UserSettingsChat {
  model?: Model;
  temp?: number;
}

interface UserContextType {
  context?: UserSettingsChat;
  setContext: Dispatch<SetStateAction<UserSettingsChat>>;
}

export const UserContext = createContext<UserContextType>({
  setContext: () => {},
});

const UserContextProvider = (props: { children: React.ReactNode }) => {
  const [context, setContext] = useState<UserSettingsChat>({});

  return (
    <UserContext.Provider value={{ context, setContext }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
