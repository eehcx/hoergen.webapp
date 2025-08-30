import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import React from 'react';
import { useStaticTranslation } from '@/hooks/useTranslation';

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: { title: string; description: string };
  setForm: (form: { title: string; description: string }) => void;
  onSubmit: () => void;
  isPending: boolean;
  isError: boolean;
}

export const CreateEventDialog: React.FC<CreateEventDialogProps> = ({
  open,
  onOpenChange,
  form,
  setForm,
  onSubmit,
  isPending,
  isError,
}) => {
  const { t } = useStaticTranslation();
  
  return (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className='p-0 border-0 rounded-none' style={{ borderRadius: 0 }}>
      <DialogTitle className='px-6 pt-6 pb-2 font-bold text-lg border-b border-zinc-200 dark:border-zinc-800' style={{ borderRadius: 0 }}>
        {t('eventDialogs.createEvent')}
      </DialogTitle>
      <form
        className='flex flex-col gap-3 px-6 py-6'
        onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className='flex items-center gap-4'>
          <label htmlFor='event-title' className='w-28 text-sm font-medium text-zinc-700 dark:text-zinc-200'>{t('eventDialogs.title')}</label>
          <Input
            id='event-title'
            required
            placeholder={t('eventDialogs.title')}
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className='flex-1 rounded-none border border-zinc-300 dark:border-zinc-700'
            style={{ borderRadius: 0 }}
          />
        </div>
        <div className='flex items-center gap-4'>
          <label htmlFor='event-description' className='w-28 text-sm font-medium text-zinc-700 dark:text-zinc-200'>{t('eventDialogs.description')}</label>
          <Input
            id='event-description'
            required
            placeholder={t('eventDialogs.description')}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className='flex-1 rounded-none border border-zinc-300 dark:border-zinc-700'
            style={{ borderRadius: 0 }}
          />
        </div>
        <div className='flex gap-2 mt-2 justify-end'>
          <button
            type='button'
            className='px-4 py-2 font-bold transition-colors border-0 rounded-none bg-zinc-50 text-zinc-800 hover:bg-zinc-200/80 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-700'
            style={{ borderRadius: 0 }}
            onClick={() => onOpenChange(false)}
          >
            {t('eventDialogs.cancel')}
          </button>
          <button
            type='submit'
            className='px-4 py-2 font-bold transition-colors shadow border-0 rounded-none bg-zinc-950 text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
            style={{ borderRadius: 0 }}
            disabled={isPending}
          >
            {isPending ? t('eventDialogs.creating') : t('eventDialogs.create')}
          </button>
        </div>
        {isError && (
          <div className='text-red-500 text-xs mt-1'>{t('eventDialogs.errorCreatingEvent')}</div>
        )}
      </form>
    </DialogContent>
  </Dialog>
  );
};
