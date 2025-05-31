import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Ghost } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white px-4">
      <div className="text-center max-w-md">
        <Ghost className="mx-auto text-orange-500 w-16 h-16 animate-bounce mb-6" />
        <h1 className="text-6xl font-extrabold text-gray-800 mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          Oops! The page <span className="font-mono text-orange-600">{location.pathname}</span> doesn’t exist.
        </p>
        <a
          href="/"
          className="inline-block bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors"
        >
           Go back home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
