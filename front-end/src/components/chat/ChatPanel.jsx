"use client";

import Image from "next/image";
import { Paperclip, Send } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function ChatPanel({ messages, draft, onDraftChange, onSend }) {
  return (
    <Card className="flex h-full flex-col p-6">
      <div className="flex-1 space-y-4 overflow-x-hidden">
        {messages.map((message) => (
          <div key={message.id} className="max-w-full sm:max-w-[460px]">
            <p className="mb-1 px-3 text-xs text-[var(--text-soft)]">{message.author}</p>
            <div className="rounded-[18px] border border-[var(--border-light)] bg-white px-4 py-3 text-sm leading-6 text-[var(--text-main)] shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
              <p>{message.body}</p>
              {message.kind === "file" ? (
                <div className="mt-3 space-y-3">
                  {message.fileType?.startsWith("image/") && message.filePreview ? (
                    <Image
                      src={message.filePreview}
                      alt={message.fileName}
                      width={320}
                      height={220}
                      className="h-auto max-h-[220px] w-full rounded-[16px] border border-[var(--border-light)] object-cover"
                    />
                  ) : null}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-2 rounded-[14px] bg-slate-50 px-3 py-2 text-sm font-medium text-[var(--accent-strong)]">
                      <Paperclip className="h-4 w-4" />
                      {message.fileName}
                    </div>
                    {message.filePreview ? (
                      <a
                        href={message.filePreview}
                        download={message.fileName}
                        className="rounded-[14px] border border-[var(--border-light)] bg-white px-3 py-2 text-sm font-medium text-[var(--text-main)]"
                      >
                        Download
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
            <p className="mt-1 px-3 text-xs text-[var(--text-muted)]">{message.time}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-[18px] border border-[var(--border-light)] bg-white p-4">
        <input
          type="text"
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder="Type your message..."
          className="flex-1 text-base text-[var(--text-main)] outline-none placeholder:text-[var(--text-muted)]"
        />
        <Button type="button" onClick={onSend} className="flex h-11 w-11 items-center justify-center px-0">
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
}
