"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LinkPreview } from "./link-preview";

type Message = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

type Participant = {
  id: string;
  name: string;
};

export function ContractChat({ contractId, currentUserId, participants, initialMessages }: { contractId: string; currentUserId: string; participants: Participant[]; initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Poll for new messages every 5 seconds
  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`/api/contracts/${contractId}/messages`);
      if (response.ok) {
        const data = await response.json();
        if (data.messages) {
          setMessages(data.messages);
        }
      }
    } catch {
      // Silently fail on polling errors
    }
  }, [contractId]);

  useEffect(() => {
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;

    setSending(true);
    try {
      const response = await fetch(`/api/contracts/${contractId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send message");
      }

      setInput("");
      // Refresh messages
      await fetchMessages();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send message";
      toast.error(message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex-1 space-y-3 overflow-auto rounded-[var(--radius-md)] border border-card-border/70 bg-card/60 p-4">
        {messages.map((message) => {
          const isCurrent = message.sender_id === currentUserId;
          const participant = participants.find((p) => p.id === message.sender_id);
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          const segments = message.content.split(urlRegex);
          const links = Array.from(
            new Set(segments.filter((segment) => segment.startsWith("http://") || segment.startsWith("https://")))
          );
          return (
            <div key={message.id} className={`flex flex-col ${isCurrent ? "items-end" : "items-start"}`}>
              <span className="text-xs text-muted">{participant?.name ?? "Member"}</span>
              <div
                className={`mt-1 max-w-[70%] rounded-[var(--radius-md)] px-3 py-2 text-sm ${
                  isCurrent ? "bg-accent text-accent-foreground" : "bg-foreground/10 text-foreground"
                }`}
              >
                <p className="whitespace-pre-wrap break-words leading-relaxed">
                  {segments.map((segment, index) => {
                    if (!segment) {
                      return null;
                    }

                    const isLink = segment.startsWith("http://") || segment.startsWith("https://");

                    if (isLink) {
                      return (
                        <Fragment key={`${message.id}-segment-${index}`}>
                          <a
                            href={segment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="break-words font-medium underline decoration-current underline-offset-2 transition hover:opacity-80"
                          >
                            {segment}
                          </a>{" "}
                        </Fragment>
                      );
                    }

                    return <span key={`${message.id}-segment-${index}`}>{segment}</span>;
                  })}
                </p>
              </div>
              {links.length > 0 ? (
                <div className="mt-2 flex w-full max-w-[70%] flex-col gap-2">
                  {links.map((url) => (
                    <LinkPreview key={`${message.id}-${url}`} url={url} isCurrent={isCurrent} />
                  ))}
                </div>
              ) : null}
              <span className="mt-1 text-[11px] text-muted">{new Date(message.created_at).toLocaleString()}</span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div className="space-y-2">
        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={3}
          placeholder="Share updates, questions, or files (paste link)."
        />
        <Button onClick={sendMessage} loading={sending}>Send</Button>
      </div>
    </div>
  );
}
