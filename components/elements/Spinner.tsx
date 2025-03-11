"use client";

import React from "react";
import styled from "styled-components";

const SpinnerDiv = styled.div`
  width: 65px;
  height: 65px;
  border: 8px solid white;
  border-top: 8px solid #cf9eeb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Spinner = () => {
  return <SpinnerDiv />;
};

export default Spinner;
