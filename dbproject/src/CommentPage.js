import React, {useEffect, useState} from "react";
import axios from "axios";
import {Button, Card, CardBody, Spacer, Textarea} from "@nextui-org/react";
import {useLocation} from "react-router-dom";
import NavBar from "./Navbar";


function QuestCard() {
    const [comments, setComments] = useState([]);
    const [value, setValue] = useState("");
    let {quest, user} = useLocation().state;
    useEffect(() => {
        if (quest) {
            axios.get(`http://localhost:8080/api/comment/${quest}`)
                .then(response => {
                    setComments(response.data)
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [quest]);

    const addComment = (comment) => {
        axios.post(`http://localhost:8080/api/comment`,
            {
                userId: user.userId,
                questId: quest,
                commentText: comment
            })
            .then(() => {
                window.location.reload()
            }).catch(error => {
            console.log(error)
        })
    };


    return (
        <div>
            <NavBar user={user}/>
            <div className="flex justify-center items-start p-6">
                <Card className="max-w-[400px] min-w-[400px]">
                    <CardBody>
                        {
                            comments.map((comment, index) => {
                                return (
                                    <div>
                                        <Textarea
                                            isReadOnly
                                            variant="bordered"
                                            placeholder="Enter your description"
                                            defaultValue={comment.commentText}
                                            label={comment.timestamp}
                                            labelPlacement="outside"
                                        />
                                        <Spacer y={5}/>
                                    </div>
                                    )
                            })
                        }
                        <Textarea
                            placeholder="Enter new comment"
                            value={value}
                            onValueChange={setValue}
                        />
                        <Spacer y={5}/>
                        <Button onClick={() => addComment(value)}>Add</Button>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}


export default QuestCard;