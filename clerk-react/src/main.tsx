import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Provider } from "react-redux";

// Import the layouts
import RootLayout from './layouts/root-layout'
import DashboardLayout from './layouts/dashboard-layout'

// Import the components
import IndexPage from './routes'
import SignInPage from './routes/sign-in'
import SignUpPage from './routes/sign-up'
import DashboardPage from './routes/dashboard'
import ProfilePage from './routes/profile'
import { UploaderPage } from './routes/uploader'
import { PlanPage } from './routes/plan'
import store from "./redux/store";
import './index.scss'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <IndexPage /> }, // Landing page
      { path: '/sign-in/*', element: <SignInPage /> },
      { path: '/sign-up/*', element: <SignUpPage /> },
      {
        element: <DashboardLayout />,
        path: 'app',
        children: [
          { path: '/app', element: <DashboardPage /> },
          { path: '/app/my-plan', element: <PlanPage /> },
          { path: '/app/uploader', element: <UploaderPage /> },
          { path: '/app/profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  // </React.StrictMode>
)
