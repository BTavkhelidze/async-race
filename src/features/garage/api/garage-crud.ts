export const API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL);

export type Car = {
  id: number;
  name: string;
  color: string;
};

export type CarPayload = {
  name: string;
  color: string;
};

export type GetCarsParams = {
  page?: number;
  limit?: number;
};

export type GetCarsResponse = {
  cars: Car[];
  totalCount: number;
};

const getResponseErrorDetails = async (response: Response): Promise<string> => {
  const responseText = await response.text();

  return responseText ? ` Response body: ${responseText}` : '';
};

export const ensureSuccessfulResponse = async (
  response: Response,
  message: string,
): Promise<void> => {
  if (!response.ok) {
    const errorDetails = await getResponseErrorDetails(response);
    throw new Error(
      `${message}. Status: ${response.status} ${response.statusText}.${errorDetails}`,
    );
  }
};

const buildGarageUrl = (path = '', params?: URLSearchParams): string => {
  const url = new URL(`/garage${path}`, API_BASE_URL);

  if (params) {
    url.search = params.toString();
  }

  return url.toString();
};

export const getCars = async (
  params?: GetCarsParams,
): Promise<GetCarsResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.page !== undefined) {
    queryParams.set('_page', String(params.page));
  }

  if (params?.limit !== undefined) {
    queryParams.set('_limit', String(params.limit));
  }

  const response = await fetch(buildGarageUrl('', queryParams));

  await ensureSuccessfulResponse(response, 'Failed to fetch cars');

  const cars = (await response.json()) as Car[];
  const totalCountHeader = response.headers.get('X-Total-Count');
  const parsedTotalCount =
    totalCountHeader === null ? Number.NaN : Number(totalCountHeader);
  const totalCount = Number.isNaN(parsedTotalCount)
    ? cars.length
    : parsedTotalCount;

  return {
    cars,
    totalCount,
  };
};

export const getCarById = async (id: number): Promise<Car> => {
  const response = await fetch(buildGarageUrl(`/${id}`));

  await ensureSuccessfulResponse(response, `Failed to fetch car with id ${id}`);

  return response.json() as Promise<Car>;
};

export const createCar = async (payload: CarPayload): Promise<Car> => {
  const response = await fetch(buildGarageUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  await ensureSuccessfulResponse(response, 'Failed to create car');

  return response.json() as Promise<Car>;
};

export const updateCar = async (
  id: number,
  payload: CarPayload,
): Promise<Car> => {
  const response = await fetch(buildGarageUrl(`/${id}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  await ensureSuccessfulResponse(
    response,
    `Failed to update car with id ${id}`,
  );

  return response.json() as Promise<Car>;
};

export const deleteCar = async (id: number): Promise<void> => {
  const response = await fetch(buildGarageUrl(`/${id}`), {
    method: 'DELETE',
  });

  await ensureSuccessfulResponse(
    response,
    `Failed to delete car with id ${id}`,
  );
};
