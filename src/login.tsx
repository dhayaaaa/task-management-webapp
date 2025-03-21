import React, { useState } from "react";
import viteLogo from "/task.svg";
import "./App.css";
import google from "/Group 1171276158.svg";
import circle from "/circles_bg.svg";
import screenshot from "/Task list view 3.svg";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "./firebase-config";
import { useNavigate } from "react-router-dom";

const auth = getAuth(app);

function Login() {
  const [user, setUser] = useState<any>(null); // Define user state
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate();

  async function signInWithGoogle(): Promise<void> {
    setLoading(true); // Set loading to true
    setError(null); // Reset error state
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUser(user); // Store user information in state
      console.log("User  signed in:", user);
      navigate("/first");
    } catch (error) {
      console.error("Error signing in:", error);
      setError("Failed to sign in. Please try again."); // Set error message
    } finally {
      setLoading(false); // Reset loading state
    }
  }

  return (
    <>
      <div className="whole">
        <div className="container">
          <div className="login">
            <img src={viteLogo} className="logo" alt="TaskBuddy Logo" />
            <h1 className="title">TaskBuddy</h1>
          </div>
          <p className="description">
            Streamline your workflow and track progress effortlessly with our
            all-in-one task management app.
          </p>
          {error && <p className="error">{error}</p>}{" "}
          {/* Display error message */}
          <button
            className="google"
            onClick={signInWithGoogle}
            disabled={loading}
          >
            <img src={google} className="googlelogo" alt="Google Logo" />
            <span>{loading ? "Signing in..." : "Continue with Google"}</span>
          </button>
        </div>
        <div className="images">
          <img src={circle} className="circles" alt="Background Circles" />
        </div>
        <img src={screenshot} className="screens" alt="Task List Screenshot" />
      </div>
    </>
  );
}

export default Login;
