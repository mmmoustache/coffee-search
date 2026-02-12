'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';
import { Button } from '../Button/Button';
import './QueryForm.css';

const QueryFormSchema = z.object({
  query: z.string().min(0),
});

export type QueryFormSchemaType = z.infer<typeof QueryFormSchema>;
export type QueryFormResult = {
  query: string;
};

type QueryFormProps = {
  onSubmit: SubmitHandler<QueryFormSchemaType>;
  isLoading: boolean;
};

export function QueryForm({ onSubmit, isLoading }: Readonly<QueryFormProps>) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<QueryFormSchemaType>({
    resolver: zodResolver(QueryFormSchema),
    defaultValues: {
      query: '',
    },
    mode: 'onChange',
  });

  const submitHandler = (data: { query: string }) => {
    if (isLoading) return;
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="query-form | relative overflow-hidden rounded-4xl border-white border-1 max-w-[320px] w-full"
      data-is-loading={isLoading}
    >
      <div className="query-form__content | relative z-10 gap-2 flex justify-between p-5">
        <Controller
          name="query"
          control={control}
          disabled={isLoading}
          render={({ field }) => (
            <textarea
              {...field}
              placeholder="Describe your perfect coffee"
              data-valid={errors?.query ? 'false' : 'true'}
              value={field.value}
              className="query-form__input"
            />
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="query-form__button | cursor-pointer"
          icon="search"
          iconOnly
        >
          Submit search
        </Button>
      </div>
    </form>
  );
}
