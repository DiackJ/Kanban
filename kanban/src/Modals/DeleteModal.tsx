import { Toggle} from '../context/ThemeToggle.tsx';
import { lightScheme } from "../context/LightThemeMain.tsx";
import { darkScheme } from "../context/DarkThemeMain.tsx";
import { useContext } from "react";
import type { GetBoard } from '../Types/GetBoards.tsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { GetBoardNav } from '../Types/GetNavBoards.tsx';

function DeleteModal({type, board, close, setBoard, boards}: {type: string; board: GetBoard | null; close: () => void; setBoard: (id:number) => void; boards: GetBoardNav[]}) {
    const theme = useContext(Toggle).theme;

    async function fetchDelete(id:number): Promise<void> {
        const res = await fetch(`http://localhost:8080/api/v1/board/${id}/delete`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: null
        });

        if (!res.ok) {
            throw new Error("failed to delete board");
        }
    };

    const queryClient =  useQueryClient();

    const deleteBoardMutation = useMutation({
        mutationFn: (id: number) => fetchDelete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["selectedBoard"]})
            setBoard(boards[0].id);
            queryClient.invalidateQueries({queryKey: ["navBoards"]});
            console.log("board deleted successfully");
        }
    });

    async function handleDelete() {
        deleteBoardMutation.mutate(board!.id);
    }; 

    return (
        <div>
            <div className={`align-center text-center
                ${theme === "light"
                    ? `${lightScheme.secondaryTextColor}`
                    : `${darkScheme.mainTextColor}`
                }
                `}>
                <h2 className={`font-bold text-2xl
                        ${theme === "light"
                            ? `text-rose-600`
                            : `text-rose-600/70`
                    }`}>Delete this {type}?</h2>
                <p>Are you sure you want to delete this {type}?</p>
                <p>This action will remove all columns and <em className={`
                        ${theme === "light"
                            ? `text-rose-600`
                            : `text-rose-600/70`
                        }
                    `}>CANNOT BE UNDONE.</em></p>
            </div>
            <div className={`flex justify-center mt-6 space-x-10 mb-4 text-lg transition-all`}>
                <button className={`border py-2 px-4 rounded-lg font-bold
                        ${theme === "light"
                            ? `${lightScheme.borderColor} bg-rose-600 hover:bg-rose-700 text-white`
                            : `${darkScheme.borderColor} bg-rose-700/80 hover:bg-rose-600/80`
                        }
                    `}
                        onClick={() => { 
                            handleDelete().then(() => close());
                        }}
                    >
                    <p>Delete</p>
                </button>
                <button className={`border py-2 px-4 rounded-lg 
                        ${theme === "light"
                            ? `${lightScheme.borderColor} bg-zinc-100 hover:bg-zinc-200`
                            : `${darkScheme.borderColor} ${darkScheme.backgroundColor} hover:bg-zinc-700/80`
                        }
                    `}
                        onClick={close}
                    >
                    <p>Cancel</p>
                </button>
            </div>
        </div>
    )
}

export default DeleteModal;