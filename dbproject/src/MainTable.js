import React, {useCallback, useEffect, useState} from "react";
import {
    Button,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@nextui-org/react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const columns = [
    {name: "Title", uid: "title"},
    {name: "Description", uid: "description"},
    {name: "Due date", uid: "dueDate"},
    {name: "Status", uid: "status"},
    {name: "XP", uid: "xp"},
    {name: "Type", uid: "type.description"},
];

function setCompleted(questId, userId) {
    const inputDTO = {
        hero: { id: userId },
        quest: { id: questId },
        result: true,
        at: new Date().toISOString()
    };

    axios.post(`http://localhost:8080/billboards`, inputDTO)
        .then(() => window.location.reload())
        .catch(error => {
            if (error.response) {
                const { message, errorCode, details } = error.response.data;
                console.error(`Error: ${message} (Code: ${errorCode}) - ${details}`);
            } else {
                console.error("An unexpected error occurred:", error);
            }
        });
}

export default function MainTable({ user }) {
    const [quests, setQuests] = useState([]);
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
        axios.get(`http://localhost:8080/quests`)
            .then(response => {
                setQuests(response.data);
            })
            .catch(handleError);
    }, []);

    const renderCell = useCallback((quest, columnKey) => {
        const cellValue = columnKey.split('.').reduce((obj, key) => obj[key], quest);

        switch (columnKey) {
            case "status":
                if (cellValue !== "Open") {
                    return (
                        <Chip className="capitalize" color={"success"} size="sm" variant="flat">
                            {cellValue}
                        </Chip>
                    );
                }
                return (
                    <Chip
                        style={{ cursor: "pointer" }}
                        onClick={() => setCompleted(quest.id, user.userId)}
                        className="capitalize"
                        color={"warning"}
                        size="sm"
                        variant="flat"
                    >
                        {cellValue}
                    </Chip>
                );
            case "title":
                return (
                    <Button onClick={() => navigate("/comments", { state: { user: user, quest: quest } })}>
                        {cellValue}
                    </Button>
                );
            default:
                return cellValue;
        }
    }, [user, navigate]);

    return (
        <Table aria-label="Quests">
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn key={column.uid} align={"center"}>
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody items={quests} emptyContent={"No quests"}>
                {(item) => (
                    <TableRow key={item.title}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
