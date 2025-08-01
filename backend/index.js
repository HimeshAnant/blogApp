import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import schema from "./schema/index.js";
import config from "./utils/config.js";

import User from "./models/user.js";

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("error connecting to MongoDB", error);
  });

const server = new ApolloServer({
  schema,
});

startStandaloneServer(server, {
  listen: { port: config.PORT },
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (!auth || !auth.startsWith("Bearer ")) {
      return { currentUser: null };
    }

    try {
      const decodedToken = jwt.verify(auth.substring(7), config.SECRET);
      const currentUser = await User.findById(decodedToken.id).lean();

      const safeUser = { ...currentUser, id: currentUser._id };

      delete safeUser.passwordHash;
      delete safeUser.__v;
      delete safeUser._id;

      return { currentUser: safeUser };
    } catch (err) {
      console.warn("Invalid token", err.message);
      return { currentUser: null };
    }
  },
}).then(({ url }) => {
  console.log(`server ready at ${url}`);
});
