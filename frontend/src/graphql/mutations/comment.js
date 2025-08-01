import { gql } from "@apollo/client";

export const CREATE_COMMENT = gql`
  mutation createComment(
    $content: String!
    $blogOrCommentId: ID!
    $isBlog: Boolean!
  ) {
    createComment(
      content: $content
      blogOrCommentId: $blogOrCommentId
      isBlog: $isBlog
    ) {
      content
      likes
      comments
      user {
        name
        username
        id
      }
      id
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation deleteComment($id: ID!, $parId: ID!, $isBlog: Boolean!) {
    deleteComment(id: $id, parId: $parId, isBlog: $isBlog)
  }
`;

export const UPDATE_COMMENT = gql`
  mutation updateComment($id: ID!, $content: String!) {
    updateComment(id: $id, content: $content) {
      content
      likes
      comments
      parent {
        isBlog
        parentId
      }
      user {
        name
        username
        id
      }
      id
    }
  }
`;

export const LIKE_COMMENT = gql`
  mutation likeComment($id: ID!) {
    likeComment(id: $id) {
      content
      likes
      comments
      parent {
        isBlog
        parentId
      }
      user {
        name
        username
        id
      }
      id
    }
  }
`;
