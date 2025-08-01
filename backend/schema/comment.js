import { GraphQLError } from "graphql";
import { gql } from "graphql-tag";

import Comment from "../models/comment.js";
import Blog from "../models/blog.js";
import User from "../models/user.js";

const typeDefs = gql`
  type ParentType {
    isBlog: Boolean!
    parentId: ID!
  }

  type CommentType {
    content: String!
    likes: [ID!]!
    comments: [ID!]!
    user: User!
    parent: ParentType!
    id: ID!
  }

  type Query {
    getComment(id: ID!): CommentType!
    getComments: [CommentType!]!
  }

  type Mutation {
    createComment(
      content: String!
      blogOrCommentId: ID!
      isBlog: Boolean!
    ): CommentType
    deleteComment(id: ID!, parId: ID!, isBlog: Boolean!): Boolean!
    updateComment(id: ID!, content: String!): CommentType
    likeComment(id: ID!): CommentType
  }
`;

const resolvers = {
  Query: {
    getComment: async (root, args) => {
      const commentId = args.id;
      const comment = await Comment.findById(commentId).populate("user");
      if (!comment) {
        throw new GraphQLError("comment doesn't exist", {
          extensions: {
            code: "BAD_USER_INPUT",
            http: { status: 404 },
          },
        });
      }

      return comment;
    },
    getComments: async () => {
      const comments = await Comment.find({}).populate("user");
      return comments;
    },
  },
  Mutation: {
    createComment: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("need to be logged in to create comment", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }

      const { blogOrCommentId, content, isBlog } = args;

      let blogOrComment = null;
      if (isBlog) {
        blogOrComment = await Blog.findById(blogOrCommentId);
      } else {
        blogOrComment = await Comment.findById(blogOrCommentId);
      }

      if (!blogOrComment) {
        throw new GraphQLError(
          "blog or comment to be commented on is missing",
          {
            extensions: {
              code: "BAD_USER_INPUT",
              http: { status: 400 },
            },
          }
        );
      }

      const newComment = new Comment({
        content,
        user: context.currentUser.id,
        parent: { isBlog, parentId: blogOrCommentId },
      });
      const savedComment = await newComment.save();

      const user = await User.findById(context.currentUser.id);
      user.comments = user.comments.concat(savedComment._id);
      await user.save();

      blogOrComment.comments = blogOrComment.comments.concat(savedComment._id);
      await blogOrComment.save();

      return await savedComment.populate("user");
    },
    deleteComment: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("need to be logged in to delete", {
          extensions: {
            code: "UNATHENTICATED",
            http: { status: 401 },
          },
        });
      }

      const comment = await Comment.findById(args.id);
      if (!comment) {
        return true;
      }

      if (comment.user.toString() !== context.currentUser.id.toString()) {
        throw new GraphQLError("comment can only be deleted by creator", {
          extensions: {
            code: "FORBIDDEN",
            http: { status: 403 },
          },
        });
      }

      let parentObj;
      if (comment.parent.isBlog)
        parentObj = await Blog.findById(comment.parent.parentId);
      else parentObj = await Comment.findById(comment.parent.parentId);

      parentObj.comments = parentObj.comments.filter(
        (com) => com.toString() !== comment._id.toString()
      );

      await parentObj.save();

      const queue = [comment];
      while (queue.length > 0) {
        const curComment = queue[0];
        queue.shift();
        if (!curComment) {
          continue;
        }

        for (const childCommentId of curComment.comments) {
          queue.push(await Comment.findById(childCommentId));
        }

        const curUser = await User.findById(curComment.user);
        curUser.comments = curUser.comments.filter(
          (comment) => comment.toString() !== curComment._id.toString()
        );

        await curUser.save();

        await Comment.findByIdAndDelete(curComment._id);
      }

      return true;
    },
    updateComment: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("need to be logged in to delete", {
          extensions: {
            code: "UNATHENTICATED",
            http: { status: 401 },
          },
        });
      }

      const comment = await Comment.findById(args.id);
      if (!comment) {
        throw new GraphQLError("comment doesn't exist", {
          extensions: {
            code: "BAD_USER_INPUT",
            http: { status: 404 },
          },
        });
      }

      if (comment.user.toString() !== context.currentUser.id.toString()) {
        throw new GraphQLError("comment can only be deleted by creator", {
          extensions: {
            code: "FORBIDDEN",
            http: { status: 403 },
          },
        });
      }

      comment.content = args.content;
      await comment.save();

      return await comment.populate("user");
    },
    likeComment: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("you must be logged in to like comments", {
          extensions: {
            code: "UNATHENTICATED",
            http: { status: 401 },
          },
        });
      }

      const comment = await Comment.findById(args.id);
      if (!comment) {
        throw new GraphQLError("comment doesn't exist", {
          extensions: {
            code: "BAD_USER_INPUT",
            http: { status: 404 },
          },
        });
      }

      const alreadyLiked = comment.likes.some(
        (userId) => userId.toString() === context.currentUser.id.toString()
      );
      if (!alreadyLiked) {
        comment.likes = comment.likes.concat(context.currentUser.id);
        await comment.save();
      } else {
        comment.likes = comment.likes.filter(
          (userId) => userId.toString() !== context.currentUser.id.toString()
        );
        await comment.save();
      }

      return await comment.populate("user");
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
