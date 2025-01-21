import {Button, Card, CardBody, CardFooter, Divider, Input, Link, Spacer} from "@nextui-org/react";
import {useState} from "react";
import {EyeSlashFilledIcon} from "./EyeSlashFilledIcon";
import {EyeFilledIcon} from "./EyeFilledIcon";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function LoginPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleError = (error) => {
        if (error.response) {
            const { message, errorCode, details } = error.response.data;
            console.error(`Error: ${message} (Code: ${errorCode}) - ${details}`);
        } else {
            console.error("An unexpected error occurred:", error);
        }
    };

    const loginFun = () => {
        const inputDTO = {
            username: login,
            password: password
        };

        axios.post('http://localhost:8080/auth', inputDTO)
            .then(response => {
                const user = response.data;
                navigate("/main", { state: { user: { userId: user.id, username: user.username, email: user.email } } });
            })
            .catch(handleError);
    };

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <div className="flex justify-center items-start p-6">
            <Card className="max-w-[400px] min-w-[400px]">
                <CardBody>
                    <Input
                        isRequired
                        type="text"
                        label="Login"
                        defaultValue=""
                        onValueChange={setLogin}
                    />
                    <Spacer y={5} />
                    <Input
                        label="Password"
                        isRequired
                        endContent={
                            <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                {isVisible ? (
                                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                        type={isVisible ? "text" : "password"}
                        onValueChange={setPassword}
                    />
                </CardBody>
                <Divider />
                <CardFooter className="justify-center">
                    <div className="flex">
                        <Button onClick={loginFun} variant="flat">Login</Button>
                        <Spacer x={20} />
                        <Button as={Link} color="primary" href="/signuppage" variant="flat">
                            Sign Up
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
