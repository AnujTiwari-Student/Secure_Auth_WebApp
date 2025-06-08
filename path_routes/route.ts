export const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/logout",
    "/error",
    "/newVerification",
    "/resetPassword",
    "/pass-reset"
]

export const protectedRoutes = [
    "/home",
    "/settings",
    "/profile",
    "/changePassword",
]

export const apiPrefix = "/api/auth";
export const graphqlApiPrefix = "/api/graphql"; 

export const redirectUrl = "/home";