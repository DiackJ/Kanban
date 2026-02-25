
export type SignUpLogInResponse = {
    email: string,
    enabled: boolean
};

export type SignUpLogInInput = {
    email: string,
    passwordHash: string
};