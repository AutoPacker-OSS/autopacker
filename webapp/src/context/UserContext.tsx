import React, {FunctionComponent, useEffect, useMemo, useState} from "react";

type UserContextProps = {
    // userInfo?: UserClaims | null;
    role?: string | null;
    hasAccess: () => boolean;
}

// TODO Fix this later on
export const UserContext = React.createContext<UserContextProps>({
    // userInfo: null,
    role: null,
    hasAccess: () => false
});

export const UserProvider: FunctionComponent = ({children}) => {
    // const [userInfo, setUserInfo] = useState<UserClaims | null>(null);
    // const {authState, oktaAuth} = useOktaAuth();

    // useEffect(() => {
    //     if (!authState?.isAuthenticated) {
    //         // When user isn't authenticated, forget any user info
    //         setUserInfo(null);
    //     } else {
    //         oktaAuth.getUser().then(info => {
    //             setUserInfo(info);
    //         });
    //     }
    // }, [authState, oktaAuth]);

    return (
        // <UserContext.Provider value={{userInfo, role: null, hasAccess: () => false}}>
        //     {children}
        // </UserContext.Provider>

        <></>
    )
};

