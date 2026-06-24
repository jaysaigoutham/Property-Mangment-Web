import { useQuery } from "@tanstack/react-query";
import { CalendarClock, MessageSquareText } from "lucide-react";
import { getErrorMessage } from "../../api/errors";
import { EmptyState } from "../../components/EmptyState";
import { Alert } from "../../components/ui/Alert";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import { getMyInquiries } from "./api";

export const InquiriesPage = () => {
  const inquiriesQuery = useQuery({
    queryKey: ["inquiries"],
    queryFn: getMyInquiries,
  });

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8">
      <div>
        <p className="text-sm font-semibold uppercase text-emerald-700">Messages</p>
        <h1 className="text-3xl font-bold text-stone-950">My inquiries</h1>
        <p className="mt-2 text-stone-600">Track the property inquiries you have submitted.</p>
      </div>

      {inquiriesQuery.isLoading ? <Spinner className="min-h-48 rounded-md border border-stone-200 bg-white" label="Loading inquiries" /> : null}
      {inquiriesQuery.isError ? <Alert tone="error" message={getErrorMessage(inquiriesQuery.error)} /> : null}
      {!inquiriesQuery.isLoading && !inquiriesQuery.isError && inquiriesQuery.data?.length === 0 ? (
        <EmptyState title="No inquiries yet" message="Open a property detail page and send a message to an agent." />
      ) : null}

      <div className="grid gap-4">
        {inquiriesQuery.data?.map((inquiry) => (
          <article className="rounded-md border border-stone-200 bg-white p-4 shadow-sm" key={inquiry.id}>
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-stone-700">
                  <MessageSquareText className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                  {inquiry.listingTitle || inquiry.listingId || "Property inquiry"}
                </div>
                <p className="text-stone-700">{inquiry.message}</p>
              </div>
              {inquiry.status ? <Badge tone="sky">{inquiry.status}</Badge> : null}
            </div>
            {inquiry.createdAt ? (
              <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-stone-500">
                <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                {new Date(inquiry.createdAt).toLocaleString()}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
};
