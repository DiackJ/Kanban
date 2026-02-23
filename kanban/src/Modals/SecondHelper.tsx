import { useContext } from 'react';
import { Toggle} from '../context/ThemeToggle.tsx';
import { darkModal } from '../context/DarkThemeModal.tsx';
import { lightScheme} from '../context/LightThemeNav.tsx';

function SecondHelper({mainOpen, modal, close}: {mainOpen: () => void; modal: (m: string) => void; close: () => void;}) {
    const theme = useContext(Toggle).theme;
    
    return (
        <div>
            
                <div className={`absolute text-sm md:text-md -mt-5 ml-16 md:ml-32 lg:ml-48 xl:ml-64 border h-fit w-fit p-2
                    ${theme == "light"
                        ? `${lightScheme.backgroundColor} border-gray-400`
                        : `${darkModal.background} ${darkModal.borderColor}`
                    }
                   `}
                >
                    <p className={`hover:cursor-pointer 
                        ${theme === "light"
                            ? `text-indigo-950`
                            : `${darkModal.secondaryText}`
                        }
                    `}
                        onClick={() => {
                            close();
                            modal("editTask"); 
                            mainOpen();
                        }}
                    >Edit Task</p>
                    <p className={`hover: cursor-pointer
                            ${theme === "light"
                                ? `text-rose-600}`
                                : `text-rose-600/70`
                            }
                        `}
                        onClick={() => {
                            close();
                            modal("deleteTask");
                            mainOpen();
                        }}
                    >Delete Task</p>
                </div>
            
            </div>
    ) 
}

export default SecondHelper;