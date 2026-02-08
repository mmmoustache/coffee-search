"use client";

import z from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const QueryFormSchema = z.object({
  query: z.string().min(0),
});

export type QueryFormSchemaType = z.infer<typeof QueryFormSchema>;
export type QueryFormResult = {
  query: string;
};

type QueryFormProps = {
  onSubmit: SubmitHandler<QueryFormSchemaType>;
};

export function QueryFormComponent({ onSubmit }: Readonly<QueryFormProps>) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<QueryFormSchemaType>({
    resolver: zodResolver(QueryFormSchema),
    defaultValues: {
      query: "",
    },
    mode: "onChange",
  });

  const submitHandler = (data: { query: string }) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <Controller
        name="query"
        control={control}
        render={({ field }) => (
          <input
            {...field}
            placeholder="What coffee do you like?"
            data-valid={errors?.query ? "false" : "true"}
            type="text"
            value={field.value}
          />
        )}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
