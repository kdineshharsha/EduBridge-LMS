import React from "react";
import { FourSquare } from "react-loading-indicators";

export default function Loader() {
  return (
    <div>
      <FourSquare color={["#8b5cf6", "#3b82f6"]} size="medium" textColor="" />
    </div>
  );
}
