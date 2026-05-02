"use client";

import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function TrailerDialog({ videoKey, title }: { videoKey?: string; title: string }) {
  if (!videoKey) return null;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Play className="h-4 w-4" aria-hidden="true" />
          Trailer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl border-border bg-card p-3">
        <DialogTitle className="sr-only">{title} trailer</DialogTitle>
        <div className="aspect-video overflow-hidden rounded-md bg-black">
          <iframe
            title={`${title} trailer`}
            src={`https://www.youtube-nocookie.com/embed/${videoKey}`}
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
