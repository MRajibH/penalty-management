import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import EmployeeForm from "./EmployeeForm";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import useBoolean, { UseBooleanType } from "@/hooks/use-boolean";
import { Separator } from "@/components/ui/separator";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "@/components/data-table/DataTableRowActions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { employeeRef } from "@/db/firebase.db";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { employeesType } from "@/context/data-context/types";
import { useDataContext } from "@/context";

export const CreateEmployee = () => {
  const { open, setOpen, onClose } = useBoolean();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size={"sm"}>
          Add Employee
          <Plus />
        </Button>
      </SheetTrigger>
      <SheetContent className="lg:min-w-[500px]">
        <SheetHeader>
          <SheetTitle>Add Employee</SheetTitle>
          <SheetDescription>Create a new employee.</SheetDescription>
        </SheetHeader>
        <Separator className="mt-6" />
        <EmployeeForm onClose={onClose} />
      </SheetContent>
    </Sheet>
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
        className="translate-y-[2px] ml-4"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px] ml-4"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "avatar",
    header: ({ column }) => (
      <DataTableColumnHeader
        align="center"
        title="Avater"
        column={column}
        className="w-[100px]"
      />
    ),
    cell: ({ row }) => {
      const name: string = row.getValue("name") || "";
      const fallbacK_name =
        name.split(" ")[0].charAt(0) + (name.split(" ")[1]?.charAt(0) || "");

      return (
        <div className="w-[100px] flex justify-center">
          <Avatar className="w-9 h-9">
            <AvatarFallback>{fallbacK_name}</AvatarFallback>
          </Avatar>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="w-[150px]">{row.getValue("name")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "designation_id",
    header: ({ column }) => (
      <DataTableColumnHeader
        align="center"
        column={column}
        title="Designation"
      />
    ),
    cell: ({ row }) => {
      const { designationMapped } = useDataContext();
      const id: string = row.getValue("designation_id");
      const { designation_name } = designationMapped[id];

      return <div className="text-center">{designation_name}</div>;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "designation_id",
    header: ({ column }) => (
      <DataTableColumnHeader
        align="center"
        column={column}
        title="Department"
      />
    ),
    cell: ({ row }) => {
      const { departmentMapped, designationMapped } = useDataContext();
      const id: string = row.getValue("designation_id");
      const { department_id } = designationMapped[id];
      const { department_name } = departmentMapped[department_id];

      return <div className="text-center">{department_name}</div>;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader align="center" column={column} title="Action" />
    ),
    cell: ({ row }) => {
      const EditBoolean = useBoolean();
      const DeleteBoolean = useBoolean();

      return (
        <div className="flex justify-center">
          <DataTableRowActions
            onClickEdit={EditBoolean.onOpen}
            onClickDelete={DeleteBoolean.onOpen}
          />
          <EditEmployee data={row.original} {...EditBoolean} />
          <DeleteEmployee data={row.original} {...DeleteBoolean} />
        </div>
      );
    },
  },
];

interface EditEmployeeProps extends UseBooleanType {
  data: employeesType;
}

const EditEmployee = ({ data, ...boolean }: EditEmployeeProps) => {
  const { open, setOpen, onClose } = boolean;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="lg:min-w-[500px]">
        <SheetHeader>
          <SheetTitle>Edit Employee</SheetTitle>
          <SheetDescription>Update the Employee data.</SheetDescription>
        </SheetHeader>
        <Separator className="mt-6" />
        <EmployeeForm
          defaultValue={data}
          componentFor={"update"}
          onClose={onClose}
        />
      </SheetContent>
    </Sheet>
  );
};

interface DeleteEmployeeProps extends UseBooleanType {
  data: employeesType;
}

const DeleteEmployee = ({ data, ...boolean }: DeleteEmployeeProps) => {
  const { toast } = useToast();
  const { open, setOpen, onClose } = boolean;
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    const { id } = data;
    try {
      setLoading(true);
      await deleteDoc(doc(employeeRef, id));
      onClose();
    } catch (err: any) {
      toast({
        title: "Something went wrong",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(err?.message || err, null, 2)}
            </code>
          </pre>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] pb-4">
        <DialogHeader>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogDescription className="py-2">
            Are you sure you want to delete this Department?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant={"ghost"} onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant={"ghost"}
            loading={loading}
            onClick={handleClick}
            className="text-red-600 hover:text-red-600 hover:bg-red-50"
          >
            Yes, Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
