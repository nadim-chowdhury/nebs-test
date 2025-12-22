import { ScrollArea } from "../ui/scroll-area";

export default function CommonScrollArea({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScrollArea className="h-[calc(100vh-80px)] w-full pt-4 p-6 bg-slate-50">
      {children}
    </ScrollArea>
  );
}
