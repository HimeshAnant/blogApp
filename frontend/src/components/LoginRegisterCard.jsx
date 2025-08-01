import { useState } from "react";

const LoginRegisterCard = ({ loginUser, registerUser }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [register, setRegister] = useState(false);

  const handleSubmit = async () => {
    if (register) {
      await registerUser(name, username, password);
    } else {
      await loginUser(username, password);
    }

    setName("");
    setUsername("");
    setPassword("");
  };

  let nameInput = null;
  if (register) {
    nameInput = (
      <>
        <label className="label">Name</label>
        <input
          value={name}
          onChange={({ target }) => setName(target.value)}
          type="text"
          className="input"
          placeholder="name"
        />
      </>
    );
  }

  let registerToggle = null;

  if (register) {
    registerToggle = (
      <p className="label pt-2">
        Already have an account?
        <a
          onClick={() => setRegister(false)}
          tabIndex={0}
          className="text-secondary cursor-pointer hover:text-secondary/50"
        >
          Sign In
        </a>
      </p>
    );
  } else {
    registerToggle = (
      <p className="label pt-2">
        Don't have an account?
        <a
          onClick={() => setRegister(true)}
          tabIndex={0}
          className="text-secondary cursor-pointer hover:text-secondary/50"
        >
          Sign Up
        </a>
      </p>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-96 border p-4">
        <legend className="fieldset-legend">Login</legend>

        {nameInput}

        <label className="label">username</label>
        <input
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          type="text"
          className="input"
          placeholder="Username"
        />

        <label className="label">Password</label>
        <input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          type="password"
          className="input"
          placeholder="Password"
        />

        <button className="btn btn-secondary mt-4" onClick={handleSubmit}>
          {register ? "Sign up" : "Sign in"}
        </button>

        {registerToggle}
      </fieldset>
    </div>
  );
};

export default LoginRegisterCard;
