import Link from "next/link";
import { experiments } from "./registry";
import { cn } from "../../lib/utils";

export default function ExperimentsIndex() {
  // Group experiments by category
  const groupedExperiments = experiments.reduce((acc, exp) => {
    const category = exp.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(exp);
    return acc;
  }, {} as Record<string, typeof experiments>);

  // Sort categories to ensure consistent order (General first, then alphabetical)
  const categories = Object.keys(groupedExperiments).sort((a, b) => {
    if (a === 'General') return -1;
    if (b === 'General') return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="w-full max-w-4xl">
      <div className="text-center mb-12">
        <h1 
          className={cn(
            "text-4xl font-bold mb-4",
            "text-gray-900 dark:text-gray-50"
          )}
        >
          컴포넌트 실험실
        </h1>
        <p 
          className={cn(
            "text-lg",
            "text-gray-600 dark:text-gray-300"
          )}
        >
          인터랙티브 컴포넌트를 테스트하고 시연하는 격리된 환경입니다.
        </p>
      </div>

      <div className="space-y-16">
        {categories.map((category) => (
          <section key={category}>
            <h2 
              className={cn(
                "text-2xl font-bold mb-6 pb-2",
                "text-gray-900 dark:text-gray-100",
                "border-b border-gray-200 dark:border-zinc-800"
              )}
            >
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedExperiments[category].map((exp) => (
                <Link
                  key={exp.slug}
                  href={`/experiment/${exp.slug}`}
                  className={cn(
                    "group block p-6 rounded-xl shadow-sm border transition-all",
                    "bg-white border-gray-200 hover:shadow-md hover:border-blue-500",
                    "dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-blue-400"
                  )}
                >
                  <h3 
                    className={cn(
                      "text-xl font-semibold mb-2",
                      "group-hover:text-blue-600 dark:group-hover:text-blue-400",
                      "text-gray-900 dark:text-gray-100"
                    )}
                  >
                    {exp.title}
                  </h3>
                  <p 
                    className={cn(
                      "text-sm",
                      "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    {exp.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
