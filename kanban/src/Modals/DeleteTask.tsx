import type { GetTask } from "../Types/GetTask.tsx"; 
import { Toggle } from "../context/ThemeToggle.tsx"; 
import { lightScheme } from "../context/LightThemeMain.tsx";
import { darkScheme } from "../context/DarkThemeMain.tsx";
import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function DeleteTaskModal({task, close}: {task: GetTask; close: () => void}) {
    const theme = useContext(Toggle).theme;
    
    async function fetchDeleteTask(id:number): Promise<void> {
        const res = await fetch(`http://localhost:8080/api/v1/task/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: null
        });

        if (!res.ok) {
            throw new Error("failed to delete task");
        }
    };

    const queryClient = useQueryClient();

    const deleteTaskMutation= useMutation({
        mutationFn: (id:number) => fetchDeleteTask(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["selectedBoard"]});
            console.log("task deleted successfully");
        }
    });

    async function handleDeleteTask() {
       deleteTaskMutation.mutate(task.id);
    };

    return (
        <div className="align-center text-center cursor-default">
            <div>
                <h1 className={`font-bold text-2xl
                        ${theme === "light"
                            ? `text-rose-600`
                            : `text-rose-600/70`
                        }
                    `}>Delete this task?</h1>
                <p>Are you sure you want to delete this task? This action will remove this task and all relating subtasks from this board and </p>
                <p>
                    <em className={`
                            ${theme === "light"
                                ? `text-rose-600`
                                : `text-rose-600/70`
                            }
                        `}
                    >CANNOT BE UNDONE.</em></p>
            </div>
            <div className={`space-x-10 mt-4 mb-2 font-bold text-lg`}>
                <button className={`border py-2 px-4 rounded-lg
                            ${theme === "light"
                                ? `${lightScheme.borderColor} bg-rose-600 hover:bg-rose-700 text-white`
                                : `${darkScheme.borderColor} bg-rose-700/80 hover:bg-rose-600/80`
                            }
                        `}
                        onClick={handleDeleteTask}
                >Delete</button>
                <button className={`border py-2 px-4 rounded-lg
                            ${theme === "light"
                                ? `${lightScheme.borderColor} bg-zinc-100 hover:bg-zinc-200`
                                : `${darkScheme.borderColor} ${darkScheme.backgroundColor} hover:bg-zinc-700/80`
                            }
                        `}
                        onClick={close}
                >Cancel</button>
            </div>
        </div>
    )
}

export default DeleteTaskModal;