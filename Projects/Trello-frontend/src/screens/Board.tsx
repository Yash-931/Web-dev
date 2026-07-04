import { useState } from "react";
import { Appbar } from "../components/Appbar";
import { BoardsSection } from "../components/BoardsSection";
import { Card } from "../components/Card";

export function Board() {
  const [pendingTasks, setPendingTasks] = useState([
    {
      id: "1",
      title: "Node to bun migration",
      description:
        "We have been trying this for a while now but it not working out as expected",
    },
  ]);

  const [onGoingTasks, setOnGoingTasks] = useState([
    {
      id: "2",
      title: "PBS to temporal migration",
      description:
        "We have been trying this for a while now but it not working out as expected",
    },
  ]);

  const [completedTasks, setCompletedTasks] = useState([
    {
      id: "3",
      title: "PHP to FAST API migration",
      description:
        "We have been trying this for a while now but it not working out as expected",
    },
    {
      id: "4",
      title: "Perl to python migration",
      description:
        "We have been trying this for a while now but it not working out as expected",
    },
  ]);

  return (
    <div>
      <Appbar />

      <div style={{ display: "flex", padding: 10 }}>
        <BoardsSection
          onDrop={(item) => {
            setPendingTasks((p) => p.filter((x) => x.id !== item.id));
            setOnGoingTasks((p) => p.filter((x) => x.id !== item.id));
            setCompletedTasks((p) => p.filter((x) => x.id !== item.id));
            setPendingTasks((p) => [...p, item]);
          }}
        >
          {pendingTasks.map((task) => (
            <Card
              title={task.title}
              description={task.description}
              id={task.id}
            />
          ))}
        </BoardsSection>

        <BoardsSection onDrop={(item) => {
            setPendingTasks((p) => p.filter((x) => x.id !== item.id));
            setOnGoingTasks((p) => p.filter((x) => x.id !== item.id));
            setCompletedTasks((p) => p.filter((x) => x.id !== item.id));
            setOnGoingTasks((p) => [...p, item]);
          }}>
          {onGoingTasks.map((task) => (
            <Card
              title={task.title}
              description={task.description}
              id={task.id}
            />
          ))}
        </BoardsSection>

        <BoardsSection onDrop={(item) => {
            setPendingTasks((p) => p.filter((x) => x.id !== item.id));
            setOnGoingTasks((p) => p.filter((x) => x.id !== item.id));
            setCompletedTasks((p) => p.filter((x) => x.id !== item.id));
            setCompletedTasks((p) => [...p, item]);
          }}>
          {completedTasks.map((task) => (
            <Card
              title={task.title}
              description={task.description}
              id={task.id}
            />
          ))}
        </BoardsSection>
      </div>
    </div>
  );
}
