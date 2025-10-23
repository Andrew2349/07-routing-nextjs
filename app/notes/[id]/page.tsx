import { fetchNoteById } from "@/lib/api";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client"

type NoteDetailsProps = {
  params: Promise<{ id: string }>;
};

export default async function NoteDetails({params}:NoteDetailsProps) {
    const queryClient = new QueryClient()
    const {id} = await params
    await queryClient.prefetchQuery({
        queryKey: ["note", id],
        queryFn:()=>fetchNoteById(id)
    })
    const dehydratedState = dehydrate(queryClient);
    
    return (
        <HydrationBoundary state={dehydratedState}>
      <NoteDetailsClient></NoteDetailsClient>
    </HydrationBoundary>
    )
}