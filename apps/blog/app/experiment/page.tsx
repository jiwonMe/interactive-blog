import Link from "next/link";
import { experiments } from "./registry";

export default function ExperimentsIndex() {
  return (
    <div className="w-full max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">컴포넌트 실험실</h1>
        <p className="text-gray-600 text-lg">
          인터랙티브 컴포넌트를 테스트하고 시연하는 격리된 환경입니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiments.map((exp) => (
          <Link
            key={exp.slug}
            href={`/experiment/${exp.slug}`}
            className="group block bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-500 transition-all"
          >
            <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
              {exp.title}
            </h2>
            <p className="text-gray-500 text-sm">{exp.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
