import { Route } from "react-router-dom";
import HomePage from "../pages/home";
import HomeTemplate from "../templates/HomeTemplate";
import AuthTemplate from "../templates/AuthTemplate";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import WebDetailPage from "../pages/Web-detail";
import PrivateRoute from "./PrivateRoute";
import CreateTaskPage from "../pages/createTask";
import CreateProject from "../pages/CreateProject";
import ProjectDetail from "../pages/ProjectDetail";
import TaskEdit from "../pages/taskEdit";
import UserManagement from "../pages/userManagement";

const routers = [
  // Public routes
  {
    path: "/",
    element: <AuthTemplate />,
    child: [
      { path: "/", element: <LoginPage /> }, // mặc định login
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },

  // Private routes
  {
    path: "/",
    element: <PrivateRoute />, // bọc private
    child: [
      {
        path: "/",
        element: <HomeTemplate />,
        child: [
          { path: "projectmanagement", element: <HomePage /> },
          { path: "detail", element: <WebDetailPage /> },
          { path: "createtask", element: <CreateTaskPage /> },
          { path: "createproject", element: <CreateProject /> },
          { path: "projectdetail/:projectId", element: <ProjectDetail /> },
          { path: "taskedit/:taskId", element: <TaskEdit /> },
          { path: "usermanagement", element: <UserManagement /> },
        ],
      },
    ],
  },
];

export const renderRoutes = () => {
  return routers.map((template, index) => (
    <Route key={index} path={template.path} element={template.element}>
      {template.child &&
        template.child.map((item, indexChild) => (
          <Route key={indexChild} path={item.path} element={item.element}>
            {item.child &&
              item.child.map((sub, subIndex) => (
                <Route key={subIndex} path={sub.path} element={sub.element} />
              ))}
          </Route>
        ))}
    </Route>
  ));
};