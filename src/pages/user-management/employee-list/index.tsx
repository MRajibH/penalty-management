import { DataTable } from "@/components/data-table/DataTable";
import { columns as defaultColumns, CreateEmployee } from "./utils";
import { useAuthContext, useDataContext } from "@/context";

const EmployeeList = () => {
  const { currentUser } = useAuthContext();
  const { employees } = useDataContext();

  let columns = defaultColumns;
  let elements = [<CreateEmployee />];

  if (!currentUser) {
    elements = [];
    columns = columns.filter(({ id }) => id != "actions");
  }

  return <DataTable data={employees} columns={columns} elements={elements} />;
};

export default EmployeeList;
