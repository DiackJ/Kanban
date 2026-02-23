import type { GetColumns } from "./GetColumnList";
//import type { GetTask } from "./GetTask";

export type GetBoard = {
    id: number;
    boardTitle: string; 
    description?: string;
    userId: string;
    columnsList: GetColumns[];
    // tasks?: GetTask[];
}