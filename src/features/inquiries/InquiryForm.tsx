import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { getErrorMessage } from "../../api/errors";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { Textarea } from "../../components/ui/Textarea";
import { createInquiry } from "./api";

export const InquiryForm = ({ listingId }: { listingId: string }) => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");

  const mutation = useMutation({
    mutationFn: createInquiry,
    onSuccess: () => {
      setSuccess("Your inquiry was sent.");
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess("");

    if (message.trim().length < 10) {
      return;
    }

    mutation.mutate({ listingId, message: message.trim() });
  };

  return (
    <form className="grid gap-4 rounded-md border border-stone-200 bg-white p-4" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-lg font-semibold text-stone-950">Contact the agent</h2>
        <p className="text-sm text-stone-600">Send a short message about this property.</p>
      </div>

      {success ? <Alert tone="success" message={success} /> : null}
      {mutation.isError ? <Alert tone="error" message={getErrorMessage(mutation.error)} /> : null}

      <Textarea
        label="Message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Is this property still available? I would like to schedule a viewing."
        error={message && message.trim().length < 10 ? "Use at least 10 characters." : undefined}
      />

      <Button type="submit" isLoading={mutation.isPending} disabled={message.trim().length < 10}>
        <Send className="h-4 w-4" aria-hidden="true" />
        Send inquiry
      </Button>
    </form>
  );
};
