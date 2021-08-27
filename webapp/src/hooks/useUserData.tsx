import {useOktaAuth} from "@okta/okta-react";
import React, {useEffect} from "react";
import {UserClaims} from "@okta/okta-auth-js";

export const useUserData = () => {
    const [userInfo, setUserInfo] = React.useState<UserClaims | null>(null);
    const { authState, oktaAuth } = useOktaAuth();

    useEffect(() => {
        if (!authState?.isAuthenticated) {
            // When user isn't authenticated, forget any user info
            setUserInfo(null);
        } else {
            oktaAuth.getUser().then(info => {
                console.log(info);
                setUserInfo(info);
            });
        }
    }, [authState, oktaAuth]);

    return {
        userInfo
    };
}