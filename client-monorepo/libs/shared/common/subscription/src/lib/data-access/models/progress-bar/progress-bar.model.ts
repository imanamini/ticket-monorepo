export interface ProgressBarModel {
  used: number,
  total: number,
  defaultColor: '#F2F5F8',
  colorRange: ColorRangeModel[]
}

export interface ColorRangeModel {
  limit: number,
  color: string,
}
