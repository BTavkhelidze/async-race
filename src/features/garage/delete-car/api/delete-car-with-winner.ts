import { deleteCar } from '../../api/garage-crud';
import {
  deleteWinner,
  isWinnerNotFoundError,
} from '../../../winners/api/winners.api';

export const deleteCarWithRelatedWinner = async (
  carId: number,
): Promise<void> => {
  try {
    await deleteWinner(carId);
  } catch (error) {
    if (!isWinnerNotFoundError(error)) {
      throw error;
    }
  }

  await deleteCar(carId);
};
