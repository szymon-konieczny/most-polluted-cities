export interface ICountry {
  code: string;
  name: string;
}

export interface IRequestConfig {
  countryCode: string;
  order_by?: string;
  sortType?: string;
  limit?: number;
  parameter?: string;
}

export interface IMeta {
  found?: number;
  license: string;
  limit?: number;
  name: string;
  websitte: string;
}

export interface ICity {
  city: string;
  country: string;
  count: number;
  locations: number;
}

export interface IParameter {
  id: string;
  name: string;
  description: string;
  preferredUnit: string;
}

export interface IAqRes {
  meta: IMeta;
  results: ICity[]|IParameter[];
}

export interface IDate {
  utc: string;
  local: string;
}

export interface IAveragingPeriod {
  value: number;
  unit: string;
}

export interface ICoordinates {
  latitude: number;
  longitude: number;
}

export interface IAttribution {
  name: string;
  url?: string;
}

export interface IMeasurement {
  parameter: string;
  date: IDate;
  value: string;
  unit: string;
  location: string;
  country: string;
  city: string;
  sourceName: string;
  averagingPeriod: IAveragingPeriod;
  coordinates: ICoordinates;
  attribution: IAttribution[];
}
