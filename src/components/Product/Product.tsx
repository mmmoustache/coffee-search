import { PropsWithChildren } from 'react';
import { getTheme } from '@/utils/getTheme';
import { Product as Props } from '@/types/product';
import { Scale } from '@/components/Scale/Scale';
import { TextMarquee } from '@/components/TextMarquee/TextMarquee';
import './Product.css';

export function Product({
  body,
  sweetness,
  acidity,
  name,
  description,
  category,
  roast_level,
  origin,
  tasting_notes,
  recommended_for,
  sku,
  children,
}: PropsWithChildren<Props>) {
  const descriptors = [
    {
      label: 'Body',
      value: body,
    },
    {
      label: 'Sweetness',
      value: sweetness,
    },
    {
      label: 'Acidity',
      value: acidity,
    },
  ];

  const theme = getTheme(sku || '');

  return (
    <div
      className={`product | animate-fade-translate-in opacity-0 ${theme?.backgroundColor} mx-5 border-white`}
    >
      <div className="grid p-4 lg:p-12 gap-30 xl:grid-cols-(--product-grid-cols)">
        <figure className="hidden xl:block">
          <img
            src="/pack.webp"
            alt=""
            className="product__image"
          />
        </figure>
        <div className="flex flex-col gap-6">
          {category && <p className="font-body uppercase text-right">{category}</p>}
          <h1 className="font-heading">{name}</h1>
          {description && <p className="font-body">{description}</p>}

          <figure className="block xl:hidden mb-8 max-w-2xs mx-auto">
            <img
              src="/pack.webp"
              alt=""
              className="product__image"
            />
          </figure>

          <ul className="grid grid-flow-col border border-white">
            {descriptors?.map((descriptor) => (
              <li
                className="border border-white p-3"
                key={descriptor.label}
              >
                <h3 className="font-body">{descriptor.label}</h3>
                <p className="font-body font-bold">{descriptor.value}</p>
              </li>
            ))}
          </ul>

          {roast_level || origin ? (
            <div className="flex max-lg:flex-col gap-6">
              {roast_level && (
                <div className="flex flex-col gap-1 w-full">
                  <h2 className="font-title">Roast Level</h2>
                  <Scale value={roast_level} />
                </div>
              )}
              {origin && origin.length > 0 ? (
                <div className="flex flex-col gap-1 w-full">
                  <h2 className="font-title">Origin</h2>
                  <p className="font-body">{origin.join(', ')}</p>
                </div>
              ) : null}
            </div>
          ) : null}

          {tasting_notes && recommended_for ? (
            <div className="flex max-lg:flex-col gap-6">
              <div className="flex flex-col gap-1 lg:w-1/2">
                <h2 className="font-title">Tasting notes</h2>
                <ul className="list-disc pl-6">
                  {tasting_notes?.map((note: string) => (
                    <li
                      key={note}
                      className="font-body"
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-1 lg:w-1/2">
                <h2 className="font-title">Recommended for</h2>
                <ul className="list-disc pl-6">
                  {recommended_for?.map((item: string) => (
                    <li
                      key={item}
                      className="font-body"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          {children}
        </div>
      </div>
      <div className="my-8">
        <TextMarquee>{name}</TextMarquee>
      </div>
    </div>
  );
}
