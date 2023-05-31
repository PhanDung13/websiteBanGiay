import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { LOCAL_STORAGE } from "constants/localstorage";
import { getUser, loginSuccess } from "redux/authSlice";
import { UserServices } from "services/user-service";
const AppContainer = (props) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
  const userServices = new UserServices();
  useEffect(() => {
    if (token) {
      dispatch(loginSuccess());
      const getInfor = async () => {
        const res = await userServices.getInfo();
        dispatch(
          getUser({ user: res, isAdmin: res.role === 1 ? true : false })
        );
      };
      getInfor();
    }
  }, [token, dispatch]);
  return <>{props.children}</>;
};

export default AppContainer;
