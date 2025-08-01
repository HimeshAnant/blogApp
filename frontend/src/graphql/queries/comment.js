import { gql } from "@apollo/client";

export const GET_COMMENT = gql`
  query getComment($id: ID!) {
    getComment(id: $id) {
      content
      likes
      user {
        name
        username
        id
      }
      comments
      parent {
        isBlog
        parentId
      }
      id
    }
  }
`;
