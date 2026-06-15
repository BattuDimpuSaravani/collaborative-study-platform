import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";

import { loginUser } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async () => {
    try {
      const data =
        await loginUser(
          email,
          password
        );

      if (data.token) {

  localStorage.setItem(
    "token",
    data.token
  );

   localStorage.setItem(
  "userId",
  data.user.id
);

  localStorage.setItem(
    "userName",
    data.user.name
  );

  navigate("/dashboard");
      } else {
        alert(
          data.message
        );
      }
    } catch {
      alert(
        "Login failed"
      );
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-3xl font-bold text-center mb-6">
          Welcome Back
        </h2>

        <div className="space-y-4">

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          <Button
            text="Login"
            onClick={
              handleLogin
            }
          />

          <p className="text-center mt-4 text-gray-600">
  Don't have an account?{" "}
  <span
    onClick={() => navigate("/register")}
    className="text-emerald-600 font-semibold cursor-pointer hover:opacity-80"
  >
    Register
  </span>
</p>

        </div>
      </div>
    </AuthLayout>
  );
}

export default Login;