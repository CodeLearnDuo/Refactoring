import React, {useEffect, useState} from "react";
import axios from "axios";
import {Button, Card, CardBody, CardHeader, Divider} from "@nextui-org/react";
import {useLocation, useNavigate} from "react-router-dom";
import NavBar from "./Navbar";


function TypeCard() {
    const [hero, setHero] = useState(null);
    let {user} = useLocation().state;
    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:8080/api/hero/${user.userId}`)
                .then(response => {
                    setHero(response.data)
                })
                .catch(error => {
                    console.error(`Error fetching hero details for ID ${user.userId}:`, error);
                    navigate("/createhero", { state : {user : user}})
                });
        }
    }, [user]);

    const navigate = useNavigate();

    const deleteHero = () => {
        axios.delete(`http://localhost:8080/api/hero/${user.userId}`)
            .then(() => {
                setHero(null)
                navigate("/createhero", { state : {user : user}})
            }).catch(error => {
                console.log(error)
        })
    };


    if (!hero) {
        return <div>Loading...</div>
    }
    return (
        <div>
            <NavBar user={user}/>
            <div className="flex justify-center items-start p-6">
                <Card className="max-w-[400px] min-w-[400px]">
                    <CardHeader className="flex gap-3">
                        <div className="flex flex-col">
                            <p className="text-md">Hero</p>
                            <p className="text-small text-default-500">{hero.name}</p>
                        </div>
                    </CardHeader>
                    <Divider/>
                    <CardBody>
                        <p>Age: {hero.age}</p>
                        <p>HP: {hero.currentHp}</p>
                        <p>Level: {hero.levelId}</p>
                        <p>Class: {hero.heroClassId}</p>
                        <p>XP: {hero.xp}</p>
                        <p><Button size="sm" onClick={() => deleteHero()}>Удалить</Button>
                        </p>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}


export default TypeCard;