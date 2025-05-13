import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { fetchUser, selectUserState } from "./redux/userSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import UserHeader from "./shared/UserHeader";

const UserPage = () => {
  const { error } = useAppSelector(selectUserState);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  useEffect(() => {
    if (error) {
      navigate("/");
    }
  }, [error]);

  return (
    <div className="h-[100vh] flex flex-col">
      <UserHeader />

      <Outlet />
    </div>
  );
};

export default UserPage;
