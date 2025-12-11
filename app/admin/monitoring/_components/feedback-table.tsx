import { AutomaticPagination } from "@/components/nowts/automatic-pagination";
import {
  NeoTable,
  NeoTableBody,
  NeoTableHead,
  NeoTableHeader,
  NeoTableRow,
} from "@/components/neo/neo-table";
import { getFeedbackList } from "@/query/feedback/get-feedback";
import { FeedbackRow } from "./feedback-row";

type FeedbackTableProps = {
  searchParams: {
    page: number;
    search: string;
  };
};

export const FeedbackTable = async ({ searchParams }: FeedbackTableProps) => {
  const pageSize = 10;
  const currentPage = searchParams.page;

  const result = await getFeedbackList({
    page: currentPage,
    pageSize,
    search: searchParams.search || undefined,
  });

  const { feedback, totalPages } = result;

  return (
    <>
      <NeoTable>
        <NeoTableHeader>
          <NeoTableRow>
            <NeoTableHead>User</NeoTableHead>
            <NeoTableHead>Review</NeoTableHead>
            <NeoTableHead>Message</NeoTableHead>
            <NeoTableHead>Date</NeoTableHead>
            <NeoTableHead>Actions</NeoTableHead>
          </NeoTableRow>
        </NeoTableHeader>
        <NeoTableBody>
          {feedback.map((item) => (
            <FeedbackRow key={item.id} feedback={item} />
          ))}
        </NeoTableBody>
      </NeoTable>

      <AutomaticPagination
        currentPage={currentPage}
        totalPages={totalPages}
        searchParam={searchParams.search}
        paramName="page"
      />
    </>
  );
};
