import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Button, Form } from "antd";
import "swiper/css";
//
import { SignInWithLinkedinBtn } from "./components/linkedin-btn";
import "./index.scss";
import { Input } from "antd";

export const UploaderPage: FC = () => {
  const [form] = Form.useForm();

  return (
    <>
      <Swiper className="swiper-wrapper">
        <SwiperSlide className="swiper-slide">
          <h1>Let's get started!</h1>
          <p>
            To help us build your personalized college plan, connect your LinkedIn profile. This way, we can gather key info like your education, work experience, and skills. Don’t worry, you’ll be able to review and tweak everything before we move ahead.
          </p>
          <SignInWithLinkedinBtn />
        </SwiperSlide>
        <SwiperSlide>
          <h2>Hi Carlos! Please complete your profile </h2>
          <p>Let's get started by filling out some basic information about yourself.</p>
          <div className="cool-form-wrapper">
            <Form
              form={form}
              layout="vertical"
            >
              <Form.Item label="Intended University" name="intended_university">
                <Input placeholder="Intended University" />
              </Form.Item>
              <Form.Item label="High School Name" name="high_school_name">
                <Input placeholder="High School Name" />
              </Form.Item>
              <Form.Item label="High School Location (City, State)" name="high_school_location">
                <Input placeholder="High School Location" />
              </Form.Item>
              <Form.Item label="Extracurriculars/Awards" name="extracurriculars">
                <Input placeholder="Extracurriculars/Awards" />
              </Form.Item>
              <Form.Item>
                <Button type="primary">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <h1>Placeholder 2</h1>
        </SwiperSlide>
      </Swiper>
    </>
  )
}
