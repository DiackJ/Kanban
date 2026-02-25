import { useState, useContext } from "react";
import { Toggle } from "../context/ThemeToggle.tsx";
import { darkModal } from "../context/DarkThemeModal.tsx";
import type { GetBoard } from "../Types/GetBoards.tsx";
import { lightScheme } from "../context/LightThemeNav.tsx";
import type { EditBoard } from "../Types/EditBoard.tsx";
import type { AddColumn } from "../Types/AddColumn.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function EditBoardModal({board, close}: {board: GetBoard | null; close: () => void}) {
    const theme = useContext(Toggle).theme;
        const [charCount, setCharCount] = useState<number>(200);
        const [description, setDescription] = useState<string>("");
        const [boardTitle, setTitle] = useState<string>(board!.boardTitle);
        const [statusTitle, setStatusTitle] = useState<string>("");
        const [removedCols, setRemovedCols] = useState<number[]>([]);

        const handleTitle = (v:string) => {
            setTitle(v);
        };

        const handleColTitle = (v:string) => {
            setStatusTitle(v);
        };
    
        const handleDescriptionCount = (v: string) => {
            setDescription(v);
            setCharCount(200 - v.length);
        };

        const handleRemovedCols = (id: number) => {
            if(!removedCols.includes(id)){
                setRemovedCols([...removedCols, id]);
            }
        };

        type Edit = {
            boardTitle?: string;
            description?: string;
        };
        const editBoardReq:Edit = {
            boardTitle, 
            description
        };

        async function fetchEditBoard(req:Edit, id:number) : Promise<EditBoard> {
            const res = await fetch(`http://localhost:8080/api/v1/board/${id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(req)
            });

            if (!res.ok) {
                throw new Error("failed to edit board " + board!.boardTitle);
            }

            return res.json();
        };

        const queryClient = useQueryClient();

        type EditReq = {
            data: Edit;
            id: number;
        };

        const editBoardMutation = useMutation({
            mutationFn: ({data, id}:EditReq) => fetchEditBoard(data, id),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ["selectedBoard"]});
                queryClient.invalidateQueries({queryKey: ["navBoards"]});
                console.log("board editied successfully");
            }
        });

        async function handleEditBoard() {
            editBoardMutation.mutate({data: editBoardReq, id: board!.id});
        };

        const [colList, setColList] = useState<string[]>([]);
        const handleAddColumn = () => {
                setColList([...colList, ""]);
        };
        
        const handleChange = (i: number, v: string) => {
            const update = [...colList];
            update[i] = v;
            setColList(update);
            setStatusTitle(v);
        };
        
        const handleRemovedNewCols = (i: number) => {
            setColList(colList.filter((_, index) => index !== i))
        };

        async function fetchRemoveColumn(id:number): Promise<void> {
            const res = await fetch(`http://localhost:8080/api/v1/column/${id}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: null
            });

            if (!res.ok) {
                throw new Error("failed to delete column");
            }
        };

        const removeColumnsMutation = useMutation({
            mutationFn: (id:number) => fetchRemoveColumn(id),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ["selectedBoard"]});
                console.log("column removed successfully");
            }
        });

        async function handleRemoveColumn(id:number) {
           removeColumnsMutation.mutate(id);
        };

        type ColReq = {
            statusTitle: string;
        };

        const col:ColReq = {
            statusTitle: statusTitle
        };

        async function fetchAddColumn(data:ColReq, id:number): Promise<AddColumn> {
            const res = await fetch(`http://localhost:8080/api/v1/board/${id}/column`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (res.status !== 201) {
                throw new Error("failed to add column");
            }

            return res.json();
        };
        
        type ColData ={
            data: ColReq;
            id: number;
        };

        const addColumnMutation = useMutation({
            mutationFn: ({data, id}: ColData) => fetchAddColumn(data, id),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ["selectedBoard"]});
                console.log("column added successfully");
            }
        });

        async function handleAddNewColumn() {
            addColumnMutation.mutate({data: col, id: board!.id});
        };

        async function fetchEditColumn(data: ColReq, id: number): Promise<AddColumn> {
            const res = await fetch(`http://localhost:8080/api/v1/column/${id}`, {
                method: "PUT",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if(!res.ok) {
                throw new Error("failed to edit column");
            }

            return res.json();
        };

        const editColumnMutation = useMutation({
            mutationFn: ({data, id}: ColData) => fetchEditColumn(data, id),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ["selectedBoard"]});
                console.log("column edited successfully");
            }
        });

        async function handleEditColumn(id:number) {
            editColumnMutation.mutate({data: col, id});
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
                           `}>{board.boardTitle}</h1>
                       <div>
                           <p>Board Title</p>
                           <input type="text" 
                               value={boardTitle} 
                               className={`border p-1 rounded-md mb-4 w-full
                                   ${theme === "light"
                                       ? `border-gray-500`
                                       : `${darkModal.borderColor} ${darkModal.background}`
                                   }    
                               `}
                               onChange={(e) => handleTitle(e.target.value)}
                           />
                           <p>Description <em>(optional)</em></p>
                           <textarea maxLength={200}
                               placeholder={board.description}
                               className={`border p-1 rounded-md w-full mb-4
                                   ${theme === "light"
                                       ? 'border-gray-500'
                                       : `${darkModal.borderColor} ${darkModal.background}`
                                   }
                               `}
                               onChange={(e) => handleDescriptionCount(e.target.value)}
                           >
                           </textarea> 
                           <p className="-mt-2 text-sm ml-44">characters remaing: {charCount}</p>
                       </div>
                       <div>
                           <p>Columns</p>
                           {board.columnsList.map((col) => (
                               <div
                                   key={col.id} 
                                   className={`${removedCols.includes(col.id) ? "hidden" : "contents"}`}
                                   >
                                       <input
                                            type="text"
                                            placeholder={col.statusTitle}
                                            className={`border py-1 px-2 rounded-md w-full mb-4
                                                ${theme === "light"
                                                    ? `border-gray-500 ${lightScheme.backgroundColor}`
                                                    : `${darkModal.borderColor} ${darkModal.background}`
                                                }
                                            `}
                                            onChange={(e) => handleColTitle(e.target.value)}
                                            onBlur={() => handleEditColumn(col.id)}
                                       ></input>
                                       <div className={`hover:cursor-pointer absolute -mt-11 ml-2`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" 
                                               viewBox="0 0 640 640"
                                               key={col.id}
                                               height={16}
                                               width={16}
                                               style={{marginLeft: "333px"}}
                                               className={`fill-zinc-500`}
                                               onClick={() => {
                                                    handleRemovedCols(col.id)
                                                    handleRemoveColumn(col.id)
                                               }}
                                               >
                                               <path d="M64 488C64 474.7 74.7 464 88 464L552 464C565.3 464 576 474.7 576 488C576 501.3 565.3 512 552 512L88 512C74.7 512 64 501.3 64 488z"/>
                                           </svg>
                                        </div>
                               </div>
                           ))}
                           {colList.map((v, i) => (
                                <div
                                    key={i}
                                >
                                    <input
                                        key={i}
                                        type = "text"
                                        placeholder="New Column"
                                        value={v}
                                        className={`w-full py-1 px-2 border rounded-md mb-4 placeholder-zinc-600
                                            ${theme === "light"
                                                ? `${lightScheme.backgroundColor} border-gray-500`
                                                : `${darkModal.background} ${darkModal.borderColor}`
                                            }
                                        `}
                                        onChange={(e) => handleChange(i, e.target.value)}
                                        onBlur={handleAddNewColumn}
                                    >
                                    </input>
                                    <div className={`hover:cursor-pointer absolute -mt-11 ml-2`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 0 640 640"
                                            key={i}
                                            height={16}
                                            width={16}
                                            style={{marginLeft: "333px"}}
                                            className={`fill-zinc-500`}
                                            onClick={(() => handleRemovedNewCols(i))}
                                            >
                                            <path d="M64 488C64 474.7 74.7 464 88 464L552 464C565.3 464 576 474.7 576 488C576 501.3 565.3 512 552 512L88 512C74.7 512 64 501.3 64 488z"/>
                                        </svg>
                                    </div>
                                </div>
                            ))}
                           <button className={`inline-flex justify-center items-center w-full font-semibold hover:cursor-pointer rounded-xl border h-fit p-1 transition-all
                                   ${theme === "light"
                                       ? `border-indigo-100 bg-indigo-400 text-indigo-950 hover:bg-indigo-200`
                                       : `${darkModal.secondaryButtonBg} ${darkModal.buttonBorder} text-zinc-900 ${darkModal.secondaryButtonHover}`
                                   }
                               `}
                                 onClick={handleAddColumn}
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
                               <p>Add New Column</p>
                           </button>
                       </div>
                       <button className={`border p-1 rounded-xl transition-all hover:cursor-pointer w-full mt-6 font-semibold
                               ${theme === "light"
                                   ? `border-indigo-600 bg-indigo-600 hover:bg-indigo-400 text-indigo-950`
                                   : `${darkModal.buttonBorder} ${darkModal.mainButtonBg} ${darkModal.mainButtonHover} ${darkModal.mainButtonText}`
                               }
                           `}
                            onClick={() => {
                                handleEditBoard();
                                close();
                            }}
                           >
                           <p>Save Changes</p>
                       </button>
                   </div>
                )}
               </div>
           )
}

export default EditBoardModal;