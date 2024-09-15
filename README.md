# Virtual College Counselor

**HackMIT 2024 Project**

---

## Inspiration

College counseling has become an essential service that many high school students rely on to navigate the complex and competitive process of applying to colleges. Many traditional college counseling services are expensive, with private counselors charging thousands of dollars for their expertise. This makes them inaccessible to a large number of students, particularly those from underrepresented or low-income backgrounds. Recognizing this disparity, our team decided to create a **Virtual College Counselor**—a more affordable and accessible solution that provides personalized guidance to any student, regardless of their financial situation.

Our goal is to democratize the college application process and offer students the help they need to achieve their dreams.

## What It Does

Our Virtual College Counselor uses LinkedIn data to create personalized recommendations and connections for students. Here's how it works:

1. **Input LinkedIn Profile**: A user submits their LinkedIn profile, and the system generates recommendations based on their connections. If the user does not have a LinkedIn profile, we use general college student profiles from LinkedIn to generate recommendations.
  
2. **Personalized College Plan**: The user inputs their dream college, major, and a summary of their interests and accomplishments through a form.

3. **Recommendations**: The system returns:
   - The most similar people at their dream college, based on their resume, to connect with.
   - A personalized college plan with actionable steps for their college application journey.

## How We Built It

- **Backend**: We built the backend using Flask, with **Intersystems Iris** as our vector database to process queries. We also used **SQL** to query the database and **Pandas** for data processing.
  
- **Frontend**: For the frontend, we used **React**, **Vite**, and **Node.js**.

## Challenges We Ran Into

1. **Integrating Intersystems Iris**: We encountered issues when integrating Intersystems Iris and using its vector database functionalities.
2. **LinkedIn Scraping**: Initially, we began scraping LinkedIn data, but due to LinkedIn’s policies, we pivoted to using a mock dataset. In the future, we would want to extend this dataset further with proper permissions from LinkedIn.

## What We Learned

- Using **Postman** to debug API calls without needing to connect the frontend right away was a significant time-saver, especially for testing vector database queries.
- We learned to effectively delegate tasks between the backend and frontend, which helped streamline the integration process between both systems.

## What’s Next For Our Project

We plan to:

1. **Expand the Dataset**: Increase the personalization for unconventional paths and less popular majors by expanding the dataset.
2. **General Statistics**: Return general statistics for the user, such as:
   - Percentage of students from their high school or with similar backgrounds who got into their dream college.
   - Acceptance rates for specific majors at their chosen college.
3. **Job Search Application**: Extend the project’s functionality to job searches, where the college can be replaced by a company, providing users with job connection recommendations.

## Setup Instructions

### Prerequisites

Make sure you have Python, Yarn, and Node.js installed.

1. **Clone the repository**:

    ```bash
    git clone https://github.com/naishagarwal/hackmit-2024-college-counselor.git
    cd hackmit-2024-college-counselor
    ```

2. **Install backend dependencies**:

    ```bash
    pip install -r requirements.txt
    ```

3. **Run the backend**:

    ```bash
    python flaskBackend.py
    ```

4. **Install frontend dependencies**:

    ```bash
    yarn install
    ```

5. **Run the frontend**:

    ```bash
    yarn dev
    ```

## Technologies Used

- **Backend**: Flask, Intersystems Iris, SQL, Pandas
- **Frontend**: React, Vite, Node.js
- **API Testing**: Postman

## Authors

This project was built by Naisha Agarwal, Selina Song, Carlos Pinto, and Simon Storf.

---

Thank you for checking out our Virtual College Counselor project! We hope this tool can help democratize the college application process and empower students to achieve their dreams.
