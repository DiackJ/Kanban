import { useDrag } from "react-dnd";
import type { GetTask } from "../Types/GetTask.tsx";
import { useContext, useState } from "react";
import { Toggle} from '../context/ThemeToggle.tsx'; 
import SecondModalHost from "./SecondModalHost.tsx";
import SecondHelper from "../Modals/SecondHelper.tsx";
import type{ GetColumns } from "../Types/GetColumnList.tsx";

function TaskCard({task, activeTask, setActive, columns}: {task: GetTask; activeTask: number | null; setActive: (id: number | null) => void; columns: GetColumns[]}) {
    const theme = useContext(Toggle).theme;
      const [{isDragging}, drag] = useDrag(() => ({
        type: "task",
        // item payload
        item: {
            id: task.id, 
            columnId: task.columnId, 
            statusColumn: task.statusColumn,
        },
        collect: (monitor) => ({
            // bc every task obj will be dragable we want to single out currently selected task
            isDragging: monitor.isDragging() && monitor.getItem()?.id === task.id
        }),
      }), [task])

    const [open, setOpen] =  useState<boolean>(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const openClose = () => {
        setOpen(!open);
    };

    const [modal, setModal] = useState<string>("");
   
    const handleCloseHelper = () => {
        if(activeTask !== null) {
            setActive(null);
        }
    };

//console.log("task: " + task.id + " column: " + task.columnId + " order: " + task.order + " status: " + task.statusColumn);

    return (
     <div
              ref={(node) => { drag(node) } }
              style={{
                  opacity: isDragging ? 0.5 : 1
              }}
        >
            <div className={`flex justify-between`}
            > 
                <div className={`w-11/12`}
                    onClick={ () => {
                    setModal("viewTask");
                    handleOpen();
                }}
                >
                    <p className={`text-md md:text-lg font-semibold
                    ${theme === "light"
                            ? `text-indigo-950`
                            : `text-[#9796b2]`}
                `}>{task.taskTitle}</p>
                    <p className="text-xs md:text-sm text-gray-500 font-semibold">{task.numOfCompleteTasks} of {task.subtasks?.length || 0} subtasks</p>
                </div>
                <div className={`hover:cursor-pointer`}
                    onClick={() => {
                        setActive(task.id);
                        handleCloseHelper();
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 640"
                        height={16}
                        width={16}
                        className="fill-gray-400"
                    >
                        <path d="M320 208C289.1 208 264 182.9 264 152C264 121.1 289.1 96 320 96C350.9 96 376 121.1 376 152C376 182.9 350.9 208 320 208zM320 432C350.9 432 376 457.1 376 488C376 518.9 350.9 544 320 544C289.1 544 264 518.9 264 488C264 457.1 289.1 432 320 432zM376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320z" />
                    </svg>
                </div>
            </div>
            {activeTask === task.id && 
                <SecondHelper mainOpen={handleOpen} modal={setModal} close={handleCloseHelper} />
            }
    
         <SecondModalHost modal={modal} open={open} openClose={openClose} task={task} columns={columns}/> 
    </div>
    )
}

export default TaskCard;