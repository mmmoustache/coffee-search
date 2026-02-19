export function Header() {
  return (
    <header className="header | px-3 lg:px-5 py-3">
      <nav>
        <ul className="header__items | grid grid-cols-(--nav-row)">
          <li className="flex justify-start items-center">
            <a
              href="/"
              className="hover:opacity-50 focusable"
              title="New search"
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
              Coffee
              <svg
                className="icon"
                width="1.25em"
                height="1.25em"
                fill="currentColor"
                aria-hidden
              >
                <use xlinkHref={`/icons/icons.svg#cup-hot`} />
              </svg>
              finder
            </a>
          </li>
          <li className="flex justify-end items-center">
            <a
              href="https://github.com"
              className="hover:opacity-50 focusable"
              rel="noopener noreferrer"
              target="_blank"
              title="View project on GitHub"
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
