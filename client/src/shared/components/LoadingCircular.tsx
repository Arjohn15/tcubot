import { CircularProgress } from "@mui/material";
import { FC } from "react";

const LoadingCircular: FC<{ size?: string }> = ({ size = "3.5rem" }) => {
  return (
    <div className="h-full flex items-center justify-center">
      <div>
        <CircularProgress color="primary" size={size} />
      </div>
    </div>
  );
};

export default LoadingCircular;
