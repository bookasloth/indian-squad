"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export function PostMenu({
  canReport,
  canDelete,
  onReport,
  onDelete,
}: {
  canReport: boolean;
  canDelete: boolean;
  onReport: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  if (!canReport && !canDelete) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="More"
        className="text-muted-foreground transition-ui hover:text-foreground"
      >
        <MoreHorizontal className="size-4" />
      </button>
      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-10 cursor-default"
            aria-hidden
            onClick={() => setOpen(false)}
            tabIndex={-1}
          />
          <div className="absolute right-0 z-20 mt-1 flex w-36 flex-col rounded-input border border-border bg-popover py-1 text-sm shadow-md">
            {canReport && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onReport();
                }}
                className="px-3 py-1.5 text-left hover:bg-accent"
              >
                Report
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onDelete();
                }}
                className={cn("px-3 py-1.5 text-left text-danger hover:bg-accent")}
              >
                Delete
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
