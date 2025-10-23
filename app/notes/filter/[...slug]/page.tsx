import { fetchNotes } from "@/lib/api"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import NotesClient from "./Notes.client";


interface Props{
    params:Promise<{slug:string[]}>
}

export default async function FiltersPage({params}:Props) {
     const queryClient = new QueryClient()
    
    const { slug } = await params
    const [tag, searchValue] = slug
    const normalizedTag = tag === "all" ? undefined : tag;
    
    
        await queryClient.prefetchQuery({
        queryKey: ["notes", searchValue, 1, normalizedTag],
        queryFn: () => fetchNotes(searchValue, 1,normalizedTag),
      });
    
      const dehydratedState = dehydrate(queryClient);
    
      return (
        <HydrationBoundary state={dehydratedState}>
          <NotesClient></NotesClient>
        </HydrationBoundary>
      );
}