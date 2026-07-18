import { useState } from 'react';

// Interfaces for our component state
interface Car {
  id: number;
  name: string;
  color: string;
}

export function GarageControls() {
  // Mock states to manage selected car interaction (CRUD/Engine simulation)
  const [selectedCar] = useState<Car | null>(null);

  // Triggered when a mock car selection happens
  //   const handleSelectMockCar = () => {
  //     const mockCar = { id: 1, name: 'Flame Speeder', color: '#EF4444' };
  //     setSelectedCar(mockCar);
  //     setUpdateName(mockCar.name);
  //     setUpdateColor(mockCar.color);
  //   };

  return (
    <div className='w-full bg-[#0A0E17] text-slate-100 pt-2 rounded-2xl'>
      <div className='mb-4 text-xs text-slate-500 flex gap-4'>
        <span>
          Status:{' '}
          {selectedCar ? `Editing "${selectedCar.name}"` : 'No car selected'}
        </span>
        <button
          //   onClick={0
          //     selectedCar ? () => setSelectedCar(null) : handleSelectMockCar
          //   }
          className='text-orange-500 underline hover:text-orange-400'
        >
          {selectedCar
            ? '[Simulate Deselect]'
            : '[Simulate Selecting a Car from List]'}
        </button>
      </div>
    </div>
  );
}
