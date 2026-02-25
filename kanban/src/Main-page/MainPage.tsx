import Nav from "../Reusable-components/Nav";
import { useState } from "react";
// import boardsData from "../Test-data/boards.json";
// import emptyBoards from "../Test-data/emptyBoards.json";
import type { GetBoard } from "../Types/GetBoards.tsx";
import type { GetBoardNav } from "../Types/GetNavBoards.tsx";
import { useContext, useEffect } from "react";
import { Toggle } from "../context/ThemeToggle.tsx";
import { lightScheme } from "../context/LightThemeMain.tsx";
import { darkScheme } from "../context/DarkThemeMain.tsx";
import ModalHost from "../Reusable-components/ModalHost.tsx";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import type { GetTask } from "../Types/GetTask.tsx";
import ColumnCol from "../Reusable-components/ColumnCol.tsx";
import HelperModal from "../Modals/HelperModal.tsx";
import type { MoveTask } from "../Types/MoveTask.tsx";
import { useQuery, useMutation } from "@tanstack/react-query";

function MainPage() {
    
    async function fetchBoards(): Promise<GetBoardNav[]> {
        const res = await fetch("http://localhost:8080/api/v1/nav", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: null
        });

        if (!res.ok) {
            throw new Error("board retrieval failed");
        }
    
        return res.json();
    };
    // fetch list of boards for nav upon page render
    const { data: boards, isLoading, error } = useQuery<GetBoardNav[]>({
        queryKey: ["navBoards"],
        queryFn: fetchBoards
    })

    // nav is open/closed
    const [navIsActive, setNavIsActive] = useState<boolean>(true);
    //selected board state
    const [selectedBoardId, setSelectedBoard] = useState<number| null>(null);

    //set default board
    useEffect(() => {
        if (boards?.length && selectedBoardId === null) {
            setSelectedBoard(boards[0].id);
        }
    }, [boards, selectedBoardId]);

    async function fetchSelectedBoard(boardId:number) : Promise<GetBoard> {
        const res = await fetch(`http://localhost:8080/api/v1/board/${boardId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: null
        }); 

        if (!res.ok) {
            throw new Error("failed to fetch selected board");
        }

        return res.json();
    };


    // fetch selected board upon user select
    const { data: selectedBoard } = useQuery<GetBoard | null> ({
        queryKey: ["selectedBoard", selectedBoardId],
        queryFn: () => fetchSelectedBoard(selectedBoardId!),
        enabled: !!selectedBoardId
    });
    
    // number of columns in current board for grid styling
    const columnCount = selectedBoard?.columnsList?.length;
    // light/dark theme toggle
    const toggleTheme = useContext(Toggle).toggleTheme;
    const theme = useContext(Toggle).theme;
    // draggable task state 
    const [colTasks, setColTasks] = useState<GetTask[]>([]);

    useEffect(() => {
        if(!selectedBoard) {
            setColTasks([]);
            return;
        }

        setColTasks(selectedBoard.columnsList?.flatMap(col => 
            col.tasks?.map(t => ({
                id: t.id,
                taskTitle: t.taskTitle,
                description: t.description,
                statusColumn: t.statusColumn,
                numOfCompleteTasks: t.numOfCompleteTasks,
                numOfIncompleteTasks: t.numOfIncompleteTasks,
                subtasks: t.subtasks,
                columnId: t.columnId,
                orderNum: t.orderNum,
            })) ?? []
        ))
    }, [selectedBoard]);
          
    //  selectedBoard?.columnsList?.forEach(c => {
    //      console.log("column: " + c.statusTitle + " tasks: " + c.tasks.map(t => t.columnId));
    //  })

    async function fetchMoveTask(col:number, id:number): Promise<MoveTask> {
        const res = await fetch(`http://localhost:8080/api/v1/task/${id}/position`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({columnId: col})
        });

        if(!res.ok) {
            throw new Error("failed to move task");
        }

        return res.json();
    };

    const moveTaskMutation = useMutation({
        mutationFn: (data: {col: number, id: number}) => fetchMoveTask(data.col, data.id),
        onSuccess: () => {
            console.log("task moved successfully");
        }
    });

    async function handleMoveTask(col:number, id:number) {
        moveTaskMutation.mutate({col, id});
    };

    // update the task's columnId, order, and status when dropped
    const onMoveTask = (taskId: number, newColumnId: number, newStatus: string) => {
        setColTasks(prev => {
            const task = prev.find(t => t.id === taskId); // find dragged task or undefined
            if (!task) return prev; // else return current task
            // find the higest order of tasks in a single column and drop the current draggable task in the last postion
            const taskOrder = Math.max(
                -1, // seed value to prevent -infinity for empty column
                ...prev
                .filter(t => t.columnId === newColumnId) // filters tasks only in current column 
                .map(t => t.orderNum) // get those column's tasks' orders
            ) + 1  // add one to the highest order to place new task

            //console.log("task: " + task.id + " New Task Order:", task.order, " column: " + task.columnId + " status: " + task.statusColumn);
            handleMoveTask(newColumnId, taskId); // update task's column on backend
            
            return prev.map(t =>
                t.id === taskId
                ? {...t, columnId: newColumnId, statusColumn: newStatus, orderNum: taskOrder }
                : t
            )
            })
    }

    // handle if nav is open/closed 
    const handleNav = () => {
        setNavIsActive(prev => !prev);
    };

    // modal state
    const [modalOpen, setModalOpen] = useState(false);
    const handleModalOpen = () => {
        setModalOpen(prev => !prev);
    };

    // secondary modal
    const [secondModalOpen, setSecondModalOpen] = useState(false);
    const handleSecondModal = () => {
        setSecondModalOpen(prev => ! prev);
    };

    const [modal, setModal] = useState<string>("");
    const handleModal = (m: string) => {
        setModal(m); 
    };

    const [activeTask, setActiveTask] = useState<number | null>(null);

    const emptyColumns = selectedBoard?.columnsList?.length === 0;

    let isBoardListEmpty:boolean = true;

    if (boards) {
        isBoardListEmpty = false;
    }
    // temporary loading and error states 
    if(isLoading) {
        return <div>Loading...</div>;
    }
    if(error) {
        return <div>Error fetching boards</div>;
    }


    return (
        <DndProvider backend={HTML5Backend}>
        <Toggle value={{theme, toggleTheme}}>
            <div className={`grid grid-cols-[auto_1fr] h-screen`}>
                <aside>
                    <Nav navIsActive={navIsActive} navFunc={handleNav} boards={boards!} setActiveBoard={setSelectedBoard} openModal={handleModalOpen} modalType={handleModal}/>
                </aside>
                <div className={`grid grid-rows-[auto_1fr] w-full bg-[length:16px_16px]
                        ${theme === "light"
                            ? `${lightScheme.backgroundColor} bg-[radial-gradient(circle,_#dee2e8_1px,_transparent_1px)]`
                            : `${darkScheme.backgroundColor} bg-[radial-gradient(circle,_#2e2c4a_1px,_transparent_1px)]`
                        }
                    `}>
                    <div>
                        <header className={`border-b flex justify-between items-center pl-4 py-4 h-fit
                                ${theme === "light"
                                    ? `${lightScheme.headerBgColor}`
                                    : `${darkScheme.headerBgColor} ${darkScheme.borderColor}`
                                }
                            `}>
                            <h2 className={`text-2xl font-bold
                                    ${theme === "light"
                                        ? `${lightScheme.mainTextColor}`
                                        : `${darkScheme.mainTextColor}`
                                    }
                                `}>
                                    {!isBoardListEmpty ? selectedBoard?.boardTitle : ""}
                                </h2>
                            <div className={`space-x-2 inline-flex`}>
                                <button className={`h-fit w-fit rounded-md border p-2 inline-flex ${emptyColumns || isBoardListEmpty && "hover:cursor-not-allowed"}
                                        ${theme === "light"
                                            ? `${lightScheme.buttonBgColor} ${lightScheme.borderColor} hover:${lightScheme.buttonHoverColor} ${lightScheme.buttonTextColor}`
                                            : `${darkScheme.buttonBgColor} ${darkScheme.borderColor} hover:${darkScheme.buttonHoverColor} ${darkScheme.buttonTextColor}`
                                        }
                                    `}
                                        onClick={() => {
                                            handleModalOpen(); 
                                            handleModal("createTask")
                                        }}
                                        disabled={emptyColumns}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 0 640 640"
                                            height={16}
                                            width={16}
                                            className={`mt-1
                                                    ${theme === "light"
                                                        ? `${lightScheme.svgFill}`
                                                        : `${darkScheme.svgFill}`
                                                    }
                                                `}
                                            >
                                            <path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/>
                                        </svg>
                                    <p>Task</p>
                                </button>
                                <button className={`h-fit w-fit rounded-md border p-2 inline-flex ${isBoardListEmpty && 'hover:cursor-not-allowed'}
                                    ${theme === "light"
                                        ? `${lightScheme.buttonBgColor} ${lightScheme.borderColor} hover:${lightScheme.buttonHoverColor} ${lightScheme.buttonTextColor}`
                                        : `${darkScheme.buttonBgColor} ${darkScheme.borderColor} hover:${darkScheme.buttonHoverColor} ${darkScheme.buttonTextColor}`
                                    }
                                `}
                                    onClick={() => {
                                        handleModalOpen();
                                        handleModal("createColumn");
                                    }}
                                    disabled={isBoardListEmpty}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 640 640"
                                        height={16}
                                        width={16}
                                        className={`mt-1
                                                ${theme === "light"
                                                    ? `${lightScheme.svgFill}`
                                                    : `${darkScheme.svgFill}`
                                                }
                                            `}
                                        >
                                        <path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/>
                                    </svg>
                                    <p>Column</p>
                                </button>
                                <button className={`-ml-24 pr-4 ${isBoardListEmpty && 'hover:cursor-not-allowed'}`}
                                    onClick={handleSecondModal}
                                    disabled={isBoardListEmpty}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 640 640"
                                        height={24}
                                        width={24}
                                        className={`fill-zinc-500 mt-2`}
                                        >
                                        <path d="M320 208C289.1 208 264 182.9 264 152C264 121.1 289.1 96 320 96C350.9 96 376 121.1 376 152C376 182.9 350.9 208 320 208zM320 432C350.9 432 376 457.1 376 488C376 518.9 350.9 544 320 544C289.1 544 264 518.9 264 488C264 457.1 289.1 432 320 432zM376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320z"/>
                                    </svg>
                                </button>  
                            </div>
                        </header>
                        <HelperModal open={secondModalOpen} openMainModal={handleModalOpen} mainModal={handleModal} close={handleSecondModal}/>
                    </div>
                    {!isBoardListEmpty ? (
                        <main className={`grid scrollbar overflow-auto pt-10
                            ${theme === "light"
                                ? `scrollbar-track-white scrollbar-thumb-gray-300`
                                : `scrollbar-track-[#2b2c37] scrollbar-thumb-[#52525b]`
                            }
                        `}
                            style={{gridTemplateColumns: `repeat(${columnCount}, minmax(250px, 1fr))`}}
                        >
                            {selectedBoard?.columnsList?.map(c => (
                                <div
                                key={c.id}>
                                    <ColumnCol column={c}  activeTask={activeTask} setActiveTask={setActiveTask} columns={selectedBoard.columnsList} tasks={colTasks.filter(t => t.columnId === c.id)} onMoveTask={onMoveTask}/>
                                </div>
                            ))}
                        </main>
                    ): (
                        <div className={`absolute top-1/2 left-1/2 flex justify-center h-fit w-fit- p-4 text-2xl font-semibold border rounded-lg
                            ${theme === "light"
                                ? "bg-white/40 text-indigo-950 border-gray-200"
                                : `${darkScheme.cardBgColor} bg-opacity-40 ${darkScheme.borderColor} ${darkScheme.mainTextColor}`
                            }
                        `}>
                            <p>Create a board to get started</p>
                        </div>
                    )}
                </div>
            </div>
            
            <ModalHost modal={modal} open={modalOpen} openClose={handleModalOpen} board={selectedBoard!} setBoard={setSelectedBoard} boards={boards!}/>
            
        </Toggle>
        </DndProvider>
    )
}

export default MainPage;

// <ModalHost modal={modal} open={modalOpen} openClose={handleModalOpen} board={selectedBoard}/>