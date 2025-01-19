import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
// import { DataTableRowActions } from "@/components/data-table/DataTableRowActions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useBoolean from "@/hooks/use-boolean";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";

export const CreateDesignation = () => {
  const { open, setOpen, onClose } = useBoolean(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"}>
          Add Designation
          <Plus />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add Designation</DialogTitle>
          <DialogDescription>Create a new designation.</DialogDescription>
        </DialogHeader>
        {/* <EmployeeForm /> */}
      </DialogContent>
    </Dialog>
  );
};

export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "designation_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Designation Name" />
    ),
    cell: ({ row }) => (
      <div className="w-full">{row.getValue("designation_name")}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "department",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => (
      <div className="w-full">{row.getValue("department")}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  //   {
  //     id: "actions",
  //     cell: ({ row }) => <DataTableRowActions row={row} />,
  //   },
];
