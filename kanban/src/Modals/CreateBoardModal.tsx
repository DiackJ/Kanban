import { useContext, useState } from "react";
import { Toggle } from "../context/ThemeToggle.tsx";
import { darkModal } from "../context/DarkThemeModal.tsx"; 
import { lightScheme } from "../context/LightThemeNav.tsx";
//import type { CreateBoard } from "../Types/CreateBoard.tsx";
import type { GetBoard } from "../Types/GetBoards.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function CreateBoardModal({close}: {close: () => void}) {
    const theme = useContext(Toggle).theme;
    const [charCount, setCharCount] = useState<number>(200);
    const [boardTitle, setBoardTitle] = useState<string>("New Board");
    const [description, setDescription] = useState<string>("");
    //const [removedCols, setRemovedCols] = useState<number[]>([]);
    
    //const [newBoard, setNewBoard] = useState<GetBoard>();
    // default columns before board creation
    const defaultCols = [
        {id: 1, statusTitle: "To Do"},
        {id: 2, statusTitle: "In Progress"}
    ];
    // render default columns before board is created then render the created columns to avoid dupes
    //const cols = newBoard?.columnsList ?? defaultCols;
    
    // description character count
    const handleDescriptionCount = (v: string) => {
        setDescription(v);
        setCharCount(200 - v.length);
    };
    // warnings for title input
    const [titleWarning, setTitleWarning] = useState<string>("");
    const handleTitleWarning = (v: string) => {
        if (v.trim() === "" || v.trim() === "New Board") {
            setTitleWarning("Board title is required.");
        } else {
            setTitleWarning("");
        }
    };

    // set new board title
    const handleBoard = (v: string) => {
        setBoardTitle(v);

        if (v.trim() !== "" || v !== "New Board") {
            setTitleWarning("");
        }
    };
    
    // list of new columns to add to board
     const [colList, setColList] = useState<string[]>([]);
     const handleAddColumn = () => {
         setColList(prev => [...prev, ""]);
     };
    
    // hold new inputs for columns
    const handleNewInput = (i: number, v: string) => {
        setColList(prev => 
            prev.map((col, index) => 
                index === i ? v : col)
        );
    };
    
    type CreateBoard = {
        boardTitle: string;
        description?: string;
        columns?: string[];
    };
    const boardData:CreateBoard = {
        boardTitle: boardTitle,
        description: description,
        columns: colList
    };
    // create new board
    async function fetchCreateBoard(data: CreateBoard): Promise<GetBoard> {
        const res = await fetch("http://localhost:8080/api/v1/board", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (res.status !== 201) {
            throw new Error("failed to create board");
        }

        return res.json();
    };

    const queryClient = useQueryClient();
    const createBoardMutation = useMutation({
        mutationFn: (data: CreateBoard) => fetchCreateBoard(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["navBoards"] });
            console.log("board created successfully");
        }
    });

     async function handleCreateBoard() {
        createBoardMutation.mutate(boardData);
     };

   // remove uncreated col input fields
    const handleRemovedNewCols = (i: number) => {
        setColList(colList.filter((_, index) => index !== i));
    };
 
    return (
        <div>
            <div>
                <h1 className={`font-bold text-xl mb-6
                        ${theme === "light"
                            ? `text-indigo-950`
                            : `${darkModal.mainText}`
                        }
                    `}>{boardTitle}</h1>
                <div>
                    <p className={`${titleWarning !== "" && "text-rose-600/70"}`}>Board Title</p>
                    <input type="text" 
                        placeholder={boardTitle}
                        className={`border p-1 rounded-md mb-4 w-full placeholder-gray-400/50
                            ${theme === "light"
                                ? `border-gray-500`
                                : `${darkModal.borderColor} ${darkModal.background}`
                            }    
                            ${titleWarning !== "" && `border-rose-600/70`}
                        `}
                        onChange={(e) => handleBoard(e.target.value)}
                        // onBlur={() => {
                        //     handleTitleWarning(boardTitle);
                        // }}
                    />
                    {titleWarning !== "" && 
                        <p className={`absolute -mt-4 text-sm text-rose-600/70`}>{titleWarning}</p>
                    }
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
                    <p className="-mt-2 text-sm ml-44">characters remaing: {charCount}</p>
                </div>
                <div>
                    <p>Columns</p>
                    {defaultCols.map((col) => (
                        <div
                            key={col.id} 
                            >
                                <div
                                    //type = "text"
                                    //placeholder={col.statusTitle}
                                    className={`w-full py-1 px-2 border rounded-md mb-4
                                            ${theme === "light"
                                                ? `${lightScheme.backgroundColor} border-gray-500`
                                                : `${darkModal.background} ${darkModal.borderColor}`
                                            }
                                        `}
                                        //onChange={(e) => {handleColTitle(e.target.value)}} // pass colTitle as statusTitle for API
                                >
                                    <p>{col.statusTitle}</p>
                                </div>
                                {/* <div className={`absolute -mt-11 ml-2 hover:cursor-pointer`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 640 640"
                                        key={col.id}
                                        height={16}
                                        width={16}
                                        style={{marginLeft: "333px"}}
                                        className={`fill-zinc-500`}
                                        onClick={(() => handleRemovedCols(col.id))}
                                        >
                                        <path d="M64 488C64 474.7 74.7 464 88 464L552 464C565.3 464 576 474.7 576 488C576 501.3 565.3 512 552 512L88 512C74.7 512 64 501.3 64 488z"/>
                                    </svg> 
                                </div> */}
                        </div>
                    ))}
                    {colList.map((v, i) => (
                        <div
                            key={`col-${i}`}
                        >
                            <input
                                type = "text"
                                placeholder="New Column"
                                value={v}
                                className={`w-full py-1 px-2 border rounded-md mb-4 hover:cursor-pointer placeholder-zinc-600
                                    ${theme === "light"
                                        ? `${lightScheme.backgroundColor} border-gray-500`
                                        : `${darkModal.background} ${darkModal.borderColor}`
                                    }
                                `}
                                onChange={(e) => handleNewInput(i, e.target.value)}
                            >
                            </input>
                            <div className={`absolute -mt-11 ml-2 hover:cursor-pointer`}>
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
                            ? `border-indigo-600 bg-indigo-600 hover:bg-indigo-400 text-indigo-50`
                            : `${darkModal.buttonBorder} ${darkModal.mainButtonBg} ${darkModal.mainButtonHover} ${darkModal.mainButtonText}`
                        }
                        ${titleWarning !== ""  && "hover:cursor-not-allowed"}
                    `}
                        disabled={titleWarning !== ""}
                        onClick={() => {
                            handleCreateBoard().then(() => close());
                        }}
                    >
                    <p>Create Board</p>
                </button>
            </div>
        </div>
    )
}

export default CreateBoardModal;