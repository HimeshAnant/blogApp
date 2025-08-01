import { gql } from "@apollo/client";

export const CREATE_BLOG = gql`
  mutation createBlog($title: String!, $content: String!) {
    createBlog(title: $title, content: $content) {
      title
      likes
      comments
      id
      user {
        name
        username
        id
      }
      content
    }
  }
`;

export const DELETE_BLOG = gql`
  mutation deleteBlog($id: ID!) {
    deleteBlog(id: $id)
  }
`;

export const UPDATE_BLOG = gql`
  mutation updateBlog($id: ID!, $title: String!, $content: String!) {
    updateBlog(id: $id, title: $title, content: $content) {
      title
      likes
      comments
      id
      user {
        name
        username
        id
      }
      content
    }
  }
`;

export const LIKE_BLOG = gql`
  mutation likeBlog($id: ID!) {
    likeBlog(id: $id) {
      title
      likes
      comments
      id
      user {
        name
        username
        id
      }
      content
    }
  }
`;
