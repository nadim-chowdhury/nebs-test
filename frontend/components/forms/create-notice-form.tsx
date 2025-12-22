"use client";

import * as React from "react";
import { CalendarIcon, CloudUpload, Paperclip, X } from "lucide-react";
import { format } from "date-fns";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";
import { useCreateNoticeMutation } from "@/store/services/noticeService";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import CustomLoader from "../common/custom-loader";
import { ResponseModal } from "../ui/response-modal";

const noticeTypeOptions = [
  { value: "warning", label: "Warning / Disciplinary" },
  { value: "performance", label: "Performance Improvement" },
  { value: "appreciation", label: "Appreciation / Recognition" },
  { value: "attendance", label: "Attendance / Leave Issue" },
  { value: "payroll", label: "Payroll / Compensation" },
  { value: "contract", label: "Contract / Role Update" },
  { value: "advisory", label: "Advisory / Personal Reminder" },
];

// 1. Define Zod Schema
const formSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    department: z.string().min(1, "Target is required"),
    employeeId: z.string().optional(),
    employeeName: z.string().optional(),
    position: z.string().optional(),
    type: z.array(z.string()).min(1, "Select at least one notice type"),
    date: z.date({
      message: "Publish date is required",
    }),
    content: z.string().optional(),
    status: z.enum(["Published", "Draft"]),
  })
  .superRefine((data, ctx) => {
    // 2. Conditional Validation for Individual Target
    if (data.department === "individual") {
      if (!data.employeeId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Employee ID is required",
          path: ["employeeId"],
        });
      }
      if (!data.employeeName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Employee Name is required",
          path: ["employeeName"],
        });
      }
      if (!data.position) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Position is required",
          path: ["position"],
        });
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

