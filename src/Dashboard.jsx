import useGetBackendData from "./useGetBackendData";

import { Navigate } from "react-router-dom";

const Dashboard = () => {
  // params not needed as JWT _id used
  // const { profileId } = useParams();

  // custom hook
  const { data, error, loading } = useGetBackendData("/user/dashboard");

  if (loading) return <p>Loading...</p>;

  if (error) {
    return (
      <>
        <h3>Dashboard</h3>
        <div>
          <p>You are not authorized!</p>
          <a href="/login">Return to login</a>
        </div>
      </>
    );
  }

  return (
    <>
      <h3>Dashboard</h3>
      {error ? (
        <div>
          <p>You are not authorized!</p>
          <a href="/login">Return to login</a>
        </div>
      ) : (
        <div>
          <p>You are authorized!</p>
          <p>Profile id: {data._id}</p>
          <p>Username: {data.username}</p>
          <p>Admin?: {data.admin ? "true" : "false"}</p>
        </div>
      )}
    </>
  );
};

export default Dashboard;
