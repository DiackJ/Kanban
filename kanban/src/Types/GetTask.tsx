import type { GetSubtask } from "./GetSubtask";

export type GetTask = {
    id: number;
    taskTitle: string;
    description?: string;
    statusColumn: string;
    numOfCompleteTasks: number;
    numOfIncompleteTasks: number;
    subtasks?: GetSubtask[];
    columnId: number;
    orderNum: number;
}