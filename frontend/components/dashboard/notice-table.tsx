"use client";

import * as React from "react";
import { MoreVertical, Eye, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { noticesData } from "@/utils/notices-data";

export default function NoticeTable() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 h-14">
            <TableRow>
              <TableHead className="w-[50px] text-center px-4">
                <Checkbox className="w-5 h-5" />
              </TableHead>
              <TableHead className="min-w-[200px] px-4">Title</TableHead>
              <TableHead className="min-w-[150px] px-4">Notice Type</TableHead>
              <TableHead className="min-w-[150px] px-4">
                Departments/Individual
              </TableHead>
              <TableHead className="min-w-[120px] px-4">Published On</TableHead>
              <TableHead className="min-w-[100px] px-4">Status</TableHead>
              <TableHead className="text-center px-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {noticesData.map((notice) => (
              <TableRow key={notice.id} className="hover:bg-slate-50/50 h-16">
                <TableCell className="text-center px-4">
                  <Checkbox className="w-5 h-5" />
                </TableCell>
                <TableCell className="font-medium text-slate-700 px-4">
                  {notice.title}
                </TableCell>
                <TableCell className="text-slate-600 px-4">
                  {notice.type}
                </TableCell>
                <TableCell className="px-4">
                  <span
                    className={
                      notice.department === "All Department"
                        ? "text-indigo-500"
                        : notice.department === "Finance"
                        ? "text-emerald-500"
                        : notice.department === "Sales Team"
                        ? "text-amber-500"
                        : notice.department === "Web Team"
                        ? "text-blue-500"
                        : notice.department === "HR"
                        ? "text-rose-500"
                        : "text-slate-600"
                    }
                  >
                    {notice.department}
                  </span>
                </TableCell>
                <TableCell className="text-slate-500 px-4">
                  {notice.date}
                </TableCell>
                <TableCell className="px-4">
                  <Badge
                    variant="secondary"
                    className={
                      notice.status === "Published"
                        ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        : notice.status === "Unpublished"
                        ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                    }
                  >
                    {notice.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-500"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-500"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="justify-between">
                          Published
                          <Switch checked={notice.status === "Published"} />
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <NoticePagination />
    </div>
  );
}

function NoticePagination() {
  return (
    <Pagination className="justify-center pt-2">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#"
            isActive
            className="bg-blue-50 text-blue-600 border-blue-200"
          >
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">4</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">5</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
