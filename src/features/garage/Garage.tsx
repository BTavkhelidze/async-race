import GarageHeader from './components/GarageHeader';
import CreateCar from './components/CreateCar';
import CarList from './components/CarList';
import UpdateCar from './update-car/ui/UpdateCar';
import GenerateCarsButton from '../generate-cars/ui/GenerateCarsButton';

function Garage() {
  return (
    <div>
      <GarageHeader />
      {/* <GarageControls /> */}
      <div className='flex flex-wrap gap-10'>
        <CreateCar />
        <div className='flex flex-wrap items-end gap-4'>
          <UpdateCar />
          <GenerateCarsButton />
        </div>
      </div>
      <CarList />
    </div>
  );
}

export default Garage;
