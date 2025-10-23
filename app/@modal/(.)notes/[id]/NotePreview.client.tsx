'use client';
import { Note } from '@/types/note';
import { useRouter } from 'next/navigation';
import css from "./NotePreview.module.css"
import Modal from '@/components/Modal/Modal';

interface Props {
  note:Note
}

export default function NotePreviewClient({ note }: Props) {
  const router = useRouter();

  const handleClose = () => router.back();

    return (
      <Modal onClose={handleClose}>
      <div className={css.container}>
  <div className={css.item}>
    <div className={css.header}>
      <h2>{note.title}</h2>
      <button onClick={handleClose} className={css.backBtn}>Close</button>
    </div>
    <p className={css.content}>{note.content}</p>
    <p className={css.tag}>{note.tag}</p>
    <p className={css.date}>{note.createdAt}</p>
  </div>
</div>
        </Modal>
  );
}
