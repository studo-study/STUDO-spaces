import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const params = new URLSearchParams();

  for (const key in resolvedSearchParams) {
    const value = resolvedSearchParams[key];

    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value !== undefined) {
      params.set(key, value);
    }
  }

  const query = params.toString();

  redirect(`/nl/search/all${query ? `?${query}` : ""}`);
}
