import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation loginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      value
    }
  }
`;

export const REGISTER = gql`
  mutation registerUser(
    $name: String!
    $username: String!
    $password: String!
  ) {
    createUser(name: $name, username: $username, password: $password) {
      name
      username
      id
    }
  }
`;
