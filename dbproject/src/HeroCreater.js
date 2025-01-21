import {Button, Card, CardBody, CardFooter, Divider, Input, Select, SelectItem, Spacer} from "@nextui-org/react";
import {useEffect, useState} from "react";
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";
import NavBar from "./Navbar";

export default function HeroCreater() {
    const [name, setName] = useState("");
    const [age, setAge] = useState(0);
    const [currentHp, setCurrentHp] = useState(0);
    const [xp, setXp] = useState(0);
    const [heroClass, setHeroClass] = useState(null);
    const [classes, setClasses] = useState([]);
    const [level, setLevel] = useState(null);
    const navigate = useNavigate();

    let {user} = useLocation().state;

    const handleError = (error) => {
        if (error.response) {
            const { message, errorCode, details } = error.response.data;
            console.error(`Error: ${message} (Code: ${errorCode}) - ${details}`);
        } else {
            console.error("An unexpected error occurred:", error);
        }
    };

    useEffect(() => {
        axios.get(`http://localhost:8080/classes`)
            .then(response => {
                setClasses(response.data);
            })
            .catch(error => {
                handleError(error);
            });

        axios.get(`http://localhost:8080/levels`)
            .then(response => {
                setLevel(response.data[0]); // Assuming first level is default
            })
            .catch(error => {
                handleError(error);
            });
    }, []);

    const createHero = () => {
        const heroData = {
            name: name,
            age: age,
            currentHp: currentHp,
            xp: xp,
            level: level,
            user: {
                id: user.userId,
                username: user.username,
                email: user.email
            },
            clazz: heroClass
        };

        axios.post('http://localhost:8080/heroes', heroData)
            .then(() => {
                navigate("/main", { state: { user: user } });
            })
            .catch(error => {
                handleError(error);
            });
    };

    return (
        <div>
            <NavBar user={user} />
            <div className="flex justify-center items-start p-6">
                <Card className="max-w-[400px] min-w-[400px]">
                    <CardBody>
                        <Input
                            isRequired
                            type="text"
                            label="Name"
                            defaultValue=""
                            onValueChange={setName}
                        />
                        <Spacer y={5} />
                        <Input
                            isRequired
                            type="number"
                            label="Age"
                            defaultValue={0}
                            onValueChange={setAge}
                        />
                        <Spacer y={5} />
                        <Input
                            isRequired
                            type="number"
                            label="Current HP"
                            defaultValue={0}
                            onValueChange={setCurrentHp}
                        />
                        <Spacer y={5} />
                        <Input
                            isRequired
                            type="number"
                            label="XP"
                            defaultValue={0}
                            onValueChange={setXp}
                        />
                        <Spacer y={5} />
                        <Select
                            label="Class"
                            placeholder="Select class"
                            selectedKeys={heroClass ? [heroClass.className] : []}
                            onSelectionChange={key => setHeroClass(classes.find(c => c.className === key))}
                        >
                            {
                                classes.map(c => (
                                    <SelectItem key={c.className} value={c.className}>
                                        {c.className}
                                    </SelectItem>
                                ))
                            }
                        </Select>
                    </CardBody>
                    <Divider />
                    <CardFooter className="justify-center">
                        <div className="flex">
                            <Button onClick={createHero} variant="flat">Create</Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}