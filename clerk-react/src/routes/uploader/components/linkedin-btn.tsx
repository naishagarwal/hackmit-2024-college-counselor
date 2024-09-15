import { useEffect } from "react";
//
import LinkedInApi from "../../../apis/linkedin";
//
const CLIENT_ID = "78qinz0gzw4aut";
const REDIRECT_URI = "http://localhost:5173/app/uploader";
const SCOPE = "openid profile email";
const STATE = "a";

export const SignInWithLinkedinBtn = () => {
  const handleConnectionClick = () => {
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${encodeURIComponent(CLIENT_ID)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPE)}&state=${encodeURIComponent(STATE)}`;
    console.info("authUrl", authUrl);
    window.location.href = authUrl;
  };

  useEffect(() => {
    const accessTokenRegex = /code=([^&]+)/;
    const isMatch = window.location.href.match(accessTokenRegex);

    if (isMatch) {
      const authToken = isMatch[1];
      console.info("here we should store this token on a global state like redux", authToken);
      localStorage.setItem("linkedin_access_token", authToken);

      const linkedinAPI = new LinkedInApi({ token: undefined });
      linkedinAPI.exchangeAuth4AccessToken({ code: authToken }).then(accessToken => {
        console.info("obtained accessToken", accessToken);
        // const basicUserInfo = linkedinAPI.basicUserInfo({ token: accessToken.access_token });
        // console.info("basicUserInfo", basicUserInfo);
      });
    }
  }, []);

  return (
    <button id="linkedin-signin" onClick={handleConnectionClick}>
      Connect with LinkedIn
    </button>
  )
}