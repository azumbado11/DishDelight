import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUsernameById } from "../../services";

export const useProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const {
    data: username,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["username", userId],
    queryFn: () => getUsernameById(userId),
  });

  useEffect(() => {
    /* Handle loading and error states */
    if (isLoading) {
      return;
    }

    if (isError) {
      navigate("/error", { replace: true });
      return;
    }

    if (!username?.username) {
      navigate("/error", { replace: true });
    }
  }, [isLoading, isError, username, navigate]);

  return { username, isLoading, isError };
};
