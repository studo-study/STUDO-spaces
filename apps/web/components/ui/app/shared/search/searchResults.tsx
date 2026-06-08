"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import SearchHeader from "@/components/ui/app/shared/search/searchheader";
import SearchResultClassroom from "@/components/ui/app/shared/search/classrooms/searchresult_classroom";
import SearchResultSets from "@/components/ui/app/shared/search/sets/searchresult_sets";
import SearchResultUsers from "@/components/ui/app/shared/search/users/searchresult_users";
import SearchResultStudo from "@/components/ui/app/shared/search/studo/searchresult_studo";
import NoResult from "@/components/ui/app/shared/search/noresult";
import { useSearchResult } from "@/hooks/app/search/useSearchResult";

interface SearchResults {
  data: [
    {
      type: "set";
      data: [];
    },
    {
      type: "profile";
      data: [];
    },
    {
      type: "classroom";
      data: [];
    },
    {
      type: "studo";
      data: [];
    },
  ];
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const result = useSearchResult(query ?? "").data;
  return (
    <div className={"flex flex-col justify-center items-center gap-5"}>
      {result && <SearchResultStudo />}
      {result && <SearchResultSets />}
      {result && <SearchResultUsers />}
      {result && <SearchResultClassroom />}
    </div>
  );
}
