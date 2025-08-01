import { Routes, Route, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import BlogPage from "./components/BlogPage";
import Blog from "./components/Blog";

import { LOGIN, REGISTER } from "./graphql/mutations/user.js";
import { CREATE_BLOG } from "./graphql/mutations/blog.js";

import { GET_BLOGS } from "./graphql/queries/blog.js";

import UserContext from "./components/UserContext.jsx";
import { GET_USER } from "./graphql/queries/user.js";

const App = () => {
  const [userCred, userCredDispatch] = useContext(UserContext);
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();

  const meQueryResult = useQuery(GET_USER, {
    fetchPolicy: "network-only",
    skip: !userCred.token,
  });

  useEffect(() => {
    meQueryResult.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCred.token]);

  useEffect(() => {
    if (meQueryResult.data?.getUser) {
      userCredDispatch({
        type: "setUser",
        payload: meQueryResult.data.getUser,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meQueryResult.data]);

  useEffect(() => {
    const storageToken = localStorage.getItem("blogAppGraphQL-token");
    if (storageToken) {
      userCredDispatch({ type: "setToken", payload: storageToken });
    }
    userCredDispatch({ type: "setLoading", payload: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [loginMutation, loginMutationResult] = useMutation(LOGIN, {
    onError: (error) => {
      console.error(error);

      setNotification("incorrect username or password");
    },
    onCompleted: () => {
      setNotification("logged in");
    },
  });
  const loginUser = (username, password) => {
    loginMutation({ variables: { username, password } });
  };

  const logoutUser = () => {
    localStorage.removeItem("blogAppGraphQL-token");
    userCredDispatch({ type: "reset" });
  };

  useEffect(() => {
    if (loginMutationResult.data) {
      const acquiredToken = loginMutationResult.data.loginUser.value;
      userCredDispatch({ type: "setToken", payload: acquiredToken });

      localStorage.setItem("blogAppGraphQL-token", acquiredToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginMutationResult.data]);

  const [registerMutation] = useMutation(REGISTER, {
    onError: (error) => {
      console.error(error);
      setNotification("username already taken");
    },
    onCompleted: () => {
      setNotification("account created successfully! login to continue");
    },
  });
  const regiserUser = (name, username, password) => {
    registerMutation({ variables: { name, username, password } });
  };

  const [createBlogMutation] = useMutation(CREATE_BLOG, {
    onError: (error) => {
      console.error(error);
      setNotification("error in creating blog");
    },
    onCompleted: () => {
      setNotification("Successfully created Blog!");
      navigate("/blogs");
    },
    update: (cache, response) => {
      cache.updateQuery({ query: GET_BLOGS }, (prevResult) => {
        if (!prevResult.getBlogs) return prevResult;
        return {
          getBlogs: prevResult.getBlogs.concat(response.data.createBlog),
        };
      });
    },
  });
  const createBlog = (title, content) => {
    createBlogMutation({ variables: { title, content } });
  };

  const [blogs, setBlogs] = useState([]);
  const blogsResult = useQuery(GET_BLOGS);
  useEffect(() => {
    if (blogsResult.data) {
      setBlogs(blogsResult.data.getBlogs);
    }
  }, [blogsResult.data]);

  return (
    <div>
      <Navbar
        loginUser={loginUser}
        registerUser={regiserUser}
        logoutUser={logoutUser}
      />
      <Notification
        notification={notification}
        setNotification={setNotification}
      />
      <Routes>
        <Route path="" element={<HomePage />} />
        <Route
          path="/createBlog"
          element={<BlogForm createOrUpdateBlog={createBlog} />}
        />
        <Route path="/blogs" element={<BlogPage blogs={blogs} />} />
        <Route
          path="/blogs/:id"
          element={<Blog setNotification={setNotification} />}
        />
      </Routes>
    </div>
  );
};

export default App;
