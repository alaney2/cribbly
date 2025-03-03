"use client";
import { useMediaQuery } from "usehooks-ts";
import { useState, useEffect } from "react";
import { Drawer } from "vaul";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/catalyst/dialog";
import { Heading, Subheading } from "@/components/catalyst/heading";
import { Text } from "@/components/catalyst/text";
import { Button } from "@/components/catalyst/button";

type VideoDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  // dialogBody: React.ReactNode;
  // dialogActions: React.ReactNode;
};

export function VideoDialog({
  isOpen,
  onClose,
  // dialogBody,
  // dialogActions,
}: VideoDialogProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (isMobile) {
    return (
      <Drawer.Root
        open={isOpen}
        onOpenChange={onClose}
        repositionInputs={false}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-zinc-950/25 dark:bg-zinc-950/50" />
          <Drawer.Content className="bg-white dark:bg-zinc-900 flex flex-col fixed bottom-0 left-0 right-0 max-h-[82vh] rounded-t-[10px]">
            <div className="max-w-md w-full mx-auto overflow-auto p-4 rounded-t-[10px]">
              <Drawer.Handle />
              <Drawer.Title asChild className="mt-8">
                <Subheading level={1}>Template heading</Subheading>
              </Drawer.Title>
              <Drawer.Description
                asChild
                className="leading-6 mt-2 text-gray-600"
              >
                <Text>Template text</Text>
              </Drawer.Description>
              <iframe
                // width="560"
                // height="315"
                src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
              <div className="flex flex-col mt-8 space-y-2">
                {/* {dialogActions} */}
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }
  return (
    <>
      <Dialog open={isOpen} onClose={onClose} size="4xl" className="z-50">
        <DialogTitle>Title</DialogTitle>
        <DialogDescription>Description</DialogDescription>
        <DialogBody>
          <iframe
            // width="560"
            // height="315"
            src="https://www.youtube.com/embed/I9AZhm-yKWI?si=P41Dnvhjry83L0TP"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </DialogBody>
        <DialogActions>
          <Button onClick={onClose} outline>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
