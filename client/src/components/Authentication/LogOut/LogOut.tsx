import { useAuth } from "../useAuth.jsx";
import { useNavigate } from "react-router-dom";

function LogOut() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const logOutHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/log-out`,
        {
          credentials: "include",
        }
      );

      if (res.ok) {
        setUser(null);
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Error logging out user:", err);
      setUser(null);
      navigate("/");
    }
  };

  return <button onClick={logOutHandler}>Log Out</button>;
}

export default LogOut;
