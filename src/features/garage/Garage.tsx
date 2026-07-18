import GarageHeader from './components/GarageHeader';
import CreateCar from './components/CreateCar';
import CarList from './components/CarList';
import UpdateCar from './update-car/ui/UpdateCar';
import GenerateCarsButton from '../generate-cars/ui/GenerateCarsButton';

function Garage() {
  return (
    <div className='max-[1039px]:min-w-0'>
      <GarageHeader />
      {/* <GarageControls /> */}
      <div className='flex flex-wrap gap-10 max-[1039px]:min-w-0 max-[1039px]:gap-4'>
        <CreateCar />
        <div className='flex flex-wrap items-end gap-4 max-[1039px]:min-w-0 max-[1039px]:flex-1'>
          <UpdateCar />
          <GenerateCarsButton />
        </div>
      </div>
      <CarList />
    </div>
  );
}

export default Garage;
