import { useId } from "react";
import css from "./NoteForm.module.css"
 import { Formik, Form, Field, type FormikHelpers, ErrorMessage } from 'formik';
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import type { CreateNoteRequest } from "@/types/note";

interface NoteFormValues{
  title: string,
  content: string,
  tag:"Todo" | "Work" | "Personal" | "Meeting" | "Shopping"
}

const initialValues:NoteFormValues ={
    title: "",
    content: "",
    tag:"Todo" 
}

interface NoteFormProps{
  onClose:()=>void
}

const Schema = Yup.object().shape({
  title: Yup.string().min(3, "Title can't be so short").max(50, "Title is too long").required("Title is required"),
  content: Yup.string().max(500, "Title is too long"),
  tag:Yup.string().oneOf(["Todo","Work","Personal","Meeting","Shopping"]).required("Tag is required")
})

export default function NoteForm({onClose}:NoteFormProps) {
    const queryClient = useQueryClient()
   const fieldId = useId();

    const mutation = useMutation({
      mutationFn: (values: CreateNoteRequest) => createNote(values),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notes"] })
        onClose()
      },
      
    })

    function handleSubmit(values:NoteFormValues, actions:FormikHelpers<NoteFormValues>) {
      mutation.mutate(values)
      
      actions.resetForm()
      
    }

    
    
    return (
        <Formik initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={Schema}
        >
        <Form className={css.form}>
  <div className={css.formGroup}>
    <label htmlFor={`${fieldId}-title`}>Title</label>
    <Field id={`${fieldId}-title`} type="text" name="title" className={css.input} />
    <ErrorMessage component="span" name="title" className={css.error} />
  </div>

  <div className={css.formGroup}>
    <label htmlFor={`${fieldId}-content`} >Content</label>
    <Field as="textarea"
      id={`${fieldId}-content`}
      name="content"
      rows={8}
      className={css.textarea}
    />
    <ErrorMessage component="span" name="content" className={css.error} />
  </div>

  <div className={css.formGroup}>
    <label htmlFor={`${fieldId}-tag`} >Tag</label>
    <Field as="select" id={`${fieldId}-tag`} name="tag" className={css.select}>
      <option value="Todo">Todo</option>
      <option value="Work">Work</option>
      <option value="Personal">Personal</option>
      <option value="Meeting">Meeting</option>
      <option value="Shopping">Shopping</option>
    </Field>
    <ErrorMessage component="span" name="tag" className={css.error} />
  </div>

  <div className={css.actions}>
    <button type="button" className={css.cancelButton} onClick={onClose}>
      Cancel
    </button>
    <button
      type="submit"
      className={css.submitButton}
      disabled={false}
    >
      Create note
    </button>
  </div>
            </Form>
            </Formik>
    )
}