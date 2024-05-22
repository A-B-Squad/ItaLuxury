import { signUp } from "./signUp";
import { signIn,refreshToken} from "./signIn";
import { forgotPassword } from "./forgotPassword";
import { resetPassword } from "./resetPassword";


export const userMutations = {
    signUp,
    signIn,
    refreshToken,
    forgotPassword,
    resetPassword
}