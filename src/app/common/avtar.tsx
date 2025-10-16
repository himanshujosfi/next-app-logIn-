import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "../context/useContext"

export default function Avtar() {
    const user = useUser()

    console.log("user ", user)
    return (
        <>
            <h2>{user?.user?.username}</h2>
            <Avatar>
                <AvatarImage src={user?.user?.profile} />
                <AvatarFallback>CN</AvatarFallback>

            </Avatar>
        </>
    )
}
