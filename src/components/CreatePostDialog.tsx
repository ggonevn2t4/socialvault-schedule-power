import React from "react";
import { CreatePostModal } from "./posts/CreatePostModal";

interface CreatePostDialogProps {
  children: React.ReactNode;
}

export function CreatePostDialog({ children }: CreatePostDialogProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)}>
        {children}
      </div>
      <CreatePostModal open={open} onOpenChange={setOpen} />
    </>
  );
}