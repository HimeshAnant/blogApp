import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import "./index.css";
import App from "./App.jsx";
import { UserContextProvider } from "./components/UserContext.jsx";

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("blogAppGraphQL-token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const httpLink = createHttpLink({
  uri: "http://localhost:3001",
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <ApolloProvider client={client}>
        <UserContextProvider>
          <App />
        </UserContextProvider>
      </ApolloProvider>
    </Router>
  </StrictMode>
);
