import { useRouteError } from "react-router-dom";

import { Link } from "react-router-dom";

// Rendered for a bad route
// Would also kick in if a router had an error in it but this shouldn't happen!

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, there has been an application error.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <Link to="/">Return to home page</Link>
    </div>
  );
}
