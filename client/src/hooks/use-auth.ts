import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

interface LoginPayload {
  username: string;
  password: string;
}

const fetchUser = async (): Promise<User | null> => {
  try {
    const token = localStorage.getItem("access_token");
    console.log("Fetched token:", token);

    if (!token) {
      // window.location.href = "/login";
      return null;
    }

    const tokenData = JSON.parse(atob(token.split(".")[1]));

    const user: User = {
      id: tokenData.user_id,
      username: tokenData.username,
      email: tokenData.email,
      firstName: tokenData.first_name,
      lastName: tokenData.last_name,
      profileImageUrl: tokenData.profile_image_url,
    };

    return user;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }

    console.log("Fetch user error:", error);
  }
};

const login = async ({ username, password }: LoginPayload) => {
  console.log("Attempting login with", username, password);
  try {
    const response = await axios.post("/api/token/", {
      username,
      password,
    });
    console.log("Login response:", response.data);

    const token = response.data.access;
    localStorage.setItem("access_token", token);
    fetchUser(); // Pre-fetch user data after login
    window.location.href = "/dashboard";
    return;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }

    console.log("Login error:", error);
  }
};

const logout = async (): Promise<void> => {
  localStorage.removeItem("access_token");
  // window.location.href = "/login";
};

export function useAuth() {
  const { data: user } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const { mutate: logoutMutation, isPending: isLoggingOut } = useMutation({
    mutationFn: logout,
  });

  const { mutate: loginMutation, isPending: isLoggingIn } = useMutation({
    mutationFn: login,
  });

  return {
    user,
    isLoading: false,
    isAuthenticated: !!user,
    logout: logoutMutation,
    login: loginMutation,
    isLoggingOut,
    isLoggingIn,
  };
}
