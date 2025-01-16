import {Box, CircularProgress} from "@mui/material";
import {FC} from "react";

interface IProps {
    color?: "inherit" | "error" | "success" | "info" | "warning" | "primary" | "secondary" | undefined;
    mt?: number;
}

export const Loader: FC<IProps> = (props) => {
  return (
      <Box display="flex" justifyContent="center" mt={props.mt || 4}>
          <CircularProgress color={props.color}/>
      </Box>
  );
}