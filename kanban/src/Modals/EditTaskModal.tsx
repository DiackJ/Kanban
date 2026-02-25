import { useContext, useState } from "react";
import { Toggle } from "../context/ThemeToggle.tsx";
import { darkModal } from "../context/DarkThemeModal.tsx";
import { lightScheme } from "../context/LightThemeNav.tsx";
import type { GetTask } from "../Types/GetTask.tsx";
import type{ GetColumns } from "../Types/GetColumnList.tsx";
import { motion } from "motion/react";
import type { EditTask } from "../Types/EditTask.tsx";
import type { GetSubtask } from "../Types/GetSubtask.tsx";
import type { MoveTask } from "../Types/MoveTask.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function EditTaskModal({task, columns, close}: {task: GetTask; columns: GetColumns[]; close: () => void}) {
    const theme = useContext(Toggle).theme;
    const [charCount, setCharCount] = useState<number>(200);
    const [taskTitle, setTaskTitle] = useState<string>(task.taskTitle);
    const [subtaskTitle, setSubtaskTitle] = useState<string>("");
    const [description, setDescription] = useState<string | undefined>(task.description);
    //const [columnId, setColumnId] = useState<number>(task.columnId);

    const [selectedStatus, setSelectedStatus] = useState<string>(task.statusColumn);
    const [openSelect, setOpenSelect] = useState<boolean>(false);

    const handleSelectedStatus = (v: string) => {
        setSelectedStatus(v);
    };

    const handleOpenSelect =() => {
        setOpenSelect(prev => !prev); 
    };

    const handleDescriptionCount = (v: string) => {
        setDescription(v);
        setCharCount(200 - v.length);
    };

    const handleTask = (v: string) => {
        setTaskTitle(v);
    };

    //const currentSubtasks: (number | undefined)[] = task.subtasks?.map(s => s.id) ?? [];
    
    const [newSubtasks, setNewSubtasks] = useState<string[]>([]);
    // trigger new input field
    const handleNewSubtask = () => {
        setNewSubtasks([...newSubtasks, ""]); 
    };
    const handleNewSubtaskChange = (i: number, v: string) => {
        const update = [...newSubtasks];
        update[i] = v;
        setNewSubtasks(update);
    };
    // remove existing subtasks in UI
    const [removedTasks, setRemovedTasks] = useState<number[]>([]);
    const handleRemovedTasks = (i:number) => {
        setRemovedTasks([...removedTasks, i]);
    };
    // remove uncreated subtasks before submission
    const handleRemoveUnCreatedTasks = (i:number) => {
        setNewSubtasks(newSubtasks.filter((_, index) => index !== i));
    };
    // get list of completed tasks and manage completion state 
    const currentCompleteSubtasks: (number | undefined)[] = task.subtasks?.filter(s => s.complete).map(s => s.id) ?? [];
    const [completed, setCompleted] = useState<(number | undefined)[]>(currentCompleteSubtasks);
    const handleCompleted = (id: number) => {
        if (!completed.includes(id)) {
            setCompleted([...completed, id]);
        } else {
            setCompleted(completed.filter(cid => cid !== id));
        }
    };

    type Edit = {
        taskTitle?: string;
        description?: string;
    };

    const taskData:Edit = {
        taskTitle: taskTitle,
        description: description
    };

    async function fetchEditTask(data:Edit, id:number): Promise<EditTask> {
        const res = await fetch(`http://localhost:8080/api/v1/task/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            throw new Error("failed to edit task: " + task.taskTitle);
        }

        return res.json();
    };

    const queryClient = useQueryClient();
    
    type EditVars = {
        data: Edit;
        id: number;
    };

    const editTaskMutation = useMutation({
        mutationFn: ({data, id}: EditVars) => fetchEditTask(data, id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["selectedBoard"]});
            console.log("task edited successfully");
        }
    });

    async function handleEditTask() {
        editTaskMutation.mutate({data: taskData, id: task.id});
    };

    type AddSubtask = {
        subtaskTitle: string;
    };

    const subtaskData:AddSubtask = {
        subtaskTitle: subtaskTitle
    };

    async function fetchAddSubtask(data:AddSubtask, id:number): Promise<GetSubtask> {
        const res = await fetch(`http://localhost:8080/api/v1/task/${id}/subtask`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (res.status !== 201) {
            throw new Error("failed to add subtask");
        }

        return res.json(); 
    }; 

    type AddSubtaskVars = {
        data: AddSubtask;
        id:number;
    };

    const addSubtaskMutation = useMutation({
        mutationFn: ({data, id}: AddSubtaskVars) => fetchAddSubtask(data, id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["selectedBoard"]});
            console.log("subtask added successfully");
        }
    });

    async function handleAddSubtask()  {
       addSubtaskMutation.mutate({data: subtaskData, id: task!.id});
    };

    async function fetchEditSubtask(data:AddSubtask, id:number): Promise<GetSubtask> {
        const res = await fetch(`http://localhost:8080/api/v1/subtask/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            throw new Error("failed to edit subtask");
        }
        return res.json();
    };

    const editSubtaskMutation = useMutation({
        mutationFn: ({data, id} : AddSubtaskVars) => fetchEditSubtask(data, id),
        onSuccess: () => {
            console.log("subtask edited successfully");
        }
    });

    async function handleEditSubtask(id:number) {
        editSubtaskMutation.mutate({data: subtaskData, id: id});
    };

    //   type Move = {
    //     columnId: number;
    //  };

    // const moveTaskData:Move = {
    //     columnId: columnId
    // };

    async function fetchMoveTask(data:number, id:number): Promise<MoveTask> {
        const res = await fetch(`http://localhost:8080/api/v1/task/${id}/position`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({columnId: data})
        });

        if(!res.ok) {
            console.log(data);
            throw new Error("failed to move task");
        }

        return res.json();
    };

    type MoveReq = {
        data: number;
        id:number;
    };

    const moveTaskMutation = useMutation({
      mutationFn: ({data, id}: MoveReq) => fetchMoveTask(data, id),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["selectedBoard"]});
        console.log("task moved successfully");
      }
    });

    async function handleMoveTask(col:number) {
        moveTaskMutation.mutate({data: col, id: task!.id});
    };

    

    async function fetchRemoveSubtask(id:number): Promise<void> {
        const res = await fetch(`http://localhost:8080/api/v1/subtask/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: null
        });

        if (!res.ok) {
            throw new Error("failed to remove subtask");
        }
    };

    const removeSubtaskMutation = useMutation({
        mutationFn: (id: number) => fetchRemoveSubtask(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["selectedBoard"]});
            console.log("subtask removed successfully");
        }
    });

    async function handleRemoveSubtask(id:number) {
        removeSubtaskMutation.mutate(id);
    };

   async function fetchComplete(id:number): Promise<void> {
        const res = await fetch(`http://localhost:8080/api/v1/subtask/${id}/complete`, {
            method: "PUT",
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

   const completeSubtaskMutation = useMutation({
    mutationFn: (id: number) => fetchComplete(id),
    onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["selectedBoard"]});
        console.log("subtask completed sucessfully");
    }
   });

   async function handleComplete(id:number) {
        completeSubtaskMutation.mutate(id);
   };


    console.log("subtasks: " + task.subtasks);
    return (
        <div>
            <div className={`cursor-default`}>
                <h1 className={`font-bold text-xl mb-6
                        ${theme === "light"
                            ? `text-indigo-950`
                            : `${darkModal.mainText}`
                        }
                    `}
                    >{taskTitle}</h1>
                <div>
                    <p>Task Title</p>
                    <input type="text" 
                        value={taskTitle}
                        className={`border p-1 rounded-md mb-4 w-full
                            ${theme === "light"
                                ? `border-gray-500`
                                : `${darkModal.borderColor} ${darkModal.background}`
                            }    
                        `}
                        onChange={(e) => handleTask(e.target.value)}
                    />
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
                    <p className="-mt-2 text-sm ml-60">characters remaing: {charCount}</p>
                </div>
                <div>
                    <p>Subtasks</p>
                    {task.subtasks?.map(st => (
                         <div
                               key={st.id}
                             className={`${removedTasks.includes(st.id) && `hidden`} flex justify-between`}
                         >
                             <div
                                 key={st.id}
                                 className={`hover:cursor-pointer border rounded-sm mt-1 h-6 w-6
                                         ${theme === "light"
                                             ? `${lightScheme.otherBorder}`
                                             : `${darkModal.borderColor}`
                                         }
                                         ${completed.includes(st.id) && `bg-[#9796b2]`}
                                     `}
                                 onClick={() => {
                                     handleCompleted(st.id)
                                     handleComplete(st.id!)
                                 }}
                             >
                                 {completed.includes(st.id) && 
                                     <motion.div
                                         initial={{scale: 0}}
                                         animate={{scale: 1}}
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
                             <input
                                 placeholder={st.subtaskTitle}
                                 type="text"
                                 className={`border rounded-lg py-1 px-2 mb-2 w-3/4
                                         ${theme === "light"
                                             ? `${lightScheme.otherBorder} bg-white`
                                             : `${darkModal.borderColor} ${darkModal.background}`
                                         }
                                     `}
                                 onChange={(e) => setSubtaskTitle(e.target.value)}
                                 onBlur={() => handleEditSubtask(st.id)}
                             >   
                             </input>
                             <div
                                 className={`hover:cursor-pointer`}
                                 onClick={() => {
                                     handleRemovedTasks(st.id)
                                     handleRemoveSubtask(st.id!)
                                 }}
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
                    {newSubtasks.map((v:string, i:number) => (
                        <div 
                            key={i}
                            className={`flex justify-between`}>
                            <input
                                key={i}
                                value={v}
                                placeholder="New Subtask"
                                className={`ml-14 border rounded-lg py-1 px-2 mb-2 w-3/4 placeholder-zinc-600
                                        ${theme === "light"
                                            ? `${lightScheme.otherBorder} bg-white`
                                            : `${darkModal.borderColor} ${darkModal.background}`
                                        }
                                    `}
                                onChange={(e) => {
                                    handleNewSubtaskChange(i, e.target.value);
                                    setSubtaskTitle(v);
                                    }}
                                onBlur={handleAddSubtask}
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
                    <p className={`mt-4`}>Status Column</p>
                    <div className={`border w-full py-1 px-2 rounded-md
                            ${theme === "light"
                                ? `bg-white border-gray-400`
                                : `${darkModal.background} ${darkModal.borderColor}`
                            }
                        `}
                        onClick={handleOpenSelect}>
                        <p>{selectedStatus}</p>
                    </div>
                    {openSelect && 
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
                                            handleSelectedStatus(col.statusTitle);
                                            handleMoveTask(col.id);
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
                    `}
                        onClick={() => {
                            handleEditTask()
                            close();
                        }}
                    >
                    <p>Save Changes</p>
                </button>
            </div>
        </div>
    )
}

export default EditTaskModal;