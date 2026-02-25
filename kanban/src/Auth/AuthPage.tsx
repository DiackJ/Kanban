import MainButton from "../Reusable-components/MainButton";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { SignUpLogInInput, SignUpLogInResponse } from "../Types/SignUpLogIn.tsx";
import VerifyModal from "./VerifyModal.tsx";


function AuthPage() {
    const {pathname} = useLocation();
    const navigate = useNavigate();
    const isLogin = pathname === "/login";
    const [email, setEmail] = useState<string>("");
    const [passwordHash, setPasswordHash] = useState<string>("");
    const [openModal, setOpenModal] = useState<boolean>(false);
    const handleOpen = () => {
        setOpenModal(prev => !prev);
    };

    const handleEmail = (v:string) => {
        setEmail(v);
    };
    const handlePassword = (v:string) => {
        setPasswordHash(v);
    };


    const formData: SignUpLogInInput = {
        email,
        passwordHash,
    };

    async function fetchLogin(
        input: SignUpLogInInput
    ): Promise<SignUpLogInResponse> {
        // fetcher === parsed data (calls fetch, checks res.ok, parses .json, returns type)
        //return fetcher<SignUpLogInResponse>("http://localhost:8080/auth/api/v1/login", {
        const res = await fetch("http://localhost:8080/auth/api/v1/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(input),
        });
        if (!res.ok) {
            throw new Error("failed to login");
        }

        return res.json();
    };

    async function fetchSignUp(
        input: SignUpLogInInput
    ): Promise<SignUpLogInResponse>{
        const res = await fetch("http://localhost:8080/auth/api/v1/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(input),
        });

        if (!res.ok) {
            throw new Error("sign up failed");
        }

        return res.json();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isLogin) {
                const loginResp = await fetchLogin(formData);
                navigate("/boards");
                console.log("log in success: ", loginResp);
            } else {
                const signupResp = await fetchSignUp(formData);
                if (signupResp !== null) {
                    handleOpen();
                }
                console.log("sign up success: ", signupResp);
            }
        }catch (err) {
            console.error("failed: ", err);
        }
    };

    return (
        <div>
            <div className={`flex`}>
                <div className={`flex-[2] w-full h-screen bg-indigo-200 bg-[url('/hand-drawn-data-concept-illustrated.png')] bg-cover bg-blend-color-burn`}>
                    <p className={`ml-10 mt-72 z-10 text-3xl font-bold text-indigo-950`}>Your tasks, your flow.</p>
                    <p className={`ml-10 z-10 text-2xl font-bold text-white`}>Use Kanban today to unlock your most productive self.</p>
                </div>
                <div className={`flex justify-center text-center flex-[1]`}>
                    <div>
                        <p className={`text-indigo-950 font-bold text-3xl mb-6 mt-40`}>
                            {isLogin 
                                ? "Welcome back!" 
                                : "Sign up for Kanban"
                            }
                        </p>
                        <form onSubmit={handleSubmit}>
                                <p className={`text-left ml-4`}>Email</p>
                                <input type="email"
                                    value={email}
                                    onChange={(e) => handleEmail(e.target.value)}
                                    className={`border border-gray-300 rounded-lg py-1 px-2 mb-2 focus:border-indigo-400 focus:outline-none`}>
                                </input>
                                <p className={`text-left ml-4`}>Password</p>
                                <input type="password"
                                    value={passwordHash}
                                    onChange={(e) => handlePassword(e.target.value)}
                                    className={`border border-gray-300 rounded-lg py-1 px-2 focus:border-indigo-400 focus:outline-none`}
                                >
                                </input>
                            <div className={`absolute left-3/4 top-96`}>
                                <MainButton>
                                    {isLogin  
                                        ? "Log in"
                                        : "Sign up"
                                    }
                                </MainButton>
                            </div>
                        </form>
                        <div className={`text-sm mt-2 mb-6`}>
                            {isLogin 
                                ? <p>Don't have an account yet? <NavLink to="/signup" className={`hover:text-indigo-500`}>Sign up here.</NavLink></p>
                                : <p>Already have an account? <NavLink to="/login" className={`hover:text-indigo-500`}>Log in here.</NavLink></p>
                            }
                        </div>
                   </div>
                </div>
            </div>
            <VerifyModal email={email} openClose={openModal} openFun={handleOpen}/> 
        </div>
    )
}

export default AuthPage;

// bg-[url('/hand-drawn-data-concept-illustrated.png')] bg-blend-color-burn