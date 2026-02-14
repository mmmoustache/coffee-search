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
      className="query-form"
    >
      <div className="query-form__content | flex flex-col gap-4">
        <Controller
          name="query"
          control={control}
          disabled={isLoading}
          render={({ field }) => (
            <input
              type="text"
              {...field}
              placeholder="in your own words..."
              data-valid={errors?.query ? 'false' : 'true'}
              value={field.value}
              className="font-body focusable w-full border-b-2 p-4"
            />
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="query-form__button | cursor-pointer mx-auto"
          icon="search"
          aria-label="Submit search term"
        >
          Quench my thirst
        </Button>
      </div>
    </form>
  );
}