export default function CreateNoticeForm() {
  const [open, setOpen] = React.useState(false);

  const router = useRouter();
  const [createNotice, { isLoading }] = useCreateNoticeMutation();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors }, // Get errors from form state
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema), // Integrate Zod Resolver
    defaultValues: {
      title: "",
      department: "individual",
      employeeId: "",
      employeeName: "",
      position: "",
      type: [],
      content: "",
      status: "Published",
    },
  });

  const departmentValue = watch("department");

  const onSubmit = async (data: FormValues, status: "Published" | "Draft") => {
    try {
      // 1. Derive targetType
      let targetType = "department";
      if (data.department === "individual") targetType = "individual";
      if (data.department === "all") targetType = "all";

      // 2. Construct Payload
      const payload = {
        title: data.title,
        content: data.content || "",
        department: data.department,
        targetType,
        status,
        type: data.type.join(", "),
        date: data.date.toISOString(),
        // Only include employee fields if target is individual
        ...(targetType === "individual" && {
          employeeId: data.employeeId,
          employeeName: data.employeeName,
          position: data.position,
        }),
      };

      // 3. Call API
      await createNotice(payload).unwrap();
      toast.success(
        `Notice ${
          status === "Draft" ? "saved as draft" : "published"
        } successfully!`
      );

      reset();
      setOpen(true);
    } catch (error) {
      console.error("Failed to create notice:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full bg-white rounded-lg border shadow-sm space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-800 px-6 py-4">
          Please fill in the details below
        </h2>
        <div className="h-px bg-slate-200" />
      </div>

      <div className="space-y-6 p-6 pt-0">
        {/* Target Department */}
        <div className="p-4 bg-slate-50/50 rounded-lg border space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-700">
              <span className="text-red-500 mr-1">*</span>
              Target Department(s) or Individual
            </Label>
            <Controller
              control={control}
              name="department"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger
                    className={cn(
                      "bg-slate-50 border-slate-200 !h-11 w-full",
                      errors.department && "border-red-500 focus:ring-red-500"
                    )}
                  >
                    <SelectValue placeholder="Select target" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="hr">HR Department</SelectItem>
                    <SelectItem value="it">IT Department</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.department && (
              <p className="text-red-500 text-xs mt-1">
                {errors.department.message}
              </p>
            )}
          </div>
        </div>

        {/* Notice Title */}
        <div className="space-y-2">
          <Label className="text-slate-700">
            <span className="text-red-500 mr-1">*</span>
            Notice Title
          </Label>
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Write the Title of Notice"
                className={cn(
                  "h-11 border-slate-200",
                  errors.title && "border-red-500 focus-visible:ring-red-500"
                )}
              />
            )}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Employee Details Row */}
        {departmentValue === "individual" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-700">
                <span className="text-red-500 mr-1">*</span>
                Select Employee ID
              </Label>
              <Controller
                control={control}
                name="employeeId"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      className={cn(
                        "!h-11 w-full",
                        errors.employeeId && "!border-red-500"
                      )}
                    >
                      <SelectValue placeholder="Select ID" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emp-001">EMP-001</SelectItem>
                      <SelectItem value="emp-002">EMP-002</SelectItem>
                      <SelectItem value="emp-003">EMP-003</SelectItem>
                      <SelectItem value="emp-004">EMP-004</SelectItem>
                      <SelectItem value="emp-005">EMP-005</SelectItem>
                      <SelectItem value="emp-006">EMP-006</SelectItem>
                      <SelectItem value="emp-007">EMP-007</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.employeeId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.employeeId.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700">
                <span className="text-red-500 mr-1">*</span>
                Employee Name
              </Label>
              <Controller
                control={control}
                name="employeeName"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter employee full name"
                    className={cn(
                      "h-11 border-slate-200",
                      errors.employeeName &&
                        "!border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                )}
              />
              {errors.employeeName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.employeeName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700">
                <span className="text-red-500 mr-1">*</span>
                Position
              </Label>
              <Controller
                control={control}
                name="position"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Select employee department"
                    className={cn(
                      "h-11 border-slate-200",
                      errors.position &&
                        "!border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                )}
              />
              {errors.position && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.position.message}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Notice Type & Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-slate-700">
              <span className="text-red-500 mr-1">*</span>
              Notice Type
            </Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <MultiSelect
                  options={noticeTypeOptions}
                  selected={field.value}
                  onChange={field.onChange}
                  placeholder="Select Notice Type"
                  className={cn(
                    "h-11",
                    errors.type && "border-red-500 focus:ring-red-500"
                  )}
                />
              )}
            />
            {errors.type && (
              <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-slate-700">
              <span className="text-red-500 mr-1">*</span>
              Publish Date
            </Label>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full h-11 justify-between text-left font-normal border-slate-200",
                        !field.value && "text-muted-foreground",
                        errors.date && "border-red-500 text-red-500"
                      )}
                    >
                      {field.value
                        ? format(field.value, "PPP")
                        : "Select Publishing Date"}
                      <CalendarIcon className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={(date) => date < new Date("1900-01-01")}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.date && (
              <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
            )}
          </div>
        </div>

        {/* Notice Body */}
        <div className="space-y-2">
          <Label className="text-slate-700">Notice Body</Label>
          <Controller
            control={control}
            name="content"
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Write the details about notice"
                className="min-h-[150px] border-slate-200 resize-none"
              />
            )}
          />
        </div>

        {/* Upload Attachments */}
        <div className="space-y-4">
          <Label className="text-slate-700">
            Upload Attachments (optional)
          </Label>
          <div className="border border-dashed border-emerald-400 bg-emerald-50/10 rounded-lg p-8 text-center hover:bg-emerald-50/30 transition-colors cursor-pointer">
            <div className="flex flex-col items-center justify-center gap-2">
              <CloudUpload className="h-10 w-10 text-emerald-500" />
              <div className="text-sm text-slate-600">
                <span className="text-emerald-500 font-medium">Upload</span>{" "}
                notice files or drag and drop.
              </div>
              <p className="text-xs text-slate-400">
                Accepted File Type: jpg, png, pdf
              </p>
            </div>
          </div>
          {/* File Item Mockup */}
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-full border border-slate-100 max-w-fit pr-3">
            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
              <Paperclip className="h-4 w-4 text-slate-500" />
            </div>
            <span className="text-sm text-slate-600 font-medium">
              Policy_Document.pdf
            </span>
            <button className="ml-2 hover:bg-slate-200 rounded-full p-0.5">
              <X className="h-4 w-4 text-red-400" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="h-11 min-w-[120px] text-slate-600 border-slate-400/60 hover:bg-slate-50 rounded-full"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleSubmit((data) => onSubmit(data, "Draft"))}
            disabled={isLoading}
            className="h-11 min-w-[140px] text-blue-500 border-blue-500/50 hover:bg-blue-50 hover:text-blue-600 rounded-full"
          >
            Save as Draft
          </Button>
          <Button
            onClick={handleSubmit((data) => onSubmit(data, "Published"))}
            disabled={isLoading}
            className="h-11 min-w-[160px] bg-orange-500 hover:bg-orange-600 text-white rounded-full gap-2 shadow-sm"
          >
            {isLoading ? (
              <CustomLoader />
            ) : (
              <>
                <Check className="h-4 w-4" />
                Publish Notice
              </>
            )}
          </Button>
        </div>
      </div>

      {/* <ResponseModal
        open={open}
        onClose={() => setOpen(false)}
        title="Notice"
        description="Notice created successfully"
      /> */}
    </div>
  );
}
