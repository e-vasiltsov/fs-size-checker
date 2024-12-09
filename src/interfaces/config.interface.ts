import { SizeUnit } from "./size-converter.interface";

export interface SizeCheck {
  path: string | undefined;
  maxSize: string | undefined;
  unit: SizeUnit | undefined;
  ignore: string[] | undefined;
  config: SizeUnit | undefined;
}

export interface Configuration {
  sizeCheckList: SizeCheck[];
}

export interface Config {
  loadConfig(customPath: string | undefined): Configuration | undefined;
}
