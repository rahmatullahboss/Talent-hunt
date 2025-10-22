"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Json } from "@/types/database";

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
  const supabase = createSupabaseBrowserClient();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel(`contract-chat-${contractId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `contract_id=eq.${contractId}` }, (payload) => {
        const newMessage = payload.new as Json as Message;
        setMessages((prev) => [...prev, newMessage]);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [contractId, supabase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const { error } = await supabase.from("messages").insert({
      contract_id: contractId,
      sender_id: currentUserId,
      content: input.trim(),
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    setInput("");
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex-1 space-y-3 overflow-auto rounded-[var(--radius-md)] border border-card-border/70 bg-card/60 p-4">
        {messages.map((message) => {
          const isCurrent = message.sender_id === currentUserId;
          const participant = participants.find((p) => p.id === message.sender_id);
          return (
            <div key={message.id} className={`flex flex-col ${isCurrent ? "items-end" : "items-start"}`}>
              <span className="text-xs text-muted">{participant?.name ?? "Member"}</span>
              <div className={`mt-1 max-w-[70%] rounded-[var(--radius-md)] px-3 py-2 text-sm ${isCurrent ? "bg-accent text-accent-foreground" : "bg-foreground/10 text-foreground"}`}>
                {message.content}
              </div>
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
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
