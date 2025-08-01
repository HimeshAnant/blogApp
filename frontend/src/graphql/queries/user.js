import { gql } from "@apollo/client";

export const GET_USER = gql`
  query getUser {
    getUser {
      name
      username
      comments
      blogs {
        title
      }
      id
    }
  }
`;
