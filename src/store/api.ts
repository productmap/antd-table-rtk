import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiResponse, DataType } from '../types.ts';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    getData: builder.query<DataType[], void>({
      query: () => 'api/data.json',
      transformResponse: (response: apiResponse) => response.data,
    }),
  }),
});

export const { useGetDataQuery } = api;
