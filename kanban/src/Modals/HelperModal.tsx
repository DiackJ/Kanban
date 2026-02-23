import { Toggle } from "../context/ThemeToggle.tsx";
import { useContext } from "react";
import { lightScheme } from "../context/LightThemeMain.tsx";
import { darkScheme } from "../context/DarkThemeMain.tsx";
import { useNavigate } from "react-router-dom";

function HelperModal({open, openMainModal, mainModal, close}: {open: boolean; openMainModal: () => void; mainModal: (m: string) => void; close: () => void;}){
    const theme = useContext(Toggle).theme;
    const navigate = useNavigate();
    
    const fetchLogout = async () => {
        const res = await fetch("http://localhost:8080/auth/api/v1/logout", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }, 
            body: null,
        });

        if(!res.ok) {
            throw new Error("logout failed");
        }

        return res;
    }

    const handleLogOut = async () => {
        try {
            await fetchLogout();
            navigate("/login");
        }catch (err) {
            console.error("failed log out: ", err); 
        }
    }

    return (
        <div>
            {open &&
                <div className={`border flex-col font-semibold absolute right-3 top-14 p-2 hover: cursor-pointer
                    ${theme === "light"
                        ? `${lightScheme.borderColor} ${lightScheme.headerBgColor} ${lightScheme.secondaryTextColor}`
                        : `${darkScheme.borderColor} ${darkScheme.headerBgColor} ${darkScheme.mainTextColor}`
                    }
                `}>
                    <p onClick={() => {
                        close();
                        openMainModal();
                        mainModal("editBoard");
                    }}>Edit Board</p>
                    <p
                        onClick={() => {
                            close();
                            openMainModal();
                            mainModal("resetBoard");
                        }}
                    >Reset Board</p>
                    <p className={`
                        ${theme === "light"
                            ? `text-rose-600`
                            : `text-rose-600/70`
                        }
                    `}
                        onClick={() => {
                            close();
                            openMainModal();
                            mainModal("deleteBoard");
                        }}
                    >Delete Board</p>
                    <p
                        onClick={handleLogOut}
                    >Log Out</p>
                </div>
            }
        </div>
    )
}

export default HelperModal;