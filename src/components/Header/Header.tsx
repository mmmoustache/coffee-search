import { GITHUB_LINK_LABEL, GITHUB_URL, SITE_LOGO } from '@/consts/label';
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
            <a
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
            </a>
          </li>
          <li className="text-center">
            <a
              href="/"
              className="font-title focusable inline-flex gap-2 mx-auto hover:opacity-50"
            >
              {title}
            </a>
          </li>
          <li className="flex justify-end items-center">
            <a
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
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
