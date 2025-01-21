import { DataTable } from "@/components/data-table/DataTable";
import { columns as defaultColumns, CreateDepartment } from "./utils";
import { useAuthContext, useDataContext } from "@/context";

const Department = () => {
  const { currentUser } = useAuthContext();
  const { departments } = useDataContext();

  let columns = defaultColumns;
  let elements = [<CreateDepartment />];

  if (!currentUser) {
    elements = [];
    columns = columns.filter(({ id }) => id != "actions");
  }

  return <DataTable data={departments} columns={columns} elements={elements} />;
};

export default Department;
