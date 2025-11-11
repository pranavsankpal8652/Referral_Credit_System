import { create } from "zustand";
import Cookies from "js-cookie";

type ReferredUserObj = {
  status: string;
};

type User = {
  id: string;
  name?: string;
  email?: string;
  referralCode?: string;
  credits: number;
  referredUsers?: ReferredUserObj[];
  referredUsersLength: number;
  convertedUsersLength: number;
};

type UserStore = {
  User: User | null;
  setUser: (userData: User) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  User: (() => {
    const stored = Cookies.get("user");
    return stored ? JSON.parse(stored) : null;
  })(),

  setUser: (userData) => {
    userData.referredUsersLength =
      userData.referredUsers?.filter(
        (user) => user.status === "pending" || user.status === "converted"
      ).length || 0;

    userData.convertedUsersLength =
      userData.referredUsers?.filter((user) => user.status === "converted")
        .length || 0;

    const userToStore = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      referralCode: userData.referralCode,
      credits: userData.credits,
      referredUsersLength: userData.referredUsersLength,
      convertedUsersLength: userData.convertedUsersLength,
    };

    Cookies.set("user", JSON.stringify(userToStore), { expires: 7 });
    set({ User: userToStore });
  },

  clearUser: () => {
    Cookies.remove("user");
    set({ User: null });
  },
}));
