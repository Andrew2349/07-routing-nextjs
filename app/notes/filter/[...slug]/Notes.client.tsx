"use client";
import { useState } from "react";
import css from "./NotesPage.module.css"
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../../../lib/api";
import SearchBox from "../../../../components/SearchBox/SearchBox";
import NoteList from "../../../../components/NoteList/NoteList";
import Modal from "../../../../components/Modal/Modal";
import NoteForm from "../../../../components/NoteForm/NoteForm";
import Pagination from "../../../../components/Pagination/Pagination";
import { useDebouncedCallback } from "use-debounce";
import { useParams, useRouter } from "next/navigation";

export default function NotesClient() {
  const router = useRouter()
  
  const [curPage, setCurPage] = useState(1);
  const [isModalOpen, setOpenModal] = useState(false);

  const { slug } = useParams<{ slug: string[] }>()
  const [tag, searchValue] = slug
  const [search, setSearch] = useState(searchValue ?? "")
  const normalizedTag = tag === "all" ? undefined : tag;
  const openModal = () => setOpenModal(true);
  const closeModal = () => setOpenModal(false);

  const { data: notes } = useQuery({
    queryKey: ["notes", search, curPage, normalizedTag],
    queryFn: () => fetchNotes(search, curPage, normalizedTag),
    placeholderData: keepPreviousData,
    refetchOnMount: false
  });

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setCurPage(1);
    router.push(`/notes/filter/${tag}/${value}`)
  }, 500);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} value={search} />
        {notes && notes.totalPages > 1 && (
          <Pagination
            curPage={curPage}
            totalPages={notes?.totalPages ?? 0}
            setCurrentPage={setCurPage}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
        {isModalOpen && (
          <Modal onClose={closeModal}>
            <NoteForm onClose={closeModal} />
          </Modal>
        )}
      </header>

      <main>{notes && notes.notes.length > 0 && <NoteList notes={notes.notes} />}</main>
    </div>
  );
}