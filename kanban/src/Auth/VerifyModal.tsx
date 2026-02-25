 import { useState } from "react";
 import type { SignUpLogInResponse } from "../Types/SignUpLogIn.tsx";
 import type { VerifyAccount } from "../Types/VerifyAccount.tsx";
 import { useNavigate } from "react-router-dom";

function VerifyModal({email, openClose, openFun}: {email: string; openClose: boolean; openFun: () => void;}) {
    const [verificationCode, setVerificationCode] = useState<string>("");
    const navigate = useNavigate();

    const handleCode = (v:string) => {
        setVerificationCode(v);
    };

    const formData: VerifyAccount = {
        email: email,
        code: +verificationCode,
    };

    async function fetchVerify(
        input: VerifyAccount
    ): Promise<SignUpLogInResponse> {
        const res = await fetch("http://localhost:8080/auth/api/v1/verification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(input)
        });
        if (!res.ok) {
            throw new Error("verification failed");
        }

        return res.json();
    };

    const handleVerificationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (verificationCode !== null || verificationCode !== "") {
            const res = await fetchVerify(formData);
            if (res !== null) {
                navigate("/boards");
            }
        }
    };


    return (
        <>
            {openClose && 
            <div className={`flex justify-center items-center px-2 fixed inset-0 bg-black/60`}>
                <div className={`border border-white rounded-lg h-fit w-fit px-2 pt-2 pb-4 bg-white`}>
                    <div className={`absolute ml-72 -mt-5 border border-gray-300 rounded-full bg-indigo-50 hover:bg-indigo-100 transition-all hover:cursor-pointer p-1 h-fit w-fit`}
                        onClick={openFun}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 640 640"
                            height={16}
                            width={16}
                            className={`fill-gray-400`}    
                        >
                            <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/>
                        </svg>
                    </div>
                    <h2 className={`text-xl text-indigo-950 font-semibold text-center mb-4`}>Please check your email<br/>for a verification code to sign in.</h2>
                    <input className={`ml-6 border border-gray-300 bg-white focus:border-indigo-500 focus:outline-none py-1 px-2 h-fit w-fit text-xl`}
                        type="text"
                        value={verificationCode}
                        onChange={(e) => handleCode(e.target.value)}
                        onBlur={handleVerificationSubmit}
                    ></input>
                </div>
            </div>
        }
        </>
    )
}

export default VerifyModal;