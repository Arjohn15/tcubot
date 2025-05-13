import { FC } from "react";
import { useAppSelector } from "../../store/hooks";
import { selectUserState } from "../redux/userSlice";
import LoadingCircular from "../../../shared/components/LoadingCircular";
import { Link } from "react-router-dom";

const UserHeader: FC = () => {
  const { user, loading } = useAppSelector(selectUserState);

  return (
    <header className="flex justify-between items-center border-gray border-b-2 px-[1rem] py-[0.5rem]">
      <div>
        <a href="/user/chat">
          <img
            src="/images/logos/tcubot-main-logo.png"
            alt="TCUbot main logo"
            width={120}
          />
        </a>
      </div>
      <div>
        {loading ? (
          <LoadingCircular size="2.5rem" />
        ) : (
          <Link to={"/user/profile"}>
            <div className="text-xl bg-red w-[3rem] h-[3rem] rounded-full text-white font-bold flex items-center justify-center">
              <span>
                {user.first_name[0]}
                {user.last_name[0]}
              </span>
            </div>
          </Link>
        )}
      </div>
    </header>
  );
};

export default UserHeader;
