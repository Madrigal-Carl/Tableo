function CategoryCard({ categories, openCriteriaId, setOpenCriteriaId }) {
  if (!categories || categories.length === 0) {
    return (
      <h1 className="text-4xl font-bold text-gray-300 mb-8">
        Create Category
      </h1>
    );
  }

  return (
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full h-[700px] overflow-y-auto">
      {categories.map(cat => {
        const judges = cat.judges || [];
        const contestants = cat.contestants || [];

        return (
          <div key={cat.id} className="mb-8">

            {/* CATEGORY HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                {cat.name || "Category Name"}
              </h2>

              {/* CRITERIA DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenCriteriaId(openCriteriaId === cat.id ? null : cat.id)
                  }
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 bg-white shadow-sm"
                >
                  Criteria ▾
                </button>

                {openCriteriaId === cat.id && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg p-3 text-sm z-20">
                    {cat.criteria && cat.criteria.length > 0 ? (
                      cat.criteria.map((c, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span>{c.name}</span>
                          <span>{c.weight}%</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 text-center">
                        No criteria added
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* TABLE */}
              <table className="w-full table-fixed border-separate border-spacing-y-2"> 
              <thead>
                <tr className="text-sm text-gray-500">
                  <th className="text-left px-4 w-64">Contestant</th>

                  {judges.length > 0
                    ? judges.map(judge => (
                        <th key={judge.id} className="text-center">
                          {judge.name}
                        </th>
                      ))
                    : (
                      <th className="text-center text-gray-300" colSpan={4}>
                        Judges will appear here
                      </th>
                    )
                  }
                </tr>
              </thead>

              <tbody>
                {contestants.length > 0 ? (
                  contestants.map(contestant => (
                    <tr key={contestant.id} className="bg-gray-50">
                      <td className="px-4 py-3">
                        {contestant.name}
                      </td>

                      {judges.map(judge => (
                        <td key={judge.id} className="text-center">
                          <div className="w-6 h-6 mx-auto bg-gray-200 rounded" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr className="bg-gray-50">
                    <td className="px-4 py-6 text-gray-400" colSpan={judges.length + 1}>
                      Contestants will appear here
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>
        );
      })}
    </div>
  );
}

export default CategoryCard;
