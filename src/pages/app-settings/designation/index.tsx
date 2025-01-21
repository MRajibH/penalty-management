import { DataTable } from "@/components/data-table/DataTable";
import { columns as defaultColumns, CreateDesignation } from "./utils";
import { useAuthContext, useDataContext } from "@/context";

const Designation = () => {
  const { currentUser } = useAuthContext();
  const { designations } = useDataContext();

  let columns = defaultColumns;
  let elements = [<CreateDesignation />];

  if (!currentUser) {
    elements = [];
    columns = columns.filter(({ id }) => id != "actions");
  }
  return (
    <DataTable columns={columns} data={designations} elements={elements} />
  );
};

export default Designation;
