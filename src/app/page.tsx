"use client"

import { useRouter } from "next/navigation";
import { LogOut } from "./(auth)/logOut/action";
import { toast } from "sonner";

export default function Home() {
  const route = useRouter()
  const handleLogout = async () => {
    try {
      const res = await LogOut();

      if (res.error) {
        console.error(res.error);
        return;
      }
      route.push("/register");
      toast.success("User logout sucessfully ")
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  return (

    <div className=" text-red-400 bg-black">

      <button className="" onClick={handleLogout}>
        logOut
      </button>
    </div>

  );
}
