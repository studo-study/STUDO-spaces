"use client";
import { useQueryClient } from "@tanstack/react-query";
import { flowKeys } from "@/hooks/app/flow/flowKeys";
import type {
  FlowBoardOverview,
  FlowBoardResponse,
  FullFlowCourseResponse,
} from "@studo/types";

interface Props {
  boards?: FlowBoardOverview[];
  board?: FlowBoardResponse;
  course?: FullFlowCourseResponse;
}

// Seeds the react-query cache with data fetched by the server components, so
// the client query hooks render hydrated data without an extra roundtrip.
// Seeds during render (before sibling consumers read the cache). The props are
// stable references within a mount, so setQueryData no-ops after the first pass
// and only re-seeds when the server sends new data on navigation.
export default function FlowStoreInitializer({ boards, board, course }: Props) {
  const queryClient = useQueryClient();

  if (boards) queryClient.setQueryData(flowKeys.boards, boards);
  if (board) queryClient.setQueryData(flowKeys.board(board.id), board);
  if (course) queryClient.setQueryData(flowKeys.course(course.id), course);

  return null;
}
