import NyanCat from "@/components/nyan-cat";
import DarkPageMarker from "@/components/dark-page-marker";
import { cn } from "@/lib/utils";
import Spline from "@splinetool/react-spline";
import { Application } from "@splinetool/runtime";
import React, { Suspense } from "react";

const NotFoundPage = () => {
  return (
    <>
      <DarkPageMarker />
      <Suspense fallback={<div>Loading...</div>}>
        <Spline scene="/assets/404.spline" style={{ height: "100vh" }} />
      </Suspense>
    </>
  );
};

export default NotFoundPage;
