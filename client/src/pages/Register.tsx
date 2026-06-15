import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";

import { registerUser } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleRegister = async () => {
    try {
      const data =
        await registerUser(
          name,
          email,
          password
        );

      if (
        data.message ===
        "User registered successfully"
      ) {
        alert(
          "Registration successful"
        );

        navigate("/");
      } else {
        alert(
          data.message
        );
      }
    } catch {
      alert(
        "Registration failed"
      );
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h2>

        <div className="space-y-4">

          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
          />

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
            text="Register"
            onClick={
              handleRegister
            }
          />

        </div>
      </div>
    </AuthLayout>
  );
}

export default Register;