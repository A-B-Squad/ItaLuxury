import { signUp } from "./signUp";
import { signIn,refreshToken} from "./signIn";


export const userMutations = {
    signUp,
    signIn,
    refreshToken
}