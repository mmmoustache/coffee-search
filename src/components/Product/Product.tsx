import { Product as Props } from '@/types/product';
import { ProductTitle } from '@/components/ProductTitle/ProductTitle';
import { Scale } from '@/components/Scale/Scale';
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
}: Readonly<Props>) {
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

  return (
    <div className="product | grid p-12 gap-30">
      <div>
        <img
          src="/pack.png"
          alt=""
          className="product__image"
        />
      </div>
      <div className="flex flex-col gap-6">
        {category && <p className="font-body uppercase text-right">{category}</p>}
        <ProductTitle>{name}</ProductTitle>
        {description && <p className="font-body">{description}</p>}

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
          <div className="flex gap-4">
            {roast_level && (
              <div className="flex flex-col gap-1 w-1/2">
                <h2 className="font-title">Roast Level</h2>
                <Scale value={roast_level} />
              </div>
            )}
            {origin && origin.length > 0 ? (
              <div className="flex flex-col gap-1 w-1/2">
                <h2 className="font-title">Origin</h2>
                <p className="font-body">{origin.join(', ')}</p>
              </div>
            ) : null}
          </div>
        ) : null}

        {tasting_notes && recommended_for ? (
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-1/2">
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
            <div className="flex flex-col gap-1 w-1/2">
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
      </div>
    </div>
  );
}
