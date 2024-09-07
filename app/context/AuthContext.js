"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState(null); // Default redirect path is null
  const router = useRouter();

  const createUser = async () => {
    console.log(
      "Creating new user in the database using the endpoint '/api/create-user'"
    );
    const token = await user.getIdToken();
    const uid = user.uid;
    const email = user.email;
    const name = user.displayName;
    const status = "inactive";
    const customer_id = null;
    const product_id = null;
    const variant_id = null;

    const body = JSON.stringify({
      uid,
      email,
      name,
      status,
      customer_id,
      product_id,
      variant_id,
    });

    const response = await fetch("/api/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error creating user");
    } else {
      const result = await response.json();
      console.log("User created successfully");
    }
  };

  const checkIfUserExists = async () => {
    console.log("Checking if user exists in the database");
    if (user) {
      // Check if user exists in the database by calling endpoint '/api/get-user'
      const uid = user.uid;
      const token = await user.getIdToken();
      const response = await fetch("/api/get-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid }),
      });

      if (response.status === 404) {
        // User not found in the database
        console.log("User not found, creating new user");
        // Create a new user by calling endpoint '/api/create-user'
        await createUser();
      } else if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching user.");
      } else {
        const result = await response.json();
        console.log("User exists.");
      }
    }
  };

  useEffect(() => {
    checkIfUserExists();
  }, [loading, user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      // checkIfUserExists();

      // Redirect the user if they are singed in and redirectPath is set
      if (user && redirectPath) {
        router.push(redirectPath);
        setRedirectPath(null); // Reset to default after redirect
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [router, redirectPath]);

  // Function to set redirect path dynamicaly
  const setRedirect = (path) => setRedirectPath(path);

  return (
    <AuthContext.Provider value={{ user, loading, setRedirect }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
