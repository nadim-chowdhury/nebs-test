"use client";

import * as React from "react";
import { CalendarIcon, CloudUpload, Paperclip, X } from "lucide-react";
import { format } from "date-fns";

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

const noticeTypeOptions = [
  { value: "warning", label: "Warning / Disciplinary" },
  { value: "performance", label: "Performance Improvement" },
  { value: "appreciation", label: "Appreciation / Recognition" },
  { value: "attendance", label: "Attendance / Leave Issue" },
  { value: "payroll", label: "Payroll / Compensation" },
  { value: "contract", label: "Contract / Role Update" },
  { value: "advisory", label: "Advisory / Personal Reminder" },
];

export default function CreateNoticeForm() {
  const [date, setDate] = React.useState<Date>();
  const [selectedNoticeTypes, setSelectedNoticeTypes] = React.useState<
    string[]
  >([]);

  const router = useRouter();
  const [createNotice, { isLoading }] = useCreateNoticeMutation();

  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      title: "",
      department: "individual",
      employeeId: "",
      employeeName: "",
      position: "",
      type: [] as string[],
      date: undefined as Date | undefined,
      content: "",
      status: "Published", // Default status
    },
  });

  const departmentValue = watch("department");

  const onSubmit = async (data: any, status: "Published" | "Draft") => {
    try {
      // 1. Derive targetType
      let targetType = "department";
      if (data.department === "individual") targetType = "individual";
      if (data.department === "all") targetType = "all";
      // 2. Construct Payload
      const payload = {
        title: data.title,
        content: data.content,
        department: data.department,
        targetType,
        status, // 'Published' or 'Draft'
        type: data.type.join(", "), // Convert array to string
        date: data.date ? data.date.toISOString() : undefined,
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
      router.push("/");
      router.refresh();
      reset();
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
                  <SelectTrigger className="bg-slate-50 border-slate-200 !h-11 w-full">
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
                className="h-11 border-slate-200"
              />
            )}
          />
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
                    <SelectTrigger className="!h-11 w-full border-slate-200 text-slate-500">
                      <SelectValue placeholder="Select ID" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emp-001">EMP-001</SelectItem>
                      <SelectItem value="emp-002">EMP-002</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
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
                    className="h-11 border-slate-200"
                  />
                )}
              />
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
                    className="h-11 border-slate-200"
                  />
                )}
              />
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
                  className="h-11 border-slate-200"
                />
              )}
            />
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
                        !field.value && "text-muted-foreground"
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
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
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
    </div>
  );
}
