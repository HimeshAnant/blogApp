import { gql } from "@apollo/client";

export const GET_BLOGS = gql`
  query getBlogs {
    getBlogs {
      title
      content
      likes
      comments
      id
      user {
        name
        username
        id
      }
    }
  }
`;

export const GET_BLOG = gql`
  query getBlog($id: ID!) {
    getBlog(id: $id) {
      title
      content
      likes
      comments
      id
      user {
        name
        username
        id
      }
    }
  }
`;
