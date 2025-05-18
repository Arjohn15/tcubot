import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingCircular from "../../../shared/components/LoadingCircular";
import { HOST } from "../../../utils/getHost";

interface UserState {
  loading: boolean;
  userData: any[];
  errorMessage: null | "An error occured. Please try again later.";
}
const UserVisit: FC = () => {
  const { id } = useParams();

  const [userState, setUserState] = useState<UserState>({
    loading: true,
    userData: [],
    errorMessage: null,
  });

  async function getUser(): Promise<void> {
    try {
      const resp = await axios.get(`http://${HOST}/user/chat/visit/${id}`, {
        headers: {
          Authorization: `Bearer: ${localStorage.getItem("token-user")}`,
        },
      });

      setUserState({
        userData: resp.data.userInfo,
        loading: false,
        errorMessage: null,
      });
    } catch (err: any) {
      setUserState({
        userData: [],
        loading: false,
        errorMessage: err.response.data.message,
      });
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  if (userState.loading) {
    return <LoadingCircular />;
  }

  if (userState.errorMessage) {
    return (
      <div className="h-full flex justify-center items-center">
        <h1 className="text-xl text-gray font-bold">
          {userState.errorMessage}
        </h1>
      </div>
    );
  }
  return <div></div>;
};

export default UserVisit;
