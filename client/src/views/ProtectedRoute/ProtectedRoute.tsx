import { useEffect, useState, useRef } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useCheckAuth } from "../../utils/helpers";

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isLogged = useCheckAuth();
  const isMounted = useRef(true);

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!isMounted.current)
        return; /* Ensure the component is still mounted */

      if (!isLogged) {
        /* User is not logged in */
        navigate("/unauthorized", { replace: true });
      } else {
        /* User is logged in and authorized */
        setLoading(false);
      }
    };

    checkAuthorization();

    /* Cleanup function to set ref to false when component unmounts */
    return () => {
      isMounted.current = false;
    };
  }, [isLogged, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <Outlet />;
};

export default ProtectedRoute;
