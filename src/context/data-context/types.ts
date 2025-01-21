// ===============================
// Types of Data Context
// ===============================

export type employeesType = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: number;
  modifiedAt: number;
  designation_id: string;
};

export type departmentType = {
  id: string;
  createdAt: number;
  modifiedAt: number;
  department_name: string;
};

export type designationType = {
  id: string;
  createdAt: number;
  modifiedAt: number;
  department_id: string;
  designation_name: string;
};

export interface DataContextType {
  employees: employeesType[];
  departments: departmentType[];
  designations: designationType[];

  employeeMapped: Record<string, employeesType>;
  departmentMapped: Record<string, departmentType>;
  designationMapped: Record<string, designationType>;
}
