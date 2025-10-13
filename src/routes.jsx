import App from "./App";
import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ErrorPage from "./ErrorPage";

// create the configuration for the router
const routes = [
  {
    // Holds the main page structure - header, sidebar, footer, etc.
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      // renders when there are no children
      { index: true, element: <Home /> },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      // {
      //   path: "/profile/:profileId",
      //   element: <Profile />,
      // },
    ],
  },
];

export default routes;
