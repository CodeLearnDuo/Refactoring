import React, {useEffect, useState} from "react";
import axios from "axios";
import {Button, Card, CardBody, Spacer, Textarea} from "@nextui-org/react";
import {useLocation} from "react-router-dom";
import NavBar from "./Navbar";

function CommentPage() {
    const [comments, setComments] = useState([]);
    const [value, setValue] = useState("");
    let {quest, user} = useLocation().state;

    const handleError = (error) => {
        if (error.response) {
            const { message, errorCode, details } = error.response.data;
            console.error(`Error: ${message} (Code: ${errorCode}) - ${details}`);
        } else {
            console.error("An unexpected error occurred:", error);
        }
    };

    useEffect(() => {
        if (quest) {
            axios.get(`http://localhost:8080/comments?questId=${quest.id}`)
                .then(response => {
                    setComments(response.data);
                })
                .catch(handleError);
        }
    }, [quest]);

    const addComment = (comment) => {
        const inputDTO = {
            quest: { id: quest.id },
            user: { id: user.userId },
            content: comment,
            at: new Date().toISOString()
        };

        axios.post(`http://localhost:8080/comments`, inputDTO)
            .then(() => {
                setValue("");
                return axios.get(`http://localhost:8080/comments?questId=${quest.id}`);
            })
            .then(response => {
                setComments(response.data);
            })
            .catch(handleError);
    };

    return (
        <div>
            <NavBar user={user} />
            <div className="flex justify-center items-start p-6">
                <Card className="max-w-[400px] min-w-[400px]">
                    <CardBody>
                        {
                            comments.map((comment, index) => (
                                <div key={index}>
                                    <Textarea
                                        isReadOnly
                                        variant="bordered"
                                        placeholder="Enter your description"
                                        defaultValue={comment.content}
                                        label={comment.at}
                                        labelPlacement="outside"
                                    />
                                    <Spacer y={5} />
                                </div>
                            ))
                        }
                        <Textarea
                            placeholder="Enter new comment"
                            value={value}
                            onValueChange={setValue}
                        />
                        <Spacer y={5} />
                        <Button onClick={() => addComment(value)}>Add</Button>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default CommentPage;
