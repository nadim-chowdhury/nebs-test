"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { sidebarMenu } from "@/utils/sidebar-menu";
import { iconMap } from "@/lib/icon-map";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen border-r">
      {/* Logo */}
      <div className="h-20 flex items-center justify-center p-4 border-b">
        <Image
          src="/assets/logo.png"
          alt="logo"
          width={140}
          height={40}
          className="w-40 h-full object-contain"
        />
      </div>

      {/* Menu */}
      <nav className="p-3 space-y-1">
        <Accordion type="multiple" className="w-full">
          {sidebarMenu.map((item) => {
            const Icon = iconMap[item.icon];

            if (item.children) {
              return (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border-none"
                >
                  <AccordionTrigger className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-sm font-medium data-[state=open]:bg-secondary data-[state=open]:border-r-2 data-[state=open]:border-orange-500 data-[state=open]:shadow">
                    <div className="flex items-center gap-3">
                      {Icon && <Icon size={18} />}
                      <span>{item.label}</span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pl-8 pt-4 space-y-1 bg-secondary border border-t-0 rounded-lg">
                    {item.children.map((child) => (
                      <Link
                        key={child.id}
                        href={child.path}
                        className="block px-3 py-2 text-sm rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.path}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted"
              >
                {Icon && <Icon size={18} />}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </Accordion>
      </nav>
    </aside>
  );
}
