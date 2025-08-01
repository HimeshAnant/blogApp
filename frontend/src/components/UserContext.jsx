import { createContext, useReducer } from "react";

const userCredReducer = (state, action) => {
  if (action.type === "setToken") {
    return { token: action.payload, user: null, loading: true };
  } else if (action.type === "setUser") {
    return { token: state.token, user: action.payload, loading: false };
  } else if (action.type === "setLoading") {
    return { ...state, loading: action.payload };
  } else if (action.type === "reset") {
    return { token: null, user: null, loading: null };
  }

  return state;
};

const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [userCred, userCredDispatch] = useReducer(userCredReducer, {
    token: null,
    user: null,
    loading: true,
  });

  return (
    <UserContext.Provider value={[userCred, userCredDispatch]}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContext;
