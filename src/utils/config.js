const getBackendURL = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    // Strip trailing /api if present to get base URL
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, "");
  }
  return "http://localhost:5000";
};

export const BACKEND_URL = getBackendURL();
export const API_URL = `${BACKEND_URL}/api`;
