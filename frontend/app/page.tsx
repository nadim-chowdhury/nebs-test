"use client";

import * as React from "react";
import { CalendarIcon, FilePenLine, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Input } from "@/components/ui/input";
import NoticeTable from "@/components/dashboard/notice-table";
import Link from "next/link";

import { useGetNoticesQuery } from "@/store/services/noticeService";
import CustomLoader from "@/components/common/custom-loader";

export default function Home() {
  const [date, setDate] = React.useState<Date>();
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useGetNoticesQuery(
    {
      page,
      limit: 10,
      search: debouncedSearch,
      status: status === "all" ? "" : status,
      department: department === "all" ? "" : department,
      // Date filtering logic could be added here if backend supports it
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const notices = data?.data?.data || [];
  const pagination = data?.data?.meta || { total: 0, page: 1, lastPage: 1 };

  if (isLoading) return <CustomLoader />;

  return (
    <section className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-800">
            Notice Management
          </h1>
          {/* Counts might be inaccurate with pagination unless backend sends them. Hiding or keeping 0 for now */}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/create-notice">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2 shadow-sm">
              <Plus className="h-4 w-4" />
              Create Notice
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => setStatus("Draft")}
            className="border-orange-200 text-orange-500 hover:bg-orange-50 hover:text-orange-600 gap-2 bg-white"
          >
            <FilePenLine className="h-4 w-4" />
            All Draft Notice
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-end gap-4 mb-2">
        <span className="text-sm font-medium text-slate-600 mr-2">
          Filter by:
        </span>
        {/* Departments Select */}
        <Select
          onValueChange={(val) => {
            setDepartment(val);
            setPage(1);
          }}
          value={department}
        >
          <SelectTrigger className="w-[200px] bg-slate-50 border-slate-200">
            <SelectValue placeholder="Departments or individuals" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="it">IT Department</SelectItem>
            <SelectItem value="hr">HR Department</SelectItem>
            <SelectItem value="individual">Individual</SelectItem>
          </SelectContent>
        </Select>

        {/* Employee Search Input */}
        <Input
          placeholder="Search by Title/Emp..."
          className="w-[180px] bg-slate-50 border-slate-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Status Select */}
        <Select
          onValueChange={(val) => {
            setStatus(val);
            setPage(1);
          }}
          value={status}
        >
          <SelectTrigger className="w-[120px] bg-slate-50 border-slate-200">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Published">Published</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Unpublished">Unpublished</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[160px] justify-start text-left font-normal bg-slate-50 border-slate-200",
                !date && "text-muted-foreground"
              )}
            >
              <span className="flex-1 truncate">
                {date ? format(date, "PPP") : "Published on"}
              </span>
              <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {/* Reset Filters */}
        <Button
          variant="outline"
          className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 border-blue-500/50"
          onClick={() => {
            setSearch("");
            setStatus("");
            setDepartment("");
            setPage(1);
            setDate(undefined);
          }}
        >
          Reset Filters
        </Button>
      </div>

      <NoticeTable
        notices={notices || []}
        pagination={pagination}
        onPageChange={setPage}
      />
    </section>
  );
}
