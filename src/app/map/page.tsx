import React from "react";
import MapSection from "./map";
import DefaultLayout from "@/components/layout/default-layout";

export default function MapPage() {
  return (
      <DefaultLayout>
        <div className="-mx-24 -my-2.5">
          <MapSection />
        </div>
      </DefaultLayout>
  );
};
