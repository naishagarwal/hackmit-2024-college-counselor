import { FC, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Button, Form, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "swiper/css";
//
import { SignInWithLinkedinBtn } from "./components/linkedin-btn";
import { setFetchCollegePlanFlag, setLoadedPlanFlag, setSimilaritiesResults } from "../../redux/slices/metadata";
import SimilaritiesApi from "../../apis/similarities";
import "./index.scss";

const { Option } = Select;

export const UploaderPage: FC = () => {
  const [swiperIns, setSwiperIns] = useState<any>(null); // eslint-disable-line
  const [processing, setProcessing] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const similaritiesApi = new SimilaritiesApi();

  async function moveToNextSlide({ lastSlide = false } = {}) {
    if (swiperIns) {
      swiperIns.slideNext();
    }

    if (lastSlide) {
      setProcessing(true);
      form.submit();
      const similarities_payload = {
        name: "Carlos", // Remove hardcoded value and add the "Name" input field from Clerk
        college: form.getFieldValue("intended_university") as string,
        major: form.getFieldValue("intended_major") as string,
        query: "Coding" // Remove hardcoded value and add the "Select your interests" dropdown
      };
      const results = await similaritiesApi.querySimilarities(similarities_payload);
      console.info("got the similarities", results);
      dispatch(setSimilaritiesResults({ results }));
      setProcessing(false);
      dispatch(setFetchCollegePlanFlag({ flag: true }));
    }
  }

  function auxProcessingClick() {
    setProcessing(() => !processing);
  }

  function goToResults() {
    dispatch(setLoadedPlanFlag({ flag: true }));
    navigate("/app/my-plan");
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        console.log(values);
      }}
    >
      <Swiper className="swiper-wrapper" onSwiper={setSwiperIns}>
        <SwiperSlide className="swiper-slide custom-wrapper">
          <h1>Let's get started!</h1>
          <p>
            To help us build your personalized college plan, connect your LinkedIn profile. This way, we can gather key info like your education, work experience, and skills. Don’t worry, you’ll be able to review and tweak everything before we move ahead.
          </p>
          <SignInWithLinkedinBtn />
        </SwiperSlide>
        <SwiperSlide className="swiper-slide custom-wrapper">
          <div className="form-question">
            <h2>Hi Carlos!</h2>
            <p>Let's get started by filling out some basic information about yourself.</p>
            <h3>
              What's your intended university?
            </h3>
            <div className="form-question">
              <Form.Item name="intended_university">
                <Input placeholder="Intended University" size="large" />
              </Form.Item>
              <Button type="primary" size="large" onClick={() => moveToNextSlide()}>
                Continue
              </Button>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="swiper-slide custom-wrapper">
          <div className="form-question">
            <h3>What major or field of study are you aiming for?</h3>
            <Form.Item name="intended_major">
              <Input placeholder="Intended Major" size="large" />
            </Form.Item>
            <Button type="primary" size="large" onClick={() => moveToNextSlide()}>
              Continue
            </Button>
          </div>
        </SwiperSlide>
        <SwiperSlide className="swiper-slide custom-wrapper">
          <div className="form-question">
            <h2>Great! Now let's talk about your high school experience.</h2>
            <p>Please tell us about your high school</p>
            <Form.Item name="high_school_name">
              <Input placeholder="High School Name" size="large" />
            </Form.Item>
            <Form.Item name="high_school_location">
              <Input placeholder="High School Location" size="large" />
            </Form.Item>
            <Button type="primary" size="large" onClick={() => moveToNextSlide()}>
              Continue
            </Button>
          </div>
        </SwiperSlide>
        <SwiperSlide className="swiper-slide custom wrapper">
          <div className="form-question">
            <h2>What Sparks Your Curiosity?</h2>
            <p>Tell us about your interests so we can better tailor your college plan.</p>
            <Form.Item name="interests">
              <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder="Select or type your interests"
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  size="large"
                  maxTagCount={4}
                  allowClear
                >
                  <Option value="science">Science</Option>
                  <Option value="coding">Coding</Option>
                  <Option value="space">Space</Option>
                  <Option value="design">Design</Option>
                  <Option value="healthcare">Healthcare</Option>
                  <Option value="environment">Environment</Option>
                  <Option value="law">Law</Option>
                  <Option value="education">Education</Option>
                  <Option value="engineering">Engineering</Option>
                  <Option value="mathematics">Mathematics</Option>
                  <Option value="technology">Technology</Option>
                  <Option value="arts">Arts</Option>
                  <Option value="humanities">Humanities</Option>
                  <Option value="business">Business</Option>
                  <Option value="social_sciences">Social Sciences</Option>
                </Select>
            </Form.Item>
            <Button type="primary" size="large" onClick={() => moveToNextSlide({ lastSlide: true })}>
              Continue
            </Button>
          </div>
        </SwiperSlide>
        <SwiperSlide className="swiper-slide custom-wrapper">
          <div className="form-question">
            <h2 onClick={auxProcessingClick}>Thank you!</h2>
            {processing ? (
              <>
                <p>We're getting your network and college plan ready. Hang tight!</p>
                <Button type="primary" size="large" disabled={processing} loading={processing}>
                  Processing...
                </Button>
              </>
            ) : (
              <>
                <p>
                  We're ready with your network and college plan. Click below to view your results 🎉
                </p>
                <Button type="primary" size="large" htmlType="submit" onClick={goToResults}>
                  View results
                </Button>
              </>
            )}
          </div>
        </SwiperSlide>
      </Swiper>
    </Form>
  )
}
