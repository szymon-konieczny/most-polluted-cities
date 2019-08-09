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

export interface IAqApiRes {
  meta: IMeta;
  results: IMeasurement[];
}

export interface IPageData {
  extract: string;
  nas: number;
  pageId: number;
  title: string;
}

export interface IPage {
  [key: number]: IPageData;
}

export interface IPages {
  pages: IPage;
}

export interface IWikiRes {
  batchcomplete: string;
  query: IPages;
  warnings: { [key: string]: string };
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
  cityData?: string;
}
