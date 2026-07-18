import type { CarPayload } from '../../garage/api/garage-crud';
import { CAR_BRANDS, CAR_MODELS } from '../model/generateCars.constants';

export const getRandomItem = <T,>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

export const generateRandomColor = (): string => {
  const color = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')
    .toUpperCase();

  return `#${color}`;
};

export const generateRandomCar = (): CarPayload => {
  const brand = getRandomItem(CAR_BRANDS);
  const model = getRandomItem(CAR_MODELS);

  return {
    name: `${brand} ${model}`,
    color: generateRandomColor(),
  };
};

export const generateRandomCars = (count: number): CarPayload[] => {
  return Array.from({ length: count }, generateRandomCar);
};
