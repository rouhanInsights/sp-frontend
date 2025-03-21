const BASE_URL = "http://127.0.0.1:8000"; 

// Store token in localStorage
function saveToken(token) {
  localStorage.setItem("access_token", token);
}

// Retrieve token
function getToken() {
  return localStorage.getItem("access_token");
}

// User Signup
export async function signUp(userData) {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return response.json();
}

// User Login (Saves JWT Token)
export async function login(userData) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (response.ok) {
    saveToken(data.access_token);
  }
  return data;
}

// Logout Function (Deletes Token)
export function logout() {
  localStorage.removeItem("access_token");
  window.location.href = "/login";
}


// Get Logged-In User Info (Protected API)
export async function getUserInfo() {
  const token = localStorage.getItem("access_token");
  if (!token) return { detail: "No token found" };

  const response = await fetch("http://127.0.0.1:8000/users/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}

//password reset
// export async function requestPasswordReset(email) {
//   const response = await fetch("http://127.0.0.1:8000/auth/forgot-password", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ email }),
//   });

//   return response.json();
// }
// export async function resetPassword(data) {
//   const response = await fetch("http://127.0.0.1:8000/auth/reset-password", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   return response.json();
// }
