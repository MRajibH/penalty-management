import { departmentRef, designationRef, employeeRef } from "@/db/firebase.db";
import { onSnapshot } from "firebase/firestore";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  DataContextType,
  departmentType,
  designationType,
  employeesType,
} from "./types";
import { getQueryRef, getSnapshotData, mappedFunc } from "./functions";

export const DataContext = createContext({} as DataContextType);
export const useDataContext = () => useContext(DataContext);

export const DataContextProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<employeesType[]>([]);
  const [departments, setDepartments] = useState<departmentType[]>([]);
  const [designations, setDesignations] = useState<designationType[]>([]);

  useEffect(() => {
    // =========================
    // Refs with default query
    // =========================
    const QueryEmployeeRef = getQueryRef(employeeRef);
    const QueryDepartmentRef = getQueryRef(departmentRef);
    const QueryDesignationRef = getQueryRef(designationRef);

    // ===============================
    // Subcribe collections on mount
    // ===============================
    const unsubscribeEmployee = onSnapshot(QueryEmployeeRef, (snapshot) => {
      setEmployees(getSnapshotData(snapshot));
    });

    const unsubscribeDepartment = onSnapshot(QueryDepartmentRef, (snapshot) => {
      setDepartments(getSnapshotData(snapshot));
    });

    const unsubscribeDesignation = onSnapshot(
      QueryDesignationRef,
      (snapshot) => {
        setDesignations(getSnapshotData(snapshot));
      }
    );

    return () => {
      // ======================================
      // UnSubcribe all collections on unmount
      // ======================================
      unsubscribeEmployee();
      unsubscribeDepartment();
      unsubscribeDesignation();
    };
  }, []);

  // ==================================
  // Converting array to object
  // ==================================
  const employeeMapped = employees.reduce(mappedFunc, {} as any);
  const departmentMapped = departments.reduce(mappedFunc, {} as any);
  const designationMapped = designations.reduce(mappedFunc, {} as any);

  const value: any = {
    employees,
    departments,
    designations,
    employeeMapped,
    departmentMapped,
    designationMapped,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
