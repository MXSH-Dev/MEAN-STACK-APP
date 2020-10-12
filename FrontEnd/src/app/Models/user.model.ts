interface User {
  _id: string;
  email: string;
  username: string;
}

interface LoginUserData {
  email: string;
  password: string;
}
export { User, LoginUserData };
