import type { GetTask } from "../Types/GetTask.tsx";
import { Toggle } from '../context/ThemeToggle.tsx';
import { useContext, useState } from "react";
import { darkModal } from "../context/DarkThemeModal.tsx";
import { lightScheme } from "../context/LightThemeNav.tsx";
import { motion } from "motion/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function ViewTaskModal({task}: {task: GetTask}) {
    const theme = useContext(Toggle).theme;
    const completedTasks: (number | undefined)[] = task.subtasks?.filter(c => c.complete).map(c => c.id) ?? [];
    const [completed, setCompleted] = useState<(number | undefined)[]>(completedTasks);
    const handleCompleted = (id:number) => {
        if (!completed.includes(id)) {
            setCompleted([...completed, id]);
        } else {
            setCompleted(completed.filter(cid => cid !== id));
        }
    };
    
    async function fetchComplete(id:number): Promise<void> {
        const res = await fetch(`http://localhost:8080/api/v1/subtask/${id}/complete`, {
            method:"PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: null
        });

        if (!res.ok) {
            throw new Error("failed to complete subtask");
        }
    };

    const queryClient = useQueryClient();

    const subtaskCompleteMutation = useMutation({
        mutationFn: (id:number) => fetchComplete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["selectedBoard"]});
            console.log("subtask completed successfully");
        }
    });

    async function handleComplete(id:number){
        subtaskCompleteMutation.mutate(id);
    };

    return (
        <div className={`cursor-default`}>
            <div>
                <h2 className={`text-3xl mb-2`}>{task.taskTitle}</h2>
                
                <p className={`mb-2`}>{task.description}</p>
            </div>
            <div>
                <p className={`text-sm`}>Subtasks</p>
                
                {task.subtasks?.map(st => (
                    <div
                        key={st.id}
                        className={`mb-4`}
                    >
                        <div className={`inline-flex`}>
                            <div className={`border-2 rounded-sm h-6 w-6 mr-2 mt-1 hover:cursor-pointer
                                    ${theme === "light"
                                        ? `${lightScheme.otherBorder}`
                                        : `${darkModal.borderColor}`
                                    }
                                    ${completed.includes(st.id) && `bg-[#9796b2]`}
                                `}
                                    onClick={() => {
                                        handleCompleted(st.id);
                                        handleComplete(st.id);
                                    }}
                            >
                                {completed.includes(st.id) &&
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 0 640 640"
                                            className={`
                                                 ${theme === "light"
                                                    ? `fill-white`
                                                    : `fill-[#2b2c37]`
                                                 }
                                            `}
                                            >
                                            <path d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z"/>
                                        </svg>
                                    </motion.div>
                                } 
                            </div>
                            <p className={`mt-1`}>{st.subtaskTitle}</p>
                        </div>
                    </div>
                ))}
            </div>
            <p className={`text-sm`}>Status Column</p>
            <div>
                <p>{task.statusColumn}</p>
            </div>
        </div>
    )
}

export default ViewTaskModal;