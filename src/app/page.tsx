import DefaultPage from '@/components/layout/default-layout';
import TripHeroSection from './home/page2';
import React from "react";

const TripMateMain: React.FC = () => {
  return (
    <DefaultPage>
        <TripHeroSection />
    </DefaultPage>
  );
};

export default TripMateMain;
