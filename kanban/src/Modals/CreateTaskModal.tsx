import { useState, useContext } from "react";
import { Toggle } from "../context/ThemeToggle.tsx";
import { darkModal } from "../context/DarkThemeModal.tsx";
import { lightScheme } from "../context/LightThemeNav.tsx";
import type { GetColumns } from "../Types/GetColumnList.tsx";
import type { GetBoard } from "../Types/GetBoards.tsx";
import type { CreateTask } from "../Types/CreateTask.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function CreateTaskModal({board, close}: {board: GetBoard | null; close: () => void}) {
    const columns: GetColumns[] = board!.columnsList;
    const theme = useContext(Toggle).theme;
        const [charCount, setCharCount] = useState<number>(200);
        const [taskTitle, setTaskTitle] = useState<string>("New Task");
        const [description, setDescription] = useState<string>("");
        const [columnId, setColumnId] = useState<number>();
        const [statusTitle, setStatusTitle] = useState<string>("Select Status");

        // warnings for title and status
        const [statusWarningMssg, setStatusWarningMssg] = useState<string>("");
        const handleStatusWarning = (v: string) => {
            if (v === "Select Status") {
                setStatusWarningMssg("Status column is required.");
            } else {
                setStatusWarningMssg("");
            }
        };

        const [titleWarningMssg, setTitleWarningMssg] = useState<string>("");
        const handleTitleWarning = (v: string) => {
            if (v === "" || v === "New Task") {
                setTitleWarningMssg("Task title is required.");
            } else {
                setTitleWarningMssg("");
            }
        };

        // select status dropdown
        const [openDropdown, setOpenDropdown] = useState<boolean>(false);
        const handleDropdown = () => {
            setOpenDropdown(prev => !prev);
        };

        const handleTaskColId = (id: number) => {
            setColumnId(id);
        };
        
        const handleStatusTitle = (v: string) => {
            setStatusTitle(v);
            
        };
    
        const handleDescriptionCount = (v: string) => {
            setDescription(v);
            setCharCount(200 - v.length);
        };
    
        const handleTask = (v: string) => {
            setTaskTitle(v);

            if (taskTitle !== "" || v !== "New Task") {
                setTitleWarningMssg("");
            }
        };

        const [newSubtasks, setNewSubtasks] = useState<string[]>([]);
        const handleNewSubtask = () => {
            setNewSubtasks([...newSubtasks, ""]); 
        };
        // trigger new input field and add to array
        const handleNewSubtaskChange = (i: number, v: string) => {
            const update = [...newSubtasks];
            update[i] = v;
            setNewSubtasks(update);
        };
        // for removing non-created subtasks
        const handleRemoveUnCreatedTasks = (i:number) => {
            setNewSubtasks(newSubtasks.filter((_, index) => index !== i));
        };

        type Create = {
            taskTitle: string;
            description?: string;
            subtasks?: string[];
        };
        // task data
        const taskData:Create = {
            taskTitle: taskTitle,
            description: description,
            subtasks: newSubtasks,
        };

        async function fetchCreateTask(data:Create, id:number): Promise<CreateTask> {
            const res = await fetch(`http://localhost:8080/api/v1/column/${id}/task`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (res.status !== 201) {
                throw new Error("failed to create task");
            }

            return res.json();
        };
        type CreateTsk = {
            task: Create,
            columnId: number
        }
        const queryClient = useQueryClient();
        const createTaskMutation = useMutation ({
            mutationFn: ({task, columnId} : CreateTsk) => fetchCreateTask(task, columnId),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["selectedBoard"]});
                console.log("task created successfully");
            }
        });

        async function handleCreateTask() {
            createTaskMutation.mutate({task: taskData, columnId: columnId!});
        };

    
        return (
            <div> 
                {board && (
                <div>
                    <h1 className={`font-bold text-xl mb-6
                            ${theme === "light"
                                ? `text-indigo-950`
                                : `${darkModal.mainText}`
                            }
                        `}>{taskTitle}</h1>
                    <div className={`relative`}>
                        <p className={`${titleWarningMssg !== "" && "text-rose-600/70"}`}>Task Title</p>
                        <input type="text" 
                            placeholder={taskTitle}
                            className={`border p-1 rounded-md mb-4 w-full placeholder:text-gray-400/50
                                ${theme === "light"
                                    ? `border-gray-500`
                                    : `${darkModal.borderColor} ${darkModal.background}`
                                } 
                                ${titleWarningMssg !== "" && "border-rose-600/70"}   
                            `}
                            onChange={(e) => {handleTask(e.target.value);}}
                            onBlur={(e) => handleTitleWarning(e.target.value)}
                        />
                        <p className={`text-rose-600/70 text-sm absolute -mt-4`}>{titleWarningMssg}</p>
                        <p>Description <em>(optional)</em></p>
                        <textarea maxLength={200}
                            className={`border p-1 rounded-md w-full mb-4
                                ${theme === "light"
                                    ? 'border-gray-500'
                                    : `${darkModal.borderColor} ${darkModal.background}`
                                }
                            `}
                            onChange={(e) => handleDescriptionCount(e.target.value)}
                        >
                        </textarea> 
                        <p className="-mt-4 text-sm ml-44">characters remaing: {charCount}</p>
                    </div>
                    <div>
                        <p>Subtasks</p>
                        {newSubtasks.map((_, i:number) => (
                            <div 
                                key={i}
                                className={`flex justify-between`}>
                                <input
                                    key={i}
                                    placeholder="New Subtask"
                                    className={`ml-14 border rounded-lg py-1 px-2 mb-2 w-3/4 placeholder-zinc-600
                                            ${theme === "light"
                                                ? `${lightScheme.otherBorder} bg-white`
                                                : `${darkModal.borderColor} ${darkModal.background}`
                                            }
                                        `}
                                    onChange={(e) => handleNewSubtaskChange(i, e.target.value)}
                                >
                                </input>
                                <div
                                    //key={i}
                                    className={`hover:cursor-pointer`}
                                    onClick={() => handleRemoveUnCreatedTasks(i)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 640 640"
                                        height={16}
                                        width={16}
                                        className={`fill-zinc-500`}
                                        >
                                        <path d="M64 488C64 474.7 74.7 464 88 464L552 464C565.3 464 576 474.7 576 488C576 501.3 565.3 512 552 512L88 512C74.7 512 64 501.3 64 488z"/>
                                    </svg>
                                </div>  
                            </div>                  
                        ))}
                        <button className={`inline-flex justify-center items-center w-full font-semibold hover:cursor-pointer rounded-xl border h-fit p-1 transition-all
                                ${theme === "light"
                                    ? `border-white bg-indigo-200 text-indigo-950 hover:bg-indigo-100`
                                    : `${darkModal.borderColor} ${darkModal.secondaryButtonBg} text-zinc-900 ${darkModal.secondaryButtonHover}`
                                }
                            `}
                                onClick={handleNewSubtask}
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 640 640"
                                height={16}
                                width={16}
                                className={`
                                    ${theme === "light" 
                                        ? `fill-indigo-950`
                                        : `fill-zinc-900`
                                    }
                                `}
                                >
                                <path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/>
                            </svg>
                            <p>Add New Subtask</p>
                        </button>
                    </div>
                    <div>
                        <p className={`mt-4 ${statusWarningMssg !== "" && "text-rose-600/70"}`}>Status Column</p>
                        <div className={`border w-full py-1 px-2 rounded-md
                                ${theme === "light"
                                    ? `bg-white border-gray-400`
                                    : `${darkModal.background} ${darkModal.borderColor}`
                                }
                                ${statusWarningMssg !== "" && "border-rose-600/70"}
                            `}
                            onClick={handleDropdown}
                            >
                            <p>{statusTitle}</p>
                        </div>
                        <p className={`text-rose-600/70`}>{statusWarningMssg}</p>
                        {openDropdown && 
                            <div className={`absolute border rounded-md h-fit w-fit py-2 pl-2 pr-6
                                ${theme === "light"
                                    ? `bg-white border-gray-400`
                                    : `${darkModal.background} ${darkModal.borderColor}`
                                }
                            `}>
                                {columns.map(col => (
                                    <div
                                        key={col.id}
                                        className={`hover:cursor-pointer mt-1`}
                                    >
                                        <p className={`hover:text-zinc-700`}
                                            onClick={() => {
                                                handleStatusTitle(col.statusTitle);
                                                handleTaskColId(col.id);
                                                handleStatusWarning(col.statusTitle);
                                            }}
                                        >{col.statusTitle}</p>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                    <button className={`border p-1 rounded-xl transition-all hover:cursor-pointer mt-6 font-semibold w-full
                            ${theme === "light"
                                ? `border-indigo-600 bg-indigo-600 hover:bg-indigo-400 text-indigo-50`
                                : `${darkModal.borderColor} ${darkModal.mainButtonBg} ${darkModal.mainButtonHover} ${darkModal.mainButtonText}`
                            }
                            ${statusWarningMssg !== ""  && "hover:cursor-not-allowed"}
                            ${titleWarningMssg !== ""  && "hover:cursor-not-allowed"}
                        `}
                            disabled={statusWarningMssg !== "" || titleWarningMssg !== ""}
                            onClick={() => {
                                handleCreateTask().then(() => close());
                            }}
                        >
                        <p>Add Task</p>
                    </button>
                </div>
                )}
            </div>
        )
}

export default CreateTaskModal;
