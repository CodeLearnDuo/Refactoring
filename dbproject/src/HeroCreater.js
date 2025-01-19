import {Button, Card, CardBody, CardFooter, Divider, Input, Select, SelectItem, Spacer} from "@nextui-org/react";
import {useEffect, useState} from "react";
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";
import NavBar from "./Navbar";

export default function HeroCreater() {
    const [name, setName] = useState("");
    const [heroClass, setHeroClass] = useState(new Set([]))
    const [classes, setClasses] = useState([]);
    const navigate = useNavigate();

    let {user} = useLocation().state;

    useEffect(() => {
        axios.get(`http://localhost:8080/api/class/all`)
            .then(response => {
                setClasses(response.data)
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const createHero = () => {
        console.log(heroClass.anchorKey)
        axios.post('http://localhost:8080/api/hero',
            {name : name, userId: user.userId, heroClassId: heroClass.anchorKey})
            .then(response => {
                navigate("/main", { state : {user : user}})
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    return (
        <div>
            <NavBar user={user}/>
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
                        <Spacer y={5}/>
                        <Select
                            label="Class"
                            placeholder="Select class"
                            selectedKeys={heroClass.className}
                            onSelectionChange={setHeroClass}
                        >
                            {
                                classes.map(c => (
                                    <SelectItem key={c.classId} value={c.classId}>
                                        {c.className}
                                    </SelectItem>
                                ))
                            }
                        </Select>
                    </CardBody>
                    <Divider/>
                    <CardFooter className="justify-center">
                        <div className="flex">
                            <Button onClick={createHero} variant="flat">Create</Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>

    )
}