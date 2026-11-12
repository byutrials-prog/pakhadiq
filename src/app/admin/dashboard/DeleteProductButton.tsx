'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { deleteProductAction } from '@/app/actions/productActions';

export default function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    if (!window.confirm('Hapus produk ini dari katalog?')) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteProductAction(productId);
      if (!result.success) {
        setError(result.error);
        return;
      }
      if (result.warning) setError(result.warning);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="rounded border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-800 transition hover:bg-rose-50 disabled:opacity-50"
      >
        {isPending ? 'Menghapus…' : 'Hapus'}
      </button>
      {error && <p role="alert" className="max-w-48 text-right text-xs text-rose-800">{error}</p>}
    </div>
  );
}
