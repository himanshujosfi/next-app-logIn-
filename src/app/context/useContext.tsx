"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../(auth)/action.tsx/getUser";
import { LogOut } from "../(auth)/logOut/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type UserContextType = {
    user: any;
    setUser: (user: any) => void;
    logout: () => Promise<void>;
    loading: boolean;
};

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => { },
    logout: async () => { },
    loading: true,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const route = useRouter()


    useEffect(() => {
        async function fetchUser() {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error("Error restoring session:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, []);

    // Logout helper — invalidates Lucia session on server
    async function logout() {
        try {
            const res = await LogOut();
            console.log("res", res)
            if (res.error) {
                console.error(res.error);
                return;
            }
            route.push("/register");
            toast.success("User logout sucessfully ")
            localStorage.removeItem("userData")
        } catch (error) {
            console.error("Something went wrong", error);
        }
    }

    return (
        <UserContext.Provider value={{ user, setUser, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
