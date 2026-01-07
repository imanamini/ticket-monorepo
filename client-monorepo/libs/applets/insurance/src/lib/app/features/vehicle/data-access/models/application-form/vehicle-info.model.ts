export interface VehicleInfoModel {
  carBuildYear: string;
  carModelId: number;
  carUsageId: number;
  carTypeId?: number;
  vehicleOwnerChanged?: boolean;
  carType?: string;
  carUsage?: string;
  carBrandId?: number;
  carBrandLogo?: string;
  carBrand?: string;
  carModel?: string;
  fullName?: string;
  releaseDate?: string | null;
  propertyValue?: string | null;
}
