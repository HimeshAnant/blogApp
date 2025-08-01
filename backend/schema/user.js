import { gql } from "graphql-tag";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "../models/user.js";
import config from "../utils/config.js";

const typeDefs = gql`
  type User {
    name: String!
    username: String!
    comments: [ID!]!
    blogs: [Blog!]!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    getUsers: [User!]!
    getUser: User
  }

  type Mutation {
    createUser(name: String!, username: String!, password: String!): User
    loginUser(username: String!, password: String!): Token
  }
`;

const resolvers = {
  Query: {
    getUsers: async () => {
      const users = await User.find({}).populate("blogs");
      return users;
    },
    getUser: async (root, args, context) => {
      if (!context.currentUser) return null;

      const user = await User.findById(context.currentUser.id);
      return await user.populate("blogs");
    },
  },
  Mutation: {
    createUser: async (root, args) => {
      const { name, username, password } = args;
      if (!password) {
        throw new GraphQLError("missing arguments", {
          extensions: {
            code: "BAD_USER_INPUT",
            http: { status: 400 },
          },
        });
      }

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const newUser = new User({ name, username, passwordHash });
      const savedUser = await newUser.save();

      return savedUser;
    },
    loginUser: async (root, args) => {
      const { username, password } = args;

      const user = await User.findOne({ username });
      const passwordCorrect = user
        ? await bcrypt.compare(password, user.passwordHash)
        : false;

      if (!passwordCorrect) {
        throw new GraphQLError("Invalid username or password", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      const token = jwt.sign(userForToken, config.SECRET);
      return {
        value: token,
      };
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
