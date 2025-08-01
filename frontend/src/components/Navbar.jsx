import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LoginRegisterCard from "./LoginRegisterCard";

import UserContext from "./UserContext";

const Navbar = ({ loginUser, registerUser, logoutUser }) => {
  const [userCred] = useContext(UserContext);

  const navigate = useNavigate();
  const loginDetailsRef = useRef(null);

  let authLinks = (
    <li>
      <div className="dropdown dropdown-end" ref={loginDetailsRef}>
        <div tabIndex={0} role="button">
          Login
        </div>
        <ul className="dropdown-content">
          <LoginRegisterCard
            loginUser={async (...args) => {
              await loginUser(...args);
              loginDetailsRef.current?.removeAttribute("open");
            }}
            registerUser={async (...args) => {
              await registerUser(...args);
              loginDetailsRef.current?.removeAttribute("open");
            }}
          />
        </ul>
      </div>
    </li>
  );

  if (userCred.user) {
    authLinks = (
      <li>
        <details className="dropdown dropdown-end">
          <summary>{userCred.user.name}</summary>
          <ul className="dropdown-content bg-base-100 rounded-t-none p-2 w-32">
            <li>
              <a onClick={() => navigate("/createBlog")}>create blog</a>
            </li>
            <li>
              <a onClick={() => logoutUser()}>Sign Out</a>
            </li>
          </ul>
        </details>
      </li>
    );
  }

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a onClick={() => navigate("/")} className="btn btn-ghost text-xl">
          BlogApp
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a onClick={() => navigate("/blogs")}>Blogs</a>
          </li>
          {authLinks}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
