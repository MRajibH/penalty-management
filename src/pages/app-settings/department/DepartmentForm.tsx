import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addDoc, doc, updateDoc } from "firebase/firestore";
import { departmentRef } from "@/db/firebase.db";

const DepartmentSchema = z.object({
  department_name: z.string(),
});

type DepartmentSchemaType = z.infer<typeof DepartmentSchema>;

interface DepartmentFormProps {
  onClose: any;
  componentFor?: "update" | "create";
  defaultValue?: DepartmentSchemaType & { id: string };
}

const DepartmentForm = ({
  onClose,
  defaultValue,
  componentFor = "create",
}: DepartmentFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<DepartmentSchemaType>({
    mode: "onChange",
    defaultValues: defaultValue || { department_name: "" },
    resolver: zodResolver(DepartmentSchema),
  });

  const onSubmit = async (data: DepartmentSchemaType) => {
    try {
      setLoading(true);

      const new_data = {
        createdAt: new Date().getTime(),
        modifiedAt: new Date().getTime(),
        ...data,
      };

      // for creating
      if (componentFor === "create") {
        await addDoc(departmentRef, new_data);
      }

      // for updating
      else if (componentFor === "update" && defaultValue?.id) {
        const { id } = defaultValue;
        const { createdAt, ...updated_data } = new_data;
        await updateDoc(doc(departmentRef, id), updated_data);
      }

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="py-4 space-y-6">
          {fields.map(({ name, label, description, placeholder }) => {
            return (
              <FormField
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input placeholder={placeholder} {...field} />
                    </FormControl>
                    <FormDescription>{description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}
        </div>

        <DialogFooter className="gap-2 py-8">
          <Button type="reset" variant={"outline"}>
            Close
          </Button>
          <Button loading={loading} variant={"default"} type="submit">
            {componentFor === "update" ? "Update" : "Create"} Department
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

type fieldType = {
  label: string;
  description: string;
  placeholder: string;
  name: "department_name";
};

const fields: fieldType[] = [
  {
    name: "department_name",
    label: "Department Name",
    description: "Enter the name of the new department, e.g., 'DevSecOps'.",
    placeholder: "Enter a department name ...",
  },
];

export default DepartmentForm;
