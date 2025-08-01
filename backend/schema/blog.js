import { gql } from "graphql-tag";
import { GraphQLError } from "graphql";

import Blog from "../models/blog.js";
import User from "../models/user.js";
import commentSchema from "./comment.js";

const typeDefs = gql`
  type Blog {
    title: String!
    content: String!
    likes: [ID!]!
    comments: [ID!]!
    user: User!
    id: ID!
  }

  type Query {
    getBlogs: [Blog!]!
    getBlog(id: ID!): Blog!
  }

  type Mutation {
    createBlog(title: String!, content: String!): Blog
    deleteBlog(id: ID!): Boolean
    updateBlog(id: ID!, title: String!, content: String!): Blog
    likeBlog(id: ID!): Blog
  }
`;

const resolvers = {
  Query: {
    getBlogs: async () => {
      const blogs = await Blog.find({}).populate([{ path: "user" }]);
      return blogs;
    },
    getBlog: async (root, args) => {
      const blog = await Blog.findById(args.id).populate("user");
      return blog;
    },
  },
  Mutation: {
    createBlog: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("you must be logged in to create blog", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }

      const { title, content } = args;
      const newBlog = new Blog({
        title,
        content,
        user: context.currentUser.id,
      });
      const savedBlog = await newBlog.save();

      const user = await User.findById(context.currentUser.id);
      user.blogs = user.blogs.concat(savedBlog._id);
      await user.save();

      return await savedBlog.populate("user");
    },
    deleteBlog: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("you must be logged in to create blog", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }

      const blog = await Blog.findById(args.id);
      if (!blog) {
        return true;
      }

      if (blog.user.toString() !== context.currentUser.id.toString()) {
        throw new GraphQLError("only creator of blog can delete it", {
          extensions: {
            code: "FORBIDDEN",
            http: { status: 403 },
          },
        });
      }

      for (const comment of blog.comments) {
        await commentSchema.resolvers.Mutation.deleteComment(
          root,
          { id: comment },
          context
        );
      }

      const user = await User.findById(context.currentUser.id);
      user.blogs = user.blogs.filter(
        (b) => b.toString() !== blog._id.toString()
      );

      await user.save();
      await Blog.findByIdAndDelete(blog._id);

      return true;
    },
    updateBlog: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("you must be logged in to create blog", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }

      const blog = await Blog.findById(args.id);
      if (!blog) {
        throw new GraphQLError("blog doesn't exist", {
          extensions: {
            code: "BAD_USER_INPUT",
            http: { status: 404 },
          },
        });
      }

      blog.title = args.title;
      blog.content = args.content;

      await blog.save();
      return await blog.populate("user");
    },
    likeBlog: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("you must be logged in to like blog", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }

      const blog = await Blog.findById(args.id);
      if (!blog) {
        throw new GraphQLError("blog doesn't exist", {
          extensions: {
            code: "BAD_USER_INPUT",
            http: { status: 404 },
          },
        });
      }

      const alreadyLiked = blog.likes.some(
        (userId) => userId.toString() === context.currentUser.id.toString()
      );
      if (!alreadyLiked) {
        blog.likes = blog.likes.concat(context.currentUser.id);
        await blog.save();
      } else {
        blog.likes = blog.likes.filter(
          (userId) => userId.toString() !== context.currentUser.id.toString()
        );
        await blog.save();
      }

      return await blog.populate("user");
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
