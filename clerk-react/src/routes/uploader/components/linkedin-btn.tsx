import { useEffect } from "react";
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
      const accessToken = isMatch[1];
      console.info("here we should store this token on a global state like redux", accessToken);
    }
  }, []);

  return (
    <button id="linkedin-signin" onClick={handleConnectionClick}>
      Connect with LinkedIn
    </button>
  )
}