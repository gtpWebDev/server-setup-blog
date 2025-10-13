// Have doubled up here on learning use of the axios library
// so have separated the axios http requests into this module

import { BACKEND_URI } from "../constants/backendRequests";

import axios from "axios";

// Configuration for all requests on instance
// could add default headers, etc.
export const axiosInstance = axios.create({
  baseURL: BACKEND_URI,
  timeout: 10000, // 10 seconds
});

/**
 * -------------- INTERCEPTORS ----------------
 */

/* Interceptors enable functionality before a request is sent, or after a response is received
   These happen before **then** or **catch**
   They are:
    - pre-send function
    - request error function
    - response success function
    - response error function
*/

// Carried out before the request is sent
const preSendFn = (config) => {
  //import token from local storage, and add it to header
  let token = localStorage.getItem("token") || "";
  config.headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: token,
  };
  // console.log("Adding authorization token to request header");
  return config;
};

// Do something with the request error
const requestErrorFn = (error) => {
  console.log("Request Error Function Fired!");
  return Promise.reject(error);
};

axiosInstance.interceptors.request.use(preSendFn, requestErrorFn);

// Status codes 2XX cause this to trigger
const responseSuccessFn = (response) => {
  // Do something with response
  // console.log("Response Success Function Fired!");
  return response;
};

// status codes other than 2XX cause this to trigger
const responseErrorFn = (error) => {
  // Do something with response error

  // some standard error handling that might want to amend
  if (error.response) {
    // Handle specific status codes
    if (error.response.status === 401) {
      // Unauthorized: handle token expiration, redirect to login, etc.
      console.error("Interceptor: Authentication issue (JWT)");
      // Optionally, you could also refresh the token here
    } else if (error.response.status === 403) {
      // Forbidden: handle permission issues
      console.error(
        "Interceptor: Forbidden, user does not have permission to access this resource."
      );
    } else if (error.response.status === 500) {
      // Internal Server Error: handle server issues
      console.error(
        "Interceptor: Internal server error, please try again later."
      );
    }
  } else if (error.request) {
    // The request was made but no response was received
    console.error("Interceptor: No response received:", error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Interceptor: Error setting up request:", error.message);
  }
  return Promise.reject(error);
};

axiosInstance.interceptors.response.use(responseSuccessFn, responseErrorFn);

/**
 * -------------- HTTP REQUESTS ----------------
 *
 * Axios requests have the following structure:
 * Success (200 codes):
 * - response.status - 200, 400, etc.
 * - response.data - the data sent from the backend using res.json
 * - response.request - the original request
 * - response.headers - the response header
 * - response.statusText
 * - response.config
 *
 * Error (not 200 codes):
 * - error.status
 * - error.response.data - the error data sent from the backend, usually a message
 * - error.statusText
 * - a lot of additional axios-specific error info
 *
 */

// includes built in error handling
export const axiosGet = async (relativeUri) => {
  // returns JSON form

  try {
    const response = await axiosInstance.get(relativeUri);
    const successResponse = {
      // server data is {success: true/false, data}
      success: response.data.success,
      data: response.data.data,
      error: null,
    };
    console.log("axiosGet returning successResponse", successResponse);
    return successResponse;
  } catch (error) {
    console.log("AxiosError", error);
    const errorResponse = {
      success: false,
      data: null,
      error: {
        status: error.response.status,
        message: error.response.data,
      },
    };
    console.log("axiosGet returning errorResponse", errorResponse);
    return errorResponse;
  }
};

// TO REFINE AS GET
export const axiosPost = async (relativeUri, data, config) => {
  // axios stringifies the post data when we send Javascript objects
  try {
    const response = await axiosInstance.post(relativeUri, data, config);
    const successResponse = {
      // server data is {success: true/false, data}
      success: response.data.success,
      data: response.data,
      error: null,
    };
    console.log("axiosPost returning successResponse", successResponse);
    return successResponse;
  } catch (error) {
    console.log("AxiosError", error);
    const errorResponse = {
      success: false,
      data: null,
      error: {
        status: error.response.status,
        message: error.response.data.msg,
      },
    };
    console.log("axiosPost returning errorResponse", errorResponse);
    return errorResponse;
  }
};

// not currently used
// export const axiosWithConfig = async (config) => {
//   const config = {
//     method: "post",
//     url: "/user/12345",
//     data: {
//       firstName: "Fred",
//       lastName: "Flintstone",
//     },
//   };
//   const response = await axiosInstance(config);
//   return response.data;
// };
