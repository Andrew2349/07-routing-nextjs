import { fetchNotes, Tag } from "@/lib/api";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import NotesClient from "./Notes.client";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function NotesPage({ params }: Props) {
  const { slug } = await params;
  const [tag, searchValue] = slug;
  const normalizedTag: Tag | undefined = tag === "all" ? undefined : tag as Tag;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", searchValue, 1, normalizedTag],
    queryFn: () => fetchNotes(searchValue ?? "", 1, normalizedTag),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient tag={normalizedTag} initialSearch={searchValue} />
    </HydrationBoundary>
  );
}
