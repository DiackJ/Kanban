import type { GetTask } from "./GetTask";

export type GetColumns = {
    id: number;
    statusTitle: string;
    tasks: GetTask[];
}