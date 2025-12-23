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
import {
  useUpdateNoticeMutation,
  useDeleteNoticeMutation,
} from "@/store/services/noticeService";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

// Define the Notice Interface
interface Notice {
  id: number;
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
  isLoading?: boolean;
}

export default function NoticeTable({
  notices,
  pagination,
  onPageChange,
  isLoading,
}: NoticeTableProps) {
  const [updateNotice] = useUpdateNoticeMutation();
  const [deleteNotice, { isLoading: isDeleting }] = useDeleteNoticeMutation();
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [selectedRows, setSelectedRows] = React.useState<Set<number>>(
    new Set()
  );
  const router = useRouter();

  // Reset selection when page changes
  React.useEffect(() => {
    setSelectedRows(new Set());
  }, [pagination.page]);

  const handleStatusToggle = async (id: number, currentStatus: string) => {
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

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteNotice(deleteId).unwrap();
      toast.success("Notice deleted successfully");
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete notice:", error);
      toast.error("Failed to delete notice");
    }
  };

  const isAllSelected =
    notices.length > 0 && notices.every((n) => selectedRows.has(n.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows(new Set());
    } else {
      const newSelected = new Set(notices.map((n) => n.id));
      setSelectedRows(newSelected);
    }
  };

  const toggleSelectRow = (id: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 h-14">
            <TableRow>
              <TableHead className="w-[50px] text-center px-4">
                <Checkbox
                  className="w-5 h-5"
                  checked={isAllSelected}
                  onCheckedChange={toggleSelectAll}
                />
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2 text-slate-500">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Loading notices...
                  </div>
                </TableCell>
              </TableRow>
            ) : notices && notices.length > 0 ? (
              notices.map((notice) => (
                <TableRow key={notice.id} className="hover:bg-slate-50/50 h-16">
                  <TableCell className="text-center px-4">
                    <Checkbox
                      className="w-5 h-5"
                      checked={selectedRows.has(notice.id)}
                      onCheckedChange={() => toggleSelectRow(notice.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-slate-700 px-4">
                    {notice.title}
                  </TableCell>
                  <TableCell className="text-slate-600 px-4 capitalize">
                    {notice.type}
                  </TableCell>
                  <TableCell className="px-4 capitalize">
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
                        asChild
                      >
                        <Link href={`/notices/${notice.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
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
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/notices/${notice.id}`}
                              className="w-full cursor-pointer"
                            >
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                            onSelect={() => setDeleteId(notice.id)}
                          >
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
      {pagination && pagination.lastPage > 1 && (
        <NoticePagination pagination={pagination} onPageChange={onPageChange} />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              notice and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete Notice"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
