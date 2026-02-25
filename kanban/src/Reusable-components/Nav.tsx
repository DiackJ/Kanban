//import NavData from "../Test-data/NavData.json"
import { useState, useEffect } from "react";
import type { GetBoardNav } from "../Types/GetNavBoards.tsx";
import { useContext } from "react";
import { Toggle } from "../context/ThemeToggle.tsx";
import { lightScheme } from "../context/LightThemeNav.tsx";
import { darkScheme } from "../context/DarkThemeNav.tsx";
import { motion, AnimatePresence } from "motion/react";

function Nav({navIsActive, navFunc, boards, setActiveBoard, openModal, modalType}: {navIsActive: boolean; navFunc: () => void; boards: GetBoardNav[]; setActiveBoard: (id: number) => void; openModal: () => void; modalType: (m: string) => void;}) {
    // which board to highlight as active
    const [active, setActive] = useState<number | null>(); 
    useEffect(() => {
        if (active === null || active === undefined) {
            setActive(boards[0]?.id);
        }
    });
    // number of boards of user
    const boardCount = boards.length;
    // light/dark theme toggle
    const toggleTheme = useContext(Toggle).toggleTheme;
    const theme = useContext(Toggle).theme;

    // set the active selected board
    const handleActive = (id: number) => {
        setActive(id);
    };

    return (
        <div>
            <Toggle value={{theme, toggleTheme}}>
            <AnimatePresence>
            {navIsActive ? (
            <motion.div 
                key="nav"
                  //initial={{ x: -50, opacity: 0, scale: 1}}
                  //animate={{ x: 0, opacity:1, scale: 1, transition: { ease: "easeOut", duration: 0.3 }}}
                 //exit={{ x: -50, opacity: 0, scale: 0.95, transition: { ease: "easeIn", duration: 0.2 }}} 
                className={`h-screen relative border-r pr-10
                ${theme === "light"
                    ? `${lightScheme.backgroundColor} ${lightScheme.otherBorder} ${lightScheme.logoTextColor}`
                    : `${darkScheme.backgroundColor} ${darkScheme.otherBorder} ${darkScheme.logoTextColor}`
                }
                `}>
                <div className="inline-flex space-x-2 mt-5">
                    <div className="inline-flex items-end space-x-0.5 pl-4">
                        <div className={`h-5 w-2 rounded-t-lg rounded-b-lg
                            ${theme === "light" 
                                ? `${lightScheme.divOne}`
                                : `${darkScheme.divOne}`
                            }
                        `}></div>
                        <div className={`h-10 w-2 bg-indigo-400/70 rounded-t-lg rounded-b-lg
                            ${theme === "light" 
                                ? `${lightScheme.divTwo}`
                                : `${darkScheme.divTwo}`
                            }    
                        `}></div>
                        <div className={`h-8 w-2 bg-indigo-200/70 rounded-t-lg rounded-b-lg
                            ${theme === "light" 
                                ? `${lightScheme.divThree}`
                                : `${darkScheme.divThree}`
                            }    
                        `}></div>
                    </div>
                    <h1 className={`text-4xl font-bold
                            ${theme === "light"
                                ? `${lightScheme.logoTextColor}`
                                : `${darkScheme.logoTextColor}`
                            }
                        `}>Kanban</h1>
                </div> 
                <div>
                    <div className={`mt-10 mb-2 border-b text-gray-400 pl-4 pb-2
                            ${theme === "light" 
                                ? `${lightScheme.otherBorder}`
                                : `${darkScheme.otherBorder}`
                            }    
                    `}>
                        <h3 className="text-xl font-semibold">All Boards ({boardCount})</h3>
                    </div>
                    
                    {boards.map((b => (
                        <div 
                            key={b.id}
                            className={`flex justify-start p-2 space-x-2 pl-6 mr-16 font-semibold 
                                ${b.id === active 
                                        ? `bg-[#635fc7] hover:cursor-pointer rounded-r-full
                                            ${theme === "light" 
                                                ? `${lightScheme.activeSelect} ${lightScheme.activeText} ${lightScheme.activeFill}`
                                                : `${darkScheme.activeSelect} ${darkScheme.activeText} ${darkScheme.activeFill}`
                                            }`
                                        : `text-gray-400 fill-gray-400 hover:cursor-pointer hover:rounded-r-full
                                            ${theme === "light" 
                                                ? `${lightScheme.hoverSelect} ${lightScheme.hoverBg} ${lightScheme.hoverText} ${lightScheme.hoverFill}`
                                                : `${darkScheme.hoverSelect} ${darkScheme.hoverBg} ${darkScheme.hoverText} ${darkScheme.hoverFill}`
                                            }`
                                    }`}
                            onClick={() => {handleActive(b.id); setActiveBoard(b.id);}}
                        >
                            <div className="mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" 
                                    height={18} 
                                    width={18}
                                    className={`scale-x-[-1] rotate-90`}
                                    >
                                    <path d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z">
                                    </path>
                                </svg>
                            </div>
                            <p>{b.boardTitle}</p>
                        
                        </div>
                    )))}
                </div>

                <div>
                    <button className={`inline-flex px-6 justify-center items-center text-lg font-semibold mt-4
                        ${theme === "light"
                            ? `text-violet-600 hover:bg-indigo-100/50 rounded-r-full`
                            : `hover:bg-indigo-100/70 text-zinc-500 rounded-r-full`
                        }
                        `}
                        onClick={() => {openModal(); modalType("createBoard")}}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 640 640"
                            height={20}
                            width={20}
                            className={`
                                ${theme === "light" 
                                    ? `fill-violet-600`
                                    : `fill-zinc-500`
                                }
                            `}
                            >
                            <path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/>
                        </svg>
                        <p>New Board</p>
                    </button>
                </div>
                
                
                <div className={`absolute bottom-10 ml-16 w-fit h-fit p-2 flex justify-between space-x-4 rounded-lg
                        ${theme === "light" 
                        ? `${lightScheme.toggleBg} ${lightScheme.otherBorder}`
                        : `${darkScheme.toggleBg} ${darkScheme.otherBorder}`
                        }    
                `}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                    width={19}
                    height={19}
                    className={`mt-1
                            ${theme === "light" 
                            ? `${lightScheme.toggleSvgFill}`
                            : `${darkScheme.toggleSvgFill}`
                            }
                        `}
                    >
                    <path d="M9.167 15.833a.833.833 0 0 1 .833.834v.833a.833.833 0 0 1-1.667 0v-.833a.833.833 0 0 1 .834-.834ZM3.75 13.75a.833.833 0 0 1 .59 1.422l-1.25 1.25a.833.833 0 0 1-1.18-1.178l1.25-1.25a.833.833 0 0 1 .59-.244Zm10.833 0c.221 0 .433.088.59.244l1.25 1.25a.833.833 0 0 1-1.179 1.178l-1.25-1.25a.833.833 0 0 1 .59-1.422ZM9.167 5a4.167 4.167 0 1 1 0 8.334 4.167 4.167 0 0 1 0-8.334Zm-7.5 3.333a.833.833 0 0 1 0 1.667H.833a.833.833 0 1 1 0-1.667h.834Zm15.833 0a.833.833 0 0 1 0 1.667h-.833a.833.833 0 0 1 0-1.667h.833Zm-1.667-6.666a.833.833 0 0 1 .59 1.422l-1.25 1.25a.833.833 0 1 1-1.179-1.178l1.25-1.25a.833.833 0 0 1 .59-.244Zm-13.333 0c.221 0 .433.088.59.244l1.25 1.25a.833.833 0 0 1-1.18 1.178L1.91 3.09a.833.833 0 0 1 .59-1.422ZM9.167 0A.833.833 0 0 1 10 .833v.834a.833.833 0 1 1-1.667 0V.833A.833.833 0 0 1 9.167 0Z"></path>
                    </svg>
                    <div
                        className={`flex items-center px-1 h-6 w-14 transition-all duration-500 border rounded-full
                        ${theme === "light" 
                            ? `justify-start ${lightScheme.toggleButtonBg} ${lightScheme.otherBorder}`
                            : `justify-end ${darkScheme.toggleButtonBg} ${darkScheme.otherBorder}`
                        }`}
                            onClick={toggleTheme}
                    >
                        <motion.div 
                            layout
                            style={{ justifyContent: theme === "light" ? "flex-start" : "flex-end"}}
                            className={`rounded-full h-4 w-4
                            ${theme === "light" 
                                ? `${lightScheme.toggleCircle}`
                                : `${darkScheme.toggleCircle}`
                            }    
                        `}></motion.div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        width={19} 
                        height={19}
                        className={`mt-1
                            ${theme === "light" 
                                ? `${lightScheme.toggleSvgFill}`
                                : `${darkScheme.toggleSvgFill}`
                            }
                            `}
                        >
                        <path d="M6.474.682c.434-.11.718.406.481.78A6.067 6.067 0 0 0 6.01 4.72c0 3.418 2.827 6.187 6.314 6.187.89.002 1.77-.182 2.584-.54.408-.18.894.165.724.57-1.16 2.775-3.944 4.73-7.194 4.73-4.292 0-7.771-3.41-7.771-7.615 0-3.541 2.466-6.518 5.807-7.37Zm8.433.07c.442-.294.969.232.674.674l-.525.787a1.943 1.943 0 0 0 0 2.157l.525.788c.295.441-.232.968-.674.673l-.787-.525a1.943 1.943 0 0 0-2.157 0l-.786.525c-.442.295-.97-.232-.675-.673l.525-.788a1.943 1.943 0 0 0 0-2.157l-.525-.787c-.295-.442.232-.968.674-.673l.787.525a1.943 1.943 0 0 0 2.157 0Z"></path>
                    </svg>
                </div>

                <div className="absolute bottom-2 ml-16 inline-flex space-x-2 hover:cursor-pointer"
                    onClick={navFunc}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 640 640"
                        height={19}
                        width={19}
                        className="fill-gray-500 mt-2"
                        >
                        <path d="M73 39.1C63.6 29.7 48.4 29.7 39.1 39.1C29.8 48.5 29.7 63.7 39 73.1L567 601.1C576.4 610.5 591.6 610.5 600.9 601.1C610.2 591.7 610.3 576.5 600.9 567.2L504.5 470.8C507.2 468.4 509.9 466 512.5 463.6C559.3 420.1 590.6 368.2 605.5 332.5C608.8 324.6 608.8 315.8 605.5 307.9C590.6 272.2 559.3 220.2 512.5 176.8C465.4 133.1 400.7 96.2 319.9 96.2C263.1 96.2 214.3 114.4 173.9 140.4L73 39.1zM208.9 175.1C241 156.2 278.1 144 320 144C385.2 144 438.8 173.6 479.9 211.7C518.4 247.4 545 290 558.5 320C544.9 350 518.3 392.5 479.9 428.3C476.8 431.1 473.7 433.9 470.5 436.7L425.8 392C439.8 371.5 448 346.7 448 320C448 249.3 390.7 192 320 192C293.3 192 268.5 200.2 248 214.2L208.9 175.1zM390.9 357.1L282.9 249.1C294 243.3 306.6 240 320 240C364.2 240 400 275.8 400 320C400 333.4 396.7 346 390.9 357.1zM135.4 237.2L101.4 203.2C68.8 240 46.4 279 34.5 307.7C31.2 315.6 31.2 324.4 34.5 332.3C49.4 368 80.7 420 127.5 463.4C174.6 507.1 239.3 544 320.1 544C357.4 544 391.3 536.1 421.6 523.4L384.2 486C364.2 492.4 342.8 496 320 496C254.8 496 201.2 466.4 160.1 428.3C121.6 392.6 95 350 81.5 320C91.9 296.9 110.1 266.4 135.5 237.2z"/>
                    </svg>
                    <p className="text-gray-500 mt-1">Hide sidebar</p>
                </div>
            </motion.div>
            ) :
            <div className={`absolute hover:cursor-pointer h-fit w-fit py-2 px-4 bottom-20 border-r rounded-r-full flex justify-center
                ${theme === "light"
                    ? `bg-indigo-500 border-indigo-500`
                    : `bg-[#685fc7] border-[#685fc7]`
                }
            `}
            onClick={navFunc}
            >
                <svg xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 640 640"
                    height={16}
                    width={16}
                    className={`fill-white`}
                    >
                    <path d="M320 96C239.2 96 174.5 132.8 127.4 176.6C80.6 220.1 49.3 272 34.4 307.7C31.1 315.6 31.1 324.4 34.4 332.3C49.3 368 80.6 420 127.4 463.4C174.5 507.1 239.2 544 320 544C400.8 544 465.5 507.2 512.6 463.4C559.4 419.9 590.7 368 605.6 332.3C608.9 324.4 608.9 315.6 605.6 307.7C590.7 272 559.4 220 512.6 176.6C465.5 132.9 400.8 96 320 96zM176 320C176 240.5 240.5 176 320 176C399.5 176 464 240.5 464 320C464 399.5 399.5 464 320 464C240.5 464 176 399.5 176 320zM320 256C320 291.3 291.3 320 256 320C244.5 320 233.7 317 224.3 311.6C223.3 322.5 224.2 333.7 227.2 344.8C240.9 396 293.6 426.4 344.8 412.7C396 399 426.4 346.3 412.7 295.1C400.5 249.4 357.2 220.3 311.6 224.3C316.9 233.6 320 244.4 320 256z"/>
                </svg>
            </div>
        }
            </AnimatePresence>
            </Toggle>
        </div>
    )
}

export default Nav;