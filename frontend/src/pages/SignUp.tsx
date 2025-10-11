import React, { useState, type FormEvent } from "react";

interface SignUPDataI {
  username: string;
  email: string;
  password: string;
}
const SignUp = () => {
  const [signUPData, setSignUPData] = useState<SignUPDataI>({
    username: "",
    email: "",
    password: "",
  });

  const handleSignUPData = (e: FormEvent) => {
    e.preventDefault();
    console.log(signUPData);
    setSignUPData({ username: "", email: "", password: "" });
  };
  return (
    <>
      <div>
        <form onSubmit={handleSignUPData}>
          <h1>SignUP</h1>
          <input
            type="text"
            value={signUPData.username}
            placeholder="Enter your username"
            onChange={(e) =>
              setSignUPData((prev) => ({ ...prev, username: e.target.value }))
            }
          />
          <br />
          <br />
          <input
            type="email"
            placeholder="Enter your email"
            value={signUPData.email}
            onChange={(e) =>
              setSignUPData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <br />
          <br />

          <input
            type="password"
            placeholder="Enter your password"
            value={signUPData.password}
            onChange={(e) =>
              setSignUPData((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <br />
          <br />
          <input type="password" placeholder="Confirm password" />
          <br />
          <br />
          <button type="submit">SignUp</button>
        </form>
      </div>
    </>
  );
};

export default SignUp;
