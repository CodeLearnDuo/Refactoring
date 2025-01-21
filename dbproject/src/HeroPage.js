import React, {useEffect, useState} from "react";
import axios from "axios";
import {Button, Card, CardBody, CardHeader, Divider} from "@nextui-org/react";
import {useLocation, useNavigate} from "react-router-dom";
import NavBar from "./Navbar";

function HeroPage() {
    const [hero, setHero] = useState(null);
    let {user} = useLocation().state;
    const navigate = useNavigate();

    const handleError = (error) => {
        if (error.response) {
            const { message, errorCode, details } = error.response.data;
            console.error(`Error: ${message} (Code: ${errorCode}) - ${details}`);
        } else {
            console.error("An unexpected error occurred:", error);
        }
    };

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:8080/heroes/${user.userId}`)
                .then(response => {
                    setHero(response.data);
                })
                .catch(error => {
                    handleError(error);
                    navigate("/createhero", {state: {user: user}});
                });
        }
    }, [user, navigate]);

    const deleteHero = () => {
        axios.delete(`http://localhost:8080/heroes/${hero.id}`)
            .then(() => {
                setHero(null);
                navigate("/createhero", {state: {user: user}});
            })
            .catch(error => {
                handleError(error);
            });
    };

    if (!hero) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <NavBar user={user} />
            <div className="flex justify-center items-start p-6">
                <Card className="max-w-[400px] min-w-[400px]">
                    <CardHeader className="flex gap-3">
                        <div className="flex flex-col">
                            <p className="text-md">Hero</p>
                            <p className="text-small text-default-500">{hero.name}</p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <p>Age: {hero.age}</p>
                        <p>HP: {hero.currentHp}</p>
                        <p>Level: {hero.level.value}</p>
                        <p>Class: {hero.clazz.className}</p>
                        <p>XP: {hero.xp}</p>
                        <Button size="sm" onClick={deleteHero}>Delete</Button>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default HeroPage;
