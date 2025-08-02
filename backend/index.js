import { ApolloServer } from "@apollo/server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";
import express from "express";
import { expressMiddleware } from "@as-integrations/express5";
import path from "path";
import { fileURLToPath } from "url";

import schema from "./schema/index.js";
import config from "./utils/config.js";

import User from "./models/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const initServer = async () => {
  const server = new ApolloServer({
    schema,
  });

  await server.start();

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, {
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
    })
  );

  app.use(express.static(path.join(__dirname, "dist")));

  app.all("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });

  app.listen(config.PORT, () => {
    console.log(`server running on ${config.PORT}`);
  });
};

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    initServer();
  })
  .catch((error) => {
    console.error("error connecting to MongoDB", error);
  });
