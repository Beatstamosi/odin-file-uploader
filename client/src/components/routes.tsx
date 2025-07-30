import App from "../App";
import ErrorPage from "./ErrorPage/ErrorPage.jsx";
import LogOut from "./Authentication/LogOut/LogOut.jsx";
import Login from "./Authentication/Login/Login.jsx";
import SignUp from "./Authentication/Sign Up/SignUp.jsx";
import RequireAuth from "./Authentication/RequireAuth.jsx";
import Home from "./Home/Home.js";
import FolderContent from "./FolderContent/FolderContent.js";
import SharedFolderContent from "./SharedFolderContent/SharedFolderContent.js";

const routes = [
  {
    path: "/",
    element: (
      <RequireAuth>
        <App />
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/:folderid",
        element: <FolderContent />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/logout",
    element: (
      <RequireAuth>
        <LogOut />
      </RequireAuth>
    ),
  },
  {
    path: "/share/:folderId",
    element: <SharedFolderContent />,
  },
  {
    path: "/error",
    element: <ErrorPage />,
  },
];

export default routes;
