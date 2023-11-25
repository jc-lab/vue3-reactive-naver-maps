export type SubModules = "panorama" | "geocoder" | "drawing" | "visualization"; // NaverMap SubModul Options

export interface Options {
  clientId: string;
  category?: "gov" | "ncp" | "fin";
  subModules?: SubModules[];
}

export type InitCallBacks = Array<(map: naver.maps.Map) => void>;

export type Layers =
  | "BACKGROUND"
  | "BACKGROUND_DETAIL"
  | "BICYCLE"
  | "CADASTRAL"
  | "CTT"
  | "HIKING_TRAIL"
  | "PANORAMA"
  | "POI_KOREAN"
  | "TRANSIT"
  | "KOREAN"
  | "ENGLISH"
  | "CHINESE"
  | "JAPANESE";
