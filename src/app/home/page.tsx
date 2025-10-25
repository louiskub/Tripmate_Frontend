import React from "react";
import { Calendar, MapPin, Users } from "lucide-react"; // ใช้ไอคอน lucide-react
import DefaultLayout from "@/components/layout/default-layout";
import TripHeroSection from "./page2";

const HomePage: React.FC = () => {
  return (
    <DefaultLayout>
      <TripHeroSection />
    </DefaultLayout>
  );
};

export default HomePage;
