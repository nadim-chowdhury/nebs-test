"use client";

import * as React from "react";
import { MoreVertical, Eye, Pencil } from "lucide-react";
import { format } from "date-fns";
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
import { toast } from "sonner";
import { useUpdateNoticeMutation } from "@/store/services/noticeService";

// Define the Notice Interface
interface Notice {
  id: string;
  title: string;
  type: string;
  department: string;
  date: string;
  status: "Published" | "Draft" | "Unpublished" | string;
}

interface PaginationMeta {
  total: number;
  page: number;
  lastPage: number;
}

interface NoticeTableProps {
  notices: Notice[];
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function NoticeTable({
  notices,
  pagination,
  onPageChange,
}: NoticeTableProps) {
  const [updateNotice] = useUpdateNoticeMutation();

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    try {
      const newStatus =
        currentStatus === "Published" ? "Unpublished" : "Published";
      await updateNotice({ id, status: newStatus }).unwrap();
      toast.success(`Notice status updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    }
  };

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
            {notices && notices.length > 0 ? (
              notices.map((notice) => (
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
                    {format(new Date(notice.date), "dd-MMM-yyyy")}
                  </TableCell>
                  <TableCell className="px-4">
                    <Badge
                      variant="default"
                      className={`rounded ${
                        notice.status === "Published"
                          ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          : notice.status === "Unpublished"
                          ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                      }`}
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
                          <DropdownMenuItem
                            className="justify-between"
                            onSelect={(e) => e.preventDefault()}
                          >
                            Published
                            <Switch
                              checked={notice.status === "Published"}
                              onCheckedChange={() =>
                                handleStatusToggle(notice.id, notice.status)
                              }
                            />
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No notices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && pagination.total > 0 && (
        <NoticePagination pagination={pagination} onPageChange={onPageChange} />
      )}
    </div>
  );
}

function NoticePagination({
  pagination,
  onPageChange,
}: {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}) {
  const { page, lastPage } = pagination;

  return (
    <Pagination className="justify-center pt-2">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) onPageChange(page - 1);
            }}
            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              href="#"
              isActive={p === page}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(p);
              }}
              className={
                p === page ? "bg-blue-50 text-blue-600 border-blue-200" : ""
              }
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page < lastPage) onPageChange(page + 1);
            }}
            className={page >= lastPage ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
