export function Footer() {
  return (
    <footer className="text-center p-6 font-body text-black flex flex-col gap-4">
      <svg
        className="icon | mx-auto"
        width="1.25em"
        height="1.25em"
        fill="currentColor"
      >
        <use xlinkHref="/icons/icons.svg#backpack" />
      </svg>

      <div>
        <p>Built with love. All rights reserved.</p>
        <p>
          <a
            href="#back-to-top"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Source code
          </a>
        </p>
      </div>
    </footer>
  );
}
