import { useState, useEffect } from "react";
import { axiosGet } from "./lib/axiosUtility";

/**
 * Custom hook for all get requests to the backend server
 */

const useGetBackendData = (relativeUri) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axiosGet(relativeUri);
        if (response.success) {
          setData(response.data);
        } else {
          setError(response.error);
        }
        setLoading(false);
        // console.log("Custom hook returning handled response");
      } catch (error) {
        // console.log("Custom hook returning unhandled response");
        setError(error);
        setLoading(false);
      }
    };
    getData();
  }, []);

  return { data, error, loading };
};

export default useGetBackendData;
