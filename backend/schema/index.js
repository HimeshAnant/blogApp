import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";

import blogSchema from "./blog.js";
import commentSchema from "./comment.js";
import userSchema from "./user.js";

const typeDefs = mergeTypeDefs([
  blogSchema.typeDefs,
  commentSchema.typeDefs,
  userSchema.typeDefs,
]);
const resolvers = mergeResolvers([
  blogSchema.resolvers,
  commentSchema.resolvers,
  userSchema.resolvers,
]);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
