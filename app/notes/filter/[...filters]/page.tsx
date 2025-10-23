import { fetchNotes } from "@/lib/api"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import NotesClient from "../../Notes.client";


interface Props{
    params:Promise<{filters:string[]}>
}

export default async function FiltersPage({params}:Props) {
     const queryClient = new QueryClient()
    
    const { filters } = await params
    const [tag, searchValue] = filters
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