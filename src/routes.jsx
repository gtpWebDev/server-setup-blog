import App from "./App";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ErrorPage from "./ErrorPage";

import { HomePage, Blog } from "./pages";

// create the configuration for the router
const routes = [
  {
    // Holds the main page structure - header, sidebar, footer, etc.
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      // renders when there are no children
      { index: true, element: <HomePage /> },
      {
        path: "/blog",
        element: <Blog />,
      },
      // {
      //   path: "/login",
      //   element: <Login />,
      // },
      // {
      //   path: "/dashboard",
      //   element: <Dashboard />,
      // },
      // {
      //   path: "/profile/:profileId",
      //   element: <Profile />,
      // },
    ],
  },
];

export default routes;
