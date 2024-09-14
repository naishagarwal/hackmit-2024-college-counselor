import { FC } from "react";
//
import { SignInWithLinkedinBtn } from "./components/linkedin-btn";
import "./index.scss";

export const UploaderPage: FC = () => {
  return (
    <>
      <h1>Let's get started!</h1>
      <p>
        To help us build your personalized college plan, connect your LinkedIn profile. This way, we can gather key info like your education, work experience, and skills. Don’t worry, you’ll be able to review and tweak everything before we move ahead.
      </p>
      <SignInWithLinkedinBtn />
    </>
  )
}