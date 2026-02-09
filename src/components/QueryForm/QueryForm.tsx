'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';
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
      className="query-form | relative overflow-hidden p-5 rounded-4xl"
      data-is-loading={isLoading}
    >
      <div className="relative z-10">
        <Controller
          name="query"
          control={control}
          disabled={isLoading}
          render={({ field }) => (
            <input
              {...field}
              placeholder="What coffee do you like?"
              data-valid={errors?.query ? 'false' : 'true'}
              type="text"
              value={field.value}
              className="query-form__input"
            />
          )}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="query-form__button"
        >
          Submit
        </button>

        <button
          type="button"
          onClick={() => onSubmit()}
        >
          Close
        </button>
      </div>
    </form>
  );
}
