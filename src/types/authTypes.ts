export interface verifyOtpType {
    email: string,
    otp: number,
}

export interface loginType {
    email: string,
    password: string,
    rememberMe?: boolean,
}
