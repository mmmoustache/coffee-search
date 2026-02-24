import { GITHUB_LINK_LABEL, GITHUB_URL, SITE_LOGO } from '@/consts/label';
import Link from 'next/link';
import { interpolate } from '@/utils/interpolate';

export function Header() {
  const title = interpolate(SITE_LOGO, {
    icon: (
      <svg
        className="icon"
        width="1.25em"
        height="1.25em"
        fill="currentColor"
        aria-hidden
        key="icon"
      >
        <use xlinkHref={`/icons/icons.svg#cup-hot`} />
      </svg>
    ),
  });

  return (
    <header className="header | px-3 lg:px-5 py-3">
      <nav>
        <ul className="header__items | grid grid-cols-(--nav-row)">
          <li className="flex justify-start items-center">
            <Link
              href="/"
              className="hover:opacity-50 focusable"
              aria-label="New search"
            >
              <svg
                className="icon"
                width="1.25em"
                height="1.25em"
                fill="currentColor"
                aria-hidden
              >
                <use xlinkHref={`/icons/icons.svg#search`} />
              </svg>
            </Link>
          </li>
          <li className="text-center">
            <Link
              href="/"
              className="font-title focusable inline-flex gap-2 mx-auto hover:opacity-50"
            >
              {title}
            </Link>
          </li>
          <li className="flex justify-end items-center">
            <Link
              href={GITHUB_URL}
              className="hover:opacity-50 focusable"
              rel="noopener noreferrer"
              target="_blank"
              aria-label={GITHUB_LINK_LABEL}
            >
              <svg
                className="icon"
                width="1.25em"
                height="1.25em"
                fill="currentColor"
                aria-hidden
              >
                <use xlinkHref={`/icons/icons.svg#github`} />
              </svg>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
