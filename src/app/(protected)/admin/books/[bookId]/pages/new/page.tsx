import { PageEditorForm } from "@/components/admin/PageEditorForm";

export default async function NewPage(props: { params: { bookId: string } }) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-zinc-100">Criar Nova Página</h1>
        <p className="text-xs text-zinc-500">Adicione conteúdo à estrutura do seu livro.</p>
      </header>

      <PageEditorForm
        bookId={props.params.bookId}
        action={`/admin/books/${props.params.bookId}/pages/new/action`}
      />
    </div>
  );
}
