function CategoryCard({ categories, openCriteriaId, setOpenCriteriaId }) {
  if (!categories || categories.length === 0) {
    return (
      <h1 className="text-4xl font-bold text-gray-300 mt-20 text-center">
        Create Category
      </h1>
    );
  }

  return (
    <div className="w-full">
      {categories.map((cat) => {
        const judges = cat.judges || [];
        const contestants = cat.contestants || [];

        return (
          <div key={cat.id} className="mb-8">

            {/* CATEGORY TITLE ROW */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-700">
                {cat.name || "Category Name"}
              </h2>

              {/* CRITERIA */}
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenCriteriaId(
                      openCriteriaId === cat.id ? null : cat.id
                    )
                  }
                  className="text-sm text-gray-600 hover:text-black"
                >
                  Criteria ▾
                </button>

                {openCriteriaId === cat.id && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 p-3 text-xs z-20">
                    {cat.criteria?.length ? (
                      cat.criteria.map((c, i) => (
                        <div
                          key={i}
                          className="flex justify-between py-1"
                        >
                          <span>{c.name}</span>
                          <span>{c.weight}%</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-center">
                        No criteria added
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-sm text-gray-500">
                    <th className="text-left py-3 w-64">
                      Contestant
                    </th>

                    {judges.length ? (
                      judges.map((judge) => (
                        <th
                          key={judge.id}
                          className="text-center py-3"
                        >
                          {judge.name}
                        </th>
                      ))
                    ) : (
                      <th
                        className="text-center text-gray-300"
                        colSpan={5}
                      >
                        Judges will appear here
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {contestants.length ? (
                    contestants.map((contestant) => (
                      <tr
                        key={contestant.id}
                        className="border-b last:border-b-0"
                      >
                        <td className="py-4 text-sm text-gray-700">
                          {contestant.name}
                        </td>

                        {judges.map((judge) => (
                          <td
                            key={judge.id}
                            className="py-4 text-center"
                          >
                            {/* SCORE PLACEHOLDER */}
                            <div className="w-6 h-6 mx-auto bg-gray-200" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={judges.length + 1}
                        className="py-6 text-sm text-gray-400 border-b"
                      >
                        Contestants will appear here
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        );
      })}
    </div>
  );
}

export default CategoryCard;
