import type { GetBoard } from "../Types/GetBoards.tsx";
import { useContext } from "react";
import { Toggle } from "../context/ThemeToggle.tsx";
import { darkScheme } from "../context/DarkThemeMain.tsx";
import { lightScheme } from "../context/LightThemeMain.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function ResetBoardModal({board, close}: {board: GetBoard | null; close: () => void}) {
    const theme = useContext(Toggle).theme; 

    async function fetchReset(id:number): Promise<void> {
        const res = await fetch(`http://localhost:8080/api/v1/board/${id}/reset`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: null
        });
        if (!res.ok) {
            throw new Error("failed to reset board");
        }
    };

    const queryClient = useQueryClient();

    const resetBoardMutation = useMutation({
        mutationFn: (id:number) => fetchReset(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["selectedBoard"]});
            console.log("board reset successfully");
        }
    });

    async function handleReset() {
        resetBoardMutation.mutate(board!.id);
    };

    return (
        <div className={`align-center text-center`}>
            <div>
                <h1 className={`font-bold text-2xl
                        ${theme === "light"
                            ? `text-amber-500`
                            : `text-amber-500/70`
                        }
                    `}>Reset this board?</h1>
                <p>Are you sure you want to reset this board? This action will remove all columns, tasks, and subtasks from your board and </p>
                <p><em className={`
                    ${theme === "light"
                        ? `text-rose-600`
                        : `text-rose-600/70`
                    }
                `}
                >CANNOT BE UNDONE.</em></p>
            </div>
            <div className={`space-x-10 mt-4 mb-2 text-lg font-bold`}>
                <button className={`py-2 px-4 border rounded-lg
                    ${theme === "light"
                        ? `bg-amber-500`
                        : `bg-amber-600/70 text-zinc-800 ${darkScheme.borderColor} hover:bg-amber-500/70`
                    }
                `}
                    onClick={() => {handleReset().then(() => close())}}
                >Reset</button>
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

export default ResetBoardModal;