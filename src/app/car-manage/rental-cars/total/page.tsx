"use client"

import { useState } from 'react';
// ตรวจสอบว่า path ของ components ถูกต้องตามโครงสร้างโปรเจกต์ของคุณ
import SideNavbar from '@/components/car-manage/sidenav/sidenav'; 
import Navbar from '@/components/navbar/navbar';
import ManageCarNav from '@/components/car-manage/rentalcars/ManageCarNav';
import CarListItem from '@/components/car-manage/rentalcars/CarListItem';
import AddNewCarModal from '@/components/car-manage/AddNewCarModal';
import CarDetailModal from '@/components/car-manage/CarDetailModal'; 
import Toast from '@/components/ui/toast'; // (Import Toast)

// -- Mock Data: (ใช้เป็นค่าเริ่มต้น) --
const initialCars = [
  { id: 1, name: 'Toyota Yaris Ativ', status: 'Available', registration: 'SD-2568', transmission: 'Auto', engine: 'EV', fuel: 'Electric', passengers: 4, deposit: 5000, insurance: 500, location: 'Bangkok', description: 'A reliable and fuel-efficient sedan, perfect for city driving.', imageUrls: ['https://placehold.co/430x412/3B82F6/FFFFFF?text=Car+1'], price: 1200, rating: 4.8 },
  { id: 2, name: 'Honda Civic', status: 'Rented', registration: 'HC-1121', transmission: 'Auto', engine: '1.5L Turbo', fuel: 'Gasoline', passengers: 5, deposit: 8000, insurance: 500, location: 'Chiang Mai', description: 'Sporty look with a comfortable interior. Great handling.', imageUrls: ['https://placehold.co/430x412/10B981/FFFFFF?text=Car+2'], price: 1800, rating: 4.9 },
  { id: 3, name: 'Ford Ranger', status: 'Under Repair', registration: 'FR-7890', transmission: 'Manual', engine: '2.0L Diesel', fuel: 'Diesel', passengers: 5, deposit: 10000, insurance: 800, location: 'Phuket', description: 'A powerful pickup truck ready for any adventure, on or off the road.', imageUrls: ['https://placehold.co/430x412/F59E0B/FFFFFF?text=Car+3'], price: 2500, rating: 4.7 },
];

export default function RentalCarPage() {
  const [cars, setCars] = useState(initialCars);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const [toastState, setToastState] = useState({
    isVisible: false,
    message: "",
    type: "success" as "success" | "error" | "info",
  });

  const handleCreateCar = (allData) => { 
    console.log('New car data with images:', allData);
    
    const newCar = {
      // --- ข้อมูลจาก Modal ---
      id: cars.length + 1,
      name: allData.title, 
      price: parseFloat(allData.price) || 0, 
      description: allData.description, 
      location: allData.mapLink, 
      imageUrls: (allData.imagePreviews && allData.imagePreviews.length > 0)
        ? allData.imagePreviews
        : ['https://placehold.co/430x412/9CA3AF/FFFFFF?text=No+Image'], 
        
      // --- ข้อมูลที่ "จำลอง" ขึ้นมา ---
      status: 'Available', // รถใหม่ที่เพิ่มเข้ามาจะเป็น Available เสมอ
      registration: 'NEW-' + Math.floor(Math.random() * 1000), 
      transmission: 'Auto',
      engine: 'N/A',
      fuel: 'N/A',
      passengers: 4, // [แก้ไข] ใส่ค่าเริ่มต้นที่เหมาะสม
      deposit: 5000,  // [แก้ไข] ใส่ค่าเริ่มต้นที่เหมาะสม
      insurance: 500, // [แก้ไข] ใส่ค่าเริ่มต้นที่เหมาะสม
      rating: 5.0 
    };

    setCars(prevCars => [newCar, ...prevCars]);

    setToastState({
      isVisible: true,
      message: `Add "${newCar.name}" success`,
      type: "success",
    });
  };

  const handleViewDetails = (car) => {
    setSelectedCar(car);
    setIsDetailModalOpen(true);
  };

  const handleSaveCar = (updatedCar) => {
    setCars(prevCars => 
      prevCars.map(car => car.id === updatedCar.id ? updatedCar : car)
    );
    setToastState({
      isVisible: true,
      message: `Updated "${updatedCar.name}" successfully`,
      type: "success",
    });
  };

  const handleRemoveCar = (carToRemove) => {
    setCars(prevCars => prevCars.filter(c => c.id !== carToRemove.id));
    setToastState({
      isVisible: true,
      message: `Removed "${carToRemove.name}"`,
      type: "info",
    });
  };

  const handleCloseToast = () => {
    setToastState((prev) => ({ ...prev, isVisible: false }));
  };

  // [ใหม่] 1. คำนวณจำนวนรถตามสถานะ (จะคำนวณใหม่ทุกครั้งที่ `cars` state เปลี่ยน)
  const availableCount = cars.filter(car => car.status === 'Available').length;
  const rentedCount = cars.filter(car => car.status === 'Rented').length;
  const underRepairCount = cars.filter(car => car.status === 'Under Repair').length;

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-['Manrope']">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SideNavbar />
        
        <main className="flex-1 p-4 overflow-y-auto">
          <div className="flex gap-4 h-full">
            <ManageCarNav onAddNew={() => setIsAddModalOpen(true)} />

            <div className="flex-1 flex flex-col gap-4 bg-white p-4 rounded-lg border border-neutral-200">
              {/* [แก้ไข] 2. เพิ่ม JSX สำหรับแสดงผลส่วนที่คำนวณไว้ */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Total Cars</h1>
                  <p className="text-base text-gray-500 mb-2">{cars.length} Cars</p>
                  
                  {/* --- ส่วนที่เพิ่มเข้ามา --- */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                      <span className="text-gray-600">Available:</span>
                      <span className="font-semibold text-gray-800">{availableCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 bg-yellow-500 rounded-full"></span>
                      <span className="text-gray-600">Rented:</span>
                      <span className="font-semibold text-gray-800">{rentedCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 bg-red-500 rounded-full"></span>
                      <span className="text-gray-600">Repairing:</span>
                      <span className="font-semibold text-gray-800">{underRepairCount}</span>
                    </div>
                  </div>
                  {/* --- จบส่วนที่เพิ่มเข้ามา --- */}

                </div>
                <div className="flex items-center gap-4 text-sm">
                  <button className="text-gray-600 hover:text-black">Sort by</button>
                  <button className="text-gray-600 hover:text-black">View</button>
                </div>
              </div>

              <div className="flex flex-col gap-4 overflow-y-auto">
                {cars.map(car => (
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
      
      <CarDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        car={selectedCar}
        onSave={handleSaveCar}
        onRemove={handleRemoveCar}
      />

      {/* --- Render Toast --- */}
      <Toast
        message={toastState.message}
        isVisible={toastState.isVisible}
        onClose={handleCloseToast}
        type={toastState.type}
      />
    </div>
  );
}