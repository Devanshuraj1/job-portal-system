import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function OAuth2Success() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode(token);

      localStorage.setItem("token", token);
      localStorage.setItem("username", decoded.sub || "");
      localStorage.setItem("role", decoded.role || "USER");

      // Remove the JWT from browser history/address bar as soon as it is stored.
      window.history.replaceState({}, document.title, "/oauth2/success");

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Google OAuth token error:", error);
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div style={{ padding: "80px 20px", textAlign: "center" }}>
      Signing you in with Google...
    </div>
  );
}

export default OAuth2Success;
