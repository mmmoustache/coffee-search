type Props = {
  showBackButton?: boolean;
};

export function Header({ showBackButton = false }: Readonly<Props>) {
  return (
    <header className="header | px-5 py-3">
      <nav>
        <ul className="header__items | grid grid-cols-(--nav-row)">
          {showBackButton ? (
            <li className="flex justify-start items-center">
              <a
                href="/"
                className="hover:opacity-50 focusable"
              >
                <svg
                  className="icon"
                  width="1.25em"
                  height="1.25em"
                  fill="currentColor"
                >
                  <use xlinkHref={`/icons/icons.svg#arrow-left`} />
                </svg>
              </a>
            </li>
          ) : (
            <li aria-hidden></li>
          )}
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
              >
                <use xlinkHref={`/icons/icons.svg#cup-hot`} />
              </svg>
              finder!
            </a>
          </li>
          <li className="flex justify-end items-center">
            <a
              href="https://github.com"
              className="hover:opacity-50 focusable"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                className="icon"
                width="1.25em"
                height="1.25em"
                fill="currentColor"
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
