"use client"

import { useState } from 'react';
import SideNavbar from '@/components/car-manage/sidenav/sidenav'; 
import Navbar from '@/components/navbar/navbar';
import ManageCarNav from '@/components/car-manage/rentalcars/ManageCarNav';
import CarListItem from '@/components/car-manage/rentalcars/CarListItem';
import AddNewCarModal from '@/components/car-manage/AddNewCarModal';
import CarDetailModal from '@/components/car-manage/CarDetailModal'; // <-- Import Detail Modal

// -- Mock Data: เพิ่มรายละเอียดรถให้ครบถ้วนสำหรับ Popup --
const mockCars = [
  { id: 1, name: 'Toyota Yaris Ativ', status: 'Available', registration: 'SD-2568', transmission: 'Auto', engine: 'EV', fuel: 'Electric', passengers: 4, deposit: 5000, insurance: 500, location: 'Bangkok', description: 'A reliable and fuel-efficient sedan, perfect for city driving.', imageUrl: 'https://placehold.co/430x412/3B82F6/FFFFFF?text=Car+1', price: 1200, rating: 4.8 },
  { id: 2, name: 'Honda Civic', status: 'Available', registration: 'HC-1121', transmission: 'Auto', engine: '1.5L Turbo', fuel: 'Gasoline', passengers: 5, deposit: 8000, insurance: 500, location: 'Chiang Mai', description: 'Sporty look with a comfortable interior. Great handling.', imageUrl: 'https://placehold.co/430x412/10B981/FFFFFF?text=Car+2', price: 1800, rating: 4.9 },
  { id: 3, name: 'Ford Ranger', status: 'Available', registration: 'FR-7890', transmission: 'Manual', engine: '2.0L Diesel', fuel: 'Diesel', passengers: 5, deposit: 10000, insurance: 800, location: 'Phuket', description: 'A powerful pickup truck ready for any adventure, on or off the road.', imageUrl: 'https://placehold.co/430x412/F59E0B/FFFFFF?text=Car+3', price: 2500, rating: 4.7 },
];

export default function RentalCarPage() {
  // --- State สำหรับควบคุม Modal ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // <-- State สำหรับ Detail Modal
  const [selectedCar, setSelectedCar] = useState(null); // <-- State สำหรับเก็บข้อมูลรถที่ถูกเลือก

  const handleCreateCar = (formData) => {
    console.log('New car data:', formData);
  };

  // --- ฟังก์ชันสำหรับเปิด Detail Modal ---
  const handleViewDetails = (car) => {
    setSelectedCar(car);
    setIsDetailModalOpen(true);
  };

  const handleSaveCar = (updatedCar) => {
    // ในแอปจริง คุณจะส่งข้อมูลนี้ไปอัปเดตที่ Backend
    console.log('Saving updated car data:', updatedCar);
    // จากนั้นอาจจะต้อง fetch ข้อมูล mockCars ใหม่
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-['Manrope']">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SideNavbar />
        
        <main className="flex-1 p-4 overflow-y-auto">
          <div className="flex gap-4 h-full">
            <ManageCarNav onAddNew={() => setIsAddModalOpen(true)} />

            <div className="flex-1 flex flex-col gap-4 bg-white p-4 rounded-lg border border-neutral-200">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Under Repair Cars</h1>
                  <p className="text-base text-gray-500">{mockCars.length} Cars</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <button className="text-gray-600 hover:text-black">Sort by</button>
                  <button className="text-gray-600 hover:text-black">View</button>
                </div>
              </div>

              <div className="flex flex-col gap-4 overflow-y-auto">
                {/* ✅ เพิ่ม onClick prop เพื่อเรียกฟังก์ชัน handleViewDetails */}
                {mockCars.map(car => (
                  <CarListItem 
                    key={car.id} 
                    car={car} 
                    onClick={() => handleViewDetails(car)} 
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* --- Render Modals --- */}
      <AddNewCarModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateCar}
      />
      
      {/* ✅ Render Detail Modal */}
      <CarDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        car={selectedCar}
        onSave={handleSaveCar}
        onRemove={(car) => {
          console.log("Removed:", car);
          // TODO: ลบออกจาก list หรือเรียก API
        }}
      />
    </div>
  );
}