import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiResponse, TableData } from '../types/types.ts';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://randomuser.me/api/' }),
  endpoints: (builder) => ({
    getData: builder.query<TableData[], void>({
      query: () =>
        '?results=30&inc=name,gender,dob,login,email,location&noinfo',
      // transformResponse: (response: apiResponse) => response.results,
      transformResponse: (response: apiResponse) => {
        return response.results.map((item, index) => ({
          key: index,
          name: `${item.name.first} ${item.name.last}`,
          gender: item.gender,
          age: item.dob.age,
          email: item.email,
          address: `${item.location.country}`,
        }));
      },
    }),
  }),
});

export const { useGetDataQuery } = api;
