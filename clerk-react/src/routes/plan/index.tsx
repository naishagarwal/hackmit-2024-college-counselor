import { useEffect } from "react";
import { Button } from "antd";
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
//
import { selectLoadedPlanFlag } from "../../redux/slices/metadata"
import "./index.scss";

export function PlanPage() {
  const navigate = useNavigate();
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
    <section className="custom-wrapper">
      {loadedPlanFlag ? (
        <>
          <h1>
            Your Plan is ready! 🚀
          </h1>
        </>
      ) : (
        <div className="no-plan-fallback">
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
    </section>
  )
}
