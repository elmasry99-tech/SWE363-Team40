"use client";

import { Paperclip, Upload } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function FileDropCard({ title, subtitle, uploadedFile, onUpload, onSend }) {
  async function handleFileChange(file) {
    if (!file) return;

    const preview = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });

    onUpload({
      name: file.name,
      type: file.type,
      preview,
    });
  }

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center gap-3 text-sm font-medium text-[var(--accent-strong)]">
        <Upload className="h-4 w-4" />
        {title}
      </div>
      <label className="flex h-[132px] cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed border-[rgba(23,147,170,0.35)] bg-white text-center">
        <Paperclip className="h-7 w-7 text-[var(--accent-strong)]" />
        <p className="mt-3 text-sm font-medium text-[var(--text-main)]">Upload secure attachment</p>
        <p className="mt-1 text-xs text-[var(--text-soft)]">{subtitle}</p>
        {uploadedFile ? <p className="mt-2 text-xs text-[var(--accent-strong)]">{uploadedFile.name}</p> : null}
        <input type="file" className="hidden" onChange={(event) => handleFileChange(event.target.files?.[0])} />
      </label>
      {uploadedFile ? (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--text-soft)]">Attachment ready to send in chat.</p>
          <Button variant="secondary" onClick={onSend}>
            Send to Chat
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
