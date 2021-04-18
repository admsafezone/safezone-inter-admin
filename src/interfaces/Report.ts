export interface Report {
  _id: string;
  name: string;
  description: string;
  code: string;
  pipelines: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ReportResult {
  _id: string;
  name: string;
  type: any;
  key: string;
  file: string;
  size: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ReportDashboard {
  _id: string;
  code: string;
  name: string;
  file: string;
  size: number;
  createdAt?: string;
  updatedAt?: string;
}
