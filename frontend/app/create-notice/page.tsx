"use client";

import CreateNoticeForm from "@/components/forms/create-notice-form";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CreateNotice() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold text-slate-800">
          Create a Notice
        </h1>
      </div>

      <CreateNoticeForm />
    </div>
  );
}
