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

export default function Home() {
  const [date, setDate] = React.useState<Date>();

  return (
    <section className="flex flex-col gap-6 w-full p-4 px-6 bg-background">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-800">
            Notice Management
          </h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-500 font-medium">
              Active Notices: 8
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-amber-500 font-medium">Draft Notice: 04</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            Create Notice
          </Button>
          <Button
            variant="outline"
            className="border-orange-200 text-orange-500 hover:bg-orange-50 hover:text-orange-600 gap-2 bg-white"
          >
            <FilePenLine className="h-4 w-4" />
            All Draft Notice
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-end gap-4">
        <span className="text-sm font-medium text-slate-600 mr-2">
          Filter by:
        </span>
        {/* Departments Select */}
        <Select>
          <SelectTrigger className="w-[200px] bg-slate-50 border-slate-200">
            <SelectValue placeholder="Departments or individuals" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="it">IT Department</SelectItem>
            <SelectItem value="hr">HR Department</SelectItem>
            <SelectItem value="individual">Individual</SelectItem>
          </SelectContent>
        </Select>

        {/* Employee Search Input */}
        <Input
          placeholder="Employee Id or Name"
          className="w-[180px] bg-slate-50 border-slate-200"
        />

        {/* Status Select */}
        <Select>
          <SelectTrigger className="w-[120px] bg-slate-50 border-slate-200">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
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
        >
          Reset Filters
        </Button>
      </div>
    </section>
  );
}
