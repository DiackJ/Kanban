import type{ GetColumns } from "../Types/GetColumnList.tsx";
import type{ GetTask } from "../Types/GetTask.tsx";
import { useDrop  } from "react-dnd";
import TaskCard from "./TaskCard.tsx";
import { useContext, useEffect, useState } from "react";
import { Toggle} from '../context/ThemeToggle.tsx';
import { lightScheme } from "../context/LightThemeMain.tsx";
import { darkScheme } from "../context/DarkThemeMain.tsx";

function ColumnCol({column, activeTask, setActiveTask, columns, tasks, onMoveTask}: {column: GetColumns; activeTask: number | null; setActiveTask: (id: number | null) => void; columns: GetColumns[]; tasks: GetTask[]; onMoveTask: (taskId: number, newColumnId: number, newStatus: string) => void}) {
    const theme = useContext(Toggle).theme;
    
      const [{ isOver, canDrop }, drop] = useDrop(() => ({
          accept: "task", 
          drop: (draggedItem: {id:number}) => {
              onMoveTask(draggedItem.id, column.id, column.statusTitle);
          },
          collect: (monitor) => ({
              isOver: monitor.isOver({shallow: true}),
              canDrop: monitor.canDrop(),
          }),
      }), [column.id, column.statusTitle, onMoveTask]);

      const [columnTaskAmnt, setColumnTaskAmnt] = useState<number>(tasks.length);

      useEffect(() => {
          setColumnTaskAmnt(tasks.length);
      }, [tasks]);
    
    return (
        <div>
        <h3 className="text-gray-400 sm:text-md md:text-lg font-semibold ml-2 md:ml-6">{column.statusTitle} ({columnTaskAmnt})</h3>
        <div
              key={column.id}
              ref={(node) => {drop(node)}}
              className={`min-h-[200px] rounded-lg 
                   ${isOver && canDrop
                       ? `bg-indigo-200/50 pt-1`
                       : ''
                   }
              `}
        >
            <div className="mt-6 w-full px-2">
                {tasks?.sort((a, b) => a.orderNum - b.orderNum).map((t) => (
                    <div
                        key={t?.id} 
                        className={`border rounded-lg shadow-md w-full h-fit p-2 md:p-4 mt-6 flex-col font-semibold hover:cursor-grab active:cursor-grabbing
                            ${theme === "light" 
                            ? `${lightScheme.cardBgColor} ${lightScheme.borderColor}`
                            : `${darkScheme.cardBgColor} ${darkScheme.borderColor} shadow-black`
                            }
                        `}
                        >
                        <TaskCard task={t} activeTask={activeTask} setActive={setActiveTask} columns={columns} />
                    </div>
                ))}

            </div>
        </div>
        </div>
    )
}

  export default ColumnCol;