"use client";

import { useGetNoticeByIdQuery } from "@/store/services/noticeService";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Building, User, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CustomLoader from "@/components/common/custom-loader";
import { format } from "date-fns";

export default function NoticeDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: notice, isLoading, error } = useGetNoticeByIdQuery(id);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <CustomLoader />
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Notice not found
        </h2>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <Button
        variant="ghost"
        className="gap-2 pl-0 hover:bg-transparent hover:text-slate-900 text-slate-500"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Notices
      </Button>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {/* Header */}
        <div className="border-b px-8 py-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-slate-900">
                {notice.title}
              </h1>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(notice.date), "PPP")}
                </span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  {notice.department}
                </span>
              </div>
            </div>
            <Badge
              className={
                notice.status === "Published"
                  ? "bg-emerald-500 hover:bg-emerald-600"
                  : "bg-amber-500 hover:bg-amber-600"
              }
            >
              {notice.status}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8 space-y-8">
          {/* Main Body */}
          <div className="prose prose-slate max-w-none">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Description
            </h3>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {notice.content || "No content provided."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notice Type
              </h3>
              <div className="flex flex-wrap gap-2">
                {notice.type.split(",").map((type: string) => (
                  <Badge key={type} variant="secondary">
                    {type.trim()}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Target Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <User className="h-4 w-4" />
                Target Audience
              </h3>
              <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm border">
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-medium text-slate-900">
                    {notice.department}
                  </span>
                </div>
                {notice.targetType === "individual" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Employee:</span>
                      <span className="font-medium text-slate-900">
                        {notice.employeeName} ({notice.employeeId})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Position:</span>
                      <span className="font-medium text-slate-900">
                        {notice.position}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
