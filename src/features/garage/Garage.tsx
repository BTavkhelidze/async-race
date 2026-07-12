import GarageHeader from './components/GarageHeader';
import CreateCar from './components/CreateCar';
import CarList from './components/CarList';
import UpdateCar from './update-car/ui/UpdateCar';

function Garage() {
  return (
    <div>
      <GarageHeader />
      {/* <GarageControls /> */}
      <div className='flex gap-10'>
        <CreateCar />
        <UpdateCar />
      </div>
      <CarList />
    </div>
  );
}

export default Garage;
