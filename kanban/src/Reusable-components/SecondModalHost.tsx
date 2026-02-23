import { useContext } from "react";
import { Toggle } from "../context/ThemeToggle.tsx";
import { darkModal } from  "../context/DarkThemeModal.tsx";
import { motion } from "motion/react";
import type { GetTask } from "../Types/GetTask.tsx";
import  EditTaskModal  from "../Modals/EditTaskModal.tsx";  
import  DeleteTaskModal  from "../Modals/DeleteTask.tsx";
import type { GetColumns } from "../Types/GetColumnList.tsx";
import ViewTaskModal from "../Modals/ViewTaskModal.tsx";

function SecondModalHost({modal, open, openClose, task, columns}: {modal: string; open: boolean; openClose: () => void; task: GetTask; columns: GetColumns[]}) {
    const theme = useContext(Toggle).theme;

    return (
        <div>
            {open && (
                <div className="flex justify-center items-center px-2 fixed inset-0 bg-black/60">
                    <motion.div 
                            initial={{ y: -50, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 15, mass: 2 }}
                            animate={{ y: 0, opacity: 1}} 
                            
                            className={`border rounded-lg h-fit w-[450px]
                        ${theme === "light"
                            ? `border-white bg-white text-indigo-950`
                            : `${darkModal.borderColor} ${darkModal.background} ${darkModal.secondaryText}`
                        }
                        `}>
                        <div className="flex justify-end -mt-2 -mr-2 cursor-pointer"
                            onClick={openClose}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 640 640"
                                height={14}
                                width={14}
                                className={`border rounded-full h-fit w-fit p-1
                                    ${theme === "light"
                                        ? `bg-zinc-100 fill-indigo-950 border-gray-300`
                                        : `${darkModal.background} ${darkModal.borderColor} fill-gray-300`
                                    }    
                                `}
                                >
                                <path d="M504.6 148.5C515.9 134.9 514.1 114.7 500.5 103.4C486.9 92.1 466.7 93.9 455.4 107.5L320 270L184.6 107.5C173.3 93.9 153.1 92.1 139.5 103.4C125.9 114.7 124.1 134.9 135.4 148.5L278.3 320L135.4 491.5C124.1 505.1 125.9 525.3 139.5 536.6C153.1 547.9 173.3 546.1 184.6 532.5L320 370L455.4 532.5C466.7 546.1 486.9 547.9 500.5 536.6C514.1 525.3 515.9 505.1 504.6 491.5L361.7 320L504.6 148.5z"/>
                            </svg>
                        </div>
                        <div

                            className="py-2 px-6 -mt-5">
                             {(() => {
                                switch(modal) {
                                    case "editTask":
                                        return <EditTaskModal task={task} columns={columns} close={openClose}/>
                                    case "deleteTask":
                                        return <DeleteTaskModal task={task} close={openClose}/>
                                    case "viewTask":
                                        return <ViewTaskModal task={task} />
                                    default:
                                        return null
                                }}
                            )()} 
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}

export default SecondModalHost;