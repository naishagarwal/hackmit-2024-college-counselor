import { useEffect } from "react";
import { Button } from "antd";
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { MdAlternateEmail as EmailIcon } from "react-icons/md";
//
import { selectCollegePlan, selectLoadedPlanFlag, selectSimilaritiesResults } from "../../redux/slices/metadata"
import "./index.scss";

const tmp_aux = "https://raw.githubusercontent.com/naishagarwal/hackmit-2024-college-counselor/main/Pictures/Men/Face015.jpg";

interface IUserCard {
  College: string;
  Email: string;
  Gender: string;
  High_School_Location: string;
  Major: string;
  Name: string;
  PicLinks: string;
  combined_text: string;
}

const UserCard = ({ user }: { user: IUserCard }) => {
  return (
    <div className="pathfinder-card">
      <img src={user.PicLinks || tmp_aux} alt={user.Name} />
      <span className="pathfinder-name">{user.Name}</span>
      <span>{user.College}</span>
      <span className="pathfinder-major">{user.Major}</span>
      <EmailIcon className="pathfinder-icon" />
    </div>
  );
};

export function PlanPage() {
  const navigate = useNavigate();
  const similarityResults = useSelector(selectSimilaritiesResults) as IUserCard[];
  const collegePlan = useSelector(selectCollegePlan);
  const loadedPlanFlag = useSelector(selectLoadedPlanFlag);

  useEffect(() => {
    if (loadedPlanFlag) {
      console.log("there is indeed a plan", loadedPlanFlag);
    }
  }, []);

  function handleGoToUploader() {
    navigate("/app/uploader");
  }

  return (
    <>
      {loadedPlanFlag ? (
        <>
          <div className="custom-wrapper with-plan">
            <h1>Your Plan is ready! 🚀</h1>
          </div>
          <div className="custom-wrapper" style={{ marginTop: "1rem" }}>
            <h2>Meet Your Pathfinders! 🌟</h2>
            <p style={{ marginBottom: ".5rem" }}>
              Below, you'll find profiles of individuals who share similar academic interests and backgrounds. We've handpicked these pathfinders to inspire you and potentially guide your networking efforts. They represent what's possible in your field of interest and could be key connections for your academic journey.
            </p>
            <div className="pathfinders-wrapper">
              {similarityResults.map((user: IUserCard, index: number) => (
                <UserCard key={index} user={user} />
              ))}
            </div>
            {/* <div className="pathfinders-wrapper">
              <UserCard user={{ PicLinks: "", Name: "Selina", Major: "Computer Science", College: "MIT" }} />
              <UserCard user={{ PicLinks: "", Name: "Simon" }} />
              <UserCard user={{ PicLinks: "", Name: "Naisha" }} />
            </div> */}
          </div>
          <div className="custom-wrapper" style={{ marginTop: "1rem" }}>
            <h2>Your Personalized College Plan 🎓</h2>
            <p>
              After exploring these connections, take a look at your personalized college plan below. It’s crafted based on your interests, providing tailored advice and actionable steps to help navigate your future academic career.
            </p>
            <span>
              {collegePlan}
            </span>
          </div>
        </>
      ) : (
        <div style={{ padding: "2rem 3rem" }} className="custom-wrapper no-plan-fallback">
          <h1>Looks Like You're Almost There! 🌟</h1>
          <p>
            Hey there! We noticed you haven't added your LinkedIn profile or resume yet. We're all set to craft your personalized college plan, but we need a little bit of info first.
          </p>
          <p>
            Just a quick step to link your data, and you'll unlock custom advice and insights tailored just for you. It's fast, easy, and you'll be on your way to great recommendations in no time!
          </p>
          <Button type="primary" size="large" onClick={handleGoToUploader}>
            Link my data now
          </Button>
        </div>
      )}
    </>
  )
}
