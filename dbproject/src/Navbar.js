import {
    Navbar,
    Link,
    NavbarContent,
    NavbarItem,
    Button, User
} from "@nextui-org/react";
import {useNavigate} from "react-router-dom";

function auth(user, navigate) {
    if (user) {
        return (
            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <User
                        style={{cursor: "pointer"}}
                        name={user.username}
                        onClick={() => navigate("/hero", { state : {user : user}})}
                    />
                </NavbarItem>
                <NavbarItem>
                    <Button onClick={() => navigate("/main", { state : {user : null}})} color="primary" variant="flat">
                        Logout
                    </Button>
                </NavbarItem>
            </NavbarContent>
        )
    } else {
        return (
            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <Link href="/loginpage">Login</Link>
                </NavbarItem>
                <NavbarItem>
                    <Button as={Link} color="primary" href="/signuppage" variant="flat">
                        Sign Up
                    </Button>
                </NavbarItem>
            </NavbarContent>
        )
    }
}

export default function NavBar({ user }) {
    const navigate = useNavigate();
    return (
        <Navbar>
            {auth(user, navigate)}
        </Navbar>
    );
}