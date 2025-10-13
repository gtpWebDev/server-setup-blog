import moment from "moment";

// {
//   success: true;
//   token: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjlhMzFlOGI3YTczOTU3YzQxNzExMTEiLCJpYXQiOjE3MjEzODEzNTI5OTUsImV4cCI6MTcyMTM4MTQzOTM5NX0.MkHrZ_v8nrvSncpzEb-liy6J5VfmiTCY09zABlOpE8cdU1g2K3tnf-3GM15-qO1UTyNqBbNpBLLLHOs5VqsGAElh6TOsfA2SmUz_38wTzTLxZ8FISCjbSxGVeduskUMYZpGdfdVmAd3xFbjVR_b0FxRkf8rvChWtoErlPy_xIf3noR114df7qkJdtwC6CxMxJYhpOeTnAdlxI3pi4QvAKzSqDO-tFHXmiaierjEIJ3gy_tmRXRZXCh4UR6t5IWvDtVk8wNqRGXKTkGXC9YoiS7ef7gZk4LEBEanssYhkKc4m2bEwaibs8_WStXHIiidYbg4y2In7GW9vmfwpEetkFunbJOOduow0Oc8tgtMedeqPsQckn5oPp7EXizH7gz4AC9j5GVuQUjT7xiIQK0aoYQXiSWM8MJ6hDsqA_63D3QiDpl2xft4tVbazrVeoEuisoCCErt40HkwY-KuruFB7EUWJGSQeEZFeuEvnvIgJdLAILaldui0tTFqWnACGQv7nqIox84j6jW1APrDdIVx7ya7lJ82g06PZAj0-8TAaicR-4ajZk5w92HybQSQSNeQyiuQlji1zZX__xs7A4qArlQX0_OPiyHCZ0R2K7JAWw_WWqt-aIguKhG8gayV7DPO4L0L1g4ORHELZL_SinKLfkJLvZ_mtmj_2hpsfa7xcMw8";
//   user: admin: false;
//   hash: "0dadb5e1d03aaa1f9e22e5fb07af44d1129c5cf6f3da59950d2800459d46c7a311a88a14d5435355b2ab821e47c8be336d67b9a1f3db6aba8aa5742532c88828";
//   salt: "441b0f6b9ed3e8363b2f2f016cdbd938c5b105d4adbed3ac57e80d5fdd70f13b";
//   username: "glen";
//   __v: 0;
//   _id: "669a31e8b7a73957c4171111";
// }

// A class to do some straight forward manipulation of local storage
// to add or remove the JSON Web Token as required

class AuthService {
  constructor() {
    // this.name = name;
  }

  setLocalStorage(responseObj) {
    const expires = moment().add(responseObj.expiresIn);
    localStorage.setItem("token", responseObj.token);
    localStorage.setItem("expires", JSON.stringify(expires.valueOf()));
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("expires");
  }

  isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn;
  }

  // express application has checked whether user is valid
  // check whether JWT is expired.
  getExpiration() {
    const expiration = localStorage.getItem("expires");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}

export default AuthService;
