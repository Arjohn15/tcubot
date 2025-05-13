import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPage from "./features/admin/AdminPage";
import AdminDashboard from "./features/admin/AdminDashboard/AdminDashboard";
import AdminLogIn from "./features/admin/AdminLogIn/AdminLogIn";
import UserRegister from "./features/user/UserRegister/UserRegister";
import UserLogIn from "./features/user/UserLogIn/UserLogIn";
import UserChat from "./features/user/UserChat/UserChat";
import UserPage from "./features/user/UserPage";
import UserProfile from "./features/user/UserProfile/UserProfile";
import { useAppDispatch, useAppSelector } from "./features/store/hooks";
import {
  selectSnackbar,
  snackbarClosed,
} from "./features/store/shared/snackbarSlice";
import SnackbarAuto from "./shared/components/SnackbarAuto";
import UserVisit from "./features/user/UserVisit/UserVisit";
function App() {
  const { isSnackbar, message, severity } = useAppSelector(selectSnackbar);

  const dispatch = useAppDispatch();

  function handleCloseSB() {
    dispatch(snackbarClosed());
  }

  return (
    <div className="font-main">
      <Router>
        <Routes>
          <Route path="/" element={<UserLogIn />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/user" element={<UserPage />}>
            <Route path="/user/chat" element={<UserChat />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/visit/:id" element={<UserVisit />} />
          </Route>

          <Route path="/admin" element={<AdminPage />}>
            <Route index element={<AdminLogIn />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Router>

      <SnackbarAuto
        isOpen={isSnackbar}
        message={message}
        severity={severity}
        onClose={handleCloseSB}
      />
    </div>
  );
}

export default App;
