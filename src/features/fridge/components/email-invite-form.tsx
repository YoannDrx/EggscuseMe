"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createEmailInvitationAction } from "@/features/fridge/email-invitation.action";
import { Mail, Send } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function EmailInviteForm() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    startTransition(async () => {
      const result = await createEmailInvitationAction({ email: email.trim() });

      if (result.data?.invitation) {
        toast.success("Invitation envoyee !");
        setEmail("");
      } else if (result.serverError) {
        toast.error(result.serverError);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Mail className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          type="email"
          placeholder="email@exemple.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-10"
          disabled={isPending}
        />
      </div>
      <Button
        type="submit"
        variant="neubrutalism"
        disabled={isPending || !email.trim()}
      >
        <Send className="mr-2 size-4" />
        {isPending ? "Envoi..." : "Inviter"}
      </Button>
    </form>
  );
}
