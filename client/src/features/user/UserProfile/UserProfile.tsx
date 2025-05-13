import { IoArrowBack, IoCopyOutline } from "react-icons/io5";
import { useAppSelector } from "../../store/hooks";
import { selectUserState } from "../redux/userSlice";
import CopyText from "../../../shared/components/CopyText";
import { useNavigate } from "react-router-dom";
import UserProfileBirthday from "./UserProfileBirthday";
import UserProfilePN from "./UserProfilePN";
import { MdLogout } from "react-icons/md";
import { getCourseFormalName } from "../../../utils/getCourseFormalName";
import { getYearDescription } from "../../../utils/getYearDescription";
import UPChangePassword from "./UPChangePassword";
import { getSchoolSection } from "../../../utils/getSchoolSections";
import UPManageSchedule from "./UPManageSchedule";

const UserProfile = () => {
  const { user } = useAppSelector(selectUserState);

  const navigate = useNavigate();

  function handleLogout(): void {
    const token = localStorage.getItem("token-user");

    if (token) {
      localStorage.removeItem("token-user");
      navigate("/");
    } else {
      navigate("/");
    }
  }
  return (
    <div className="pb-[3rem]">
      <div className="relative flex items-center justify-center py-[1rem]">
        <button
          className="absolute left-[1rem] hover:cursor-pointer hover:opacity-[0.5] duration-300"
          onClick={() => navigate(-1)}
        >
          <span className="text-2xl">
            <IoArrowBack />
          </span>
        </button>
        <h1 className="text-center font-bold text-2xl">Profile</h1>
      </div>

      <div className="flex justify-center">
        <div className="w-[40%] border-3 border-gray-half rounded-lg px-[2rem] py-[1rem] text-sm">
          <div className="flex flex-col items-center">
            <div className="text-4xl bg-red w-[7rem] h-[7rem] rounded-full text-white font-bold flex items-center justify-center">
              <span>
                {user.first_name[0]}
                {user.last_name[0]}
              </span>
            </div>
            <div className="text-center">
              <span className="text-lg font-bold mt-[1rem] mb-[0.5rem] block">
                {user.first_name} {user.last_name}
              </span>
              <div className="text-xs flex">
                School assigned number: {user.school_assigned_number}
                <div className="ml-[0.5rem] flex">
                  <CopyText
                    button_copy_content={
                      <span>
                        <IoCopyOutline />
                      </span>
                    }
                    text_copy={user.school_assigned_number}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-[2rem]">
            <div className="flex items-center">
              <UserProfileBirthday />
            </div>

            <div className="mt-[2rem]">
              <h2 className="text-lg font-bold">School Information</h2>
              {user.role === "student" && (
                <>
                  <span className="mt-[1rem] mb-[0.5rem] block">
                    <strong>Year Level:</strong> {getYearDescription(user.year)}
                  </span>
                  <span className="mt-[1rem] mb-[0.5rem] block">
                    <strong>Course:</strong> {getCourseFormalName(user.course)}{" "}
                    ({user.course})
                  </span>
                  <span className="mt-[1rem] mb-[0.5rem] block">
                    <strong>Section:</strong> {getSchoolSection(user.section)}{" "}
                  </span>
                </>
              )}
              <span className="capitalize mt-[1rem] mb-[0.5rem] block">
                <strong>Role:</strong> {user.role}
              </span>
            </div>

            <div className="mt-[2rem]">
              <h2 className="text-lg font-bold">Contact</h2>
              <span className="mt-[1rem] mb-[0.5rem] block">
                <strong>Email:</strong> {user.email}
              </span>
              <div className="flex items-center mt-[1rem] mb-[0.5rem]">
                <UserProfilePN />
              </div>
            </div>
            <div className="mt-[2rem]">
              <UPChangePassword />
            </div>
            {user.role === "professor" && (
              <div className="mt-[1rem]">
                <UPManageSchedule />
              </div>
            )}
            <div className="mt-[2rem]">
              <button
                onClick={handleLogout}
                className="flex items-center border-2 border-gray rounded-xl text-red px-[0.5rem] hover:cursor-pointer hover:opacity-[0.65] duration-300 font-bold"
              >
                <span>Log out</span>
                <span className="block ml-[0.5rem]">
                  <MdLogout />
                </span>
              </button>
            </div>
            <span className="text-xs block mt-[2rem] flex italic text-center">
              <strong className="mr-[0.25rem]">Note: </strong>
              If you wish to edit your information due to misspelled name,
              incorrect birthday, etc., you may request to the admin by clicking
              here.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
