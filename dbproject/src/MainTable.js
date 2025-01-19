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
    {name: "Type", uid: "typeId"},
];

function setCompleted(quest, user) {
    axios.get(`http://localhost:8080/api/hero/${user}`)
        .then(response => {
            axios.post("http://localhost:8080/api/billboard",
                {
                    heroId: response.data.heroId,
                    questId: quest
                })
                .then(() => window.location.reload())
                .catch(error => {console.error('Error: ', error)})
        })

}

export default function MainTable({  user }) {
    const [quests, setQuests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8080/api/quest/all`)
            .then(response => {
                setQuests(response.data);
            })
            .catch(error => {
                console.error('Error fetching transformers:', error);
            });
    }, []);

    const renderCell = useCallback((quest, columnKey) => {
        const cellValue = quest[columnKey];

        switch (columnKey) {
            case "status":
                if (cellValue !== "Open") {
                    return (
                        <Chip className="capitalize" color={"success"} size="sm" variant="flat">
                            {cellValue}
                        </Chip>
                    )
                }
                return (
                    <Chip style={{cursor: "pointer"}} onClick={() => setCompleted(quest.questId, user.userId)} className="capitalize" color={"warning"} size="sm" variant="flat">
                        {cellValue}
                    </Chip>
                );
            case "title":
                return (
                    <Button onClick={() => navigate("/comments", { state : {user : user, quest: quest["questId"]}})}>
                        {cellValue}
                    </Button>
                );
            default:
                return (
                    cellValue
                );
        }
    }, [user, navigate]);

    return (
        <Table area-label="Quests">
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
    )
}