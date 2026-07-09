import GarageHeader from './components/GarageHeader';
import CreateCar from './components/CreateCar';

function Garage() {
  return (
    <div>
      <GarageHeader />
      {/* <GarageControls /> */}
      <CreateCar />
    </div>
  );
}

export default Garage;
