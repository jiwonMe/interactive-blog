import Link from "next/link";
import { experiments } from "./registry";
import { cn } from "../../lib/utils";

export default function ExperimentsIndex() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiments.map((exp) => (
          <Link
            key={exp.slug}
            href={`/experiment/${exp.slug}`}
            className={cn(
              "group block p-6 rounded-xl shadow-sm border transition-all",
              "bg-white border-gray-200 hover:shadow-md hover:border-blue-500",
              "dark:bg-slate-900 dark:border-slate-800 dark:hover:border-blue-400"
            )}
          >
            <h2 
              className={cn(
                "text-xl font-semibold mb-2",
                "group-hover:text-blue-600 dark:group-hover:text-blue-400",
                "text-gray-900 dark:text-gray-100"
              )}
            >
              {exp.title}
            </h2>
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
    </div>
  );
}
