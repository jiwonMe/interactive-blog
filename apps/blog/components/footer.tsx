import { cn } from "../lib/utils";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/jiwonMe",
      icon: (
        <svg
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      ),
    },
    {
      name: "Email",
      href: "mailto:hello@jiwon.me",
      icon: (
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
  ];

  return (
    <footer
      className={cn(
        /* Border & Spacing */
        "border-t border-zinc-200",
        "py-12 mt-20",
        /* Dark Mode */
        "dark:border-zinc-800"
      )}
    >
      <div
        className={cn(
          /* Container */
          "max-w-6xl mx-auto",
          /* Spacing */
          "px-6",
          /* Layout - Mobile: column, Desktop: row */
          "flex flex-col md:flex-row",
          "justify-between items-center",
          "gap-8"
        )}
      >
        {/* Brand & Copyright Section */}
        <div
          className={cn(
            /* Layout */
            "flex flex-col",
            /* Alignment */
            "items-center md:items-start",
            /* Spacing */
            "gap-2",
            /* Typography */
            "text-center md:text-left"
          )}
        >
          <span
            className={cn(
              /* Typography */
              "font-bold text-base",
              "tracking-[0.5em]",
              /* Colors */
              "text-zinc-800",
              /* Dark Mode */
              "dark:text-zinc-100"
            )}
          >
            PWNZ INTERACTIVES
          </span>
          <span
            className={cn(
              /* Typography */
              "text-sm",
              /* Colors */
              "text-zinc-500",
              /* Dark Mode */
              "dark:text-zinc-400"
            )}
          >
            © {currentYear} All rights reserved.
          </span>
        </div>

        {/* Social Links Section */}
        <div
          className={cn(
            /* Layout */
            "flex items-center",
            /* Spacing */
            "gap-6"
          )}
        >
          {socialLinks.map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                /* Layout */
                "flex items-center gap-2",
                /* Typography */
                "text-sm font-medium",
                /* Colors & Transitions */
                "text-zinc-600",
                "transition-colors duration-200",
                /* Hover States */
                "hover:text-zinc-900",
                /* Dark Mode */
                "dark:text-zinc-400",
                "dark:hover:text-zinc-100"
              )}
              aria-label={link.name}
            >
              {link.icon}
              <span
                className={cn(
                  /* Display */
                  "hidden sm:inline"
                )}
              >
                {link.name}
              </span>
            </a>
          ))}
        </div>

        {/* Additional Info Section */}
        <div
          className={cn(
            /* Layout */
            "flex flex-col",
            /* Alignment */
            "items-center md:items-end",
            /* Spacing */
            "gap-1",
            /* Typography */
            "text-xs text-center md:text-right",
            /* Colors */
            "text-zinc-400",
            /* Dark Mode */
            "dark:text-zinc-500"
          )}
        >
          <span>Built with Next.js</span>
          <span>Powered by Vercel</span>
        </div>
      </div>
    </footer>
  );
}

