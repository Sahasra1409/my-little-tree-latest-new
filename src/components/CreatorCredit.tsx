export default function CreatorCredit() {
  return (
    <footer className="creator-credit">
      <svg
        className="creator-credit__mark"
        viewBox="0 0 36 44"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <g className="creator-credit__sprig">
          <path
            d="M9 41C18 31 14 17 26 5M17 26C22 25 26 26 28 29"
            stroke="currentColor"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          <g fill="currentColor" fillOpacity="0.65">
            <path d="M23 10C17 8 16 13 18 17C21 15 23 13 23 10Z" />
            <path d="M21 14C28 12 29 18 27 22C24 20 22 18 21 14Z" />
            <path d="M18 20C11 17 10 23 12 27C15 25 18 23 18 20Z" />
            <path d="M16 29C9 25 7 30 8 35C12 33 15 32 16 29Z" />
            <path d="M15 32C20 31 24 35 22 39C19 38 16 35 15 32Z" />
          </g>
          <g className="creator-credit__little-note" transform="rotate(-9 28 33)">
            <path d="M28 27V30" stroke="currentColor" strokeWidth="0.6" />
            <rect x="25.5" y="30" width="5" height="8" rx="1.5" fill="currentColor" fillOpacity="0.75" />
            <path d="M25.5 33.5H30.5M29 30.5V37" stroke="#665b4b" strokeWidth="0.65" />
          </g>
        </g>
      </svg>
      <small>created by <span className="creator-credit__name">Sahasra</span></small>
    </footer>
  );
}