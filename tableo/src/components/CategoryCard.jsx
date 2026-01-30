function CategoryCard({ categories, openCriteriaId, setOpenCriteriaId }) {
  if (categories.length === 0) {
    return (
        <h1 className="text-4xl font-bold text-gray-300 mb-8">
            Create Category
        </h1>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      {categories.map(cat => (
        <div key={cat.id} className="mb-8">

          {/* CATEGORY HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              {cat.name}
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
                  {cat.criteria.map((c, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span>{c.name}</span>
                      <span>{c.weight}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* TABLE */}
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-sm text-gray-500">
                <th className="text-left px-4">Contestant</th>
                <th className="text-center">Judge 1</th>
                <th className="text-center">Judge 2</th>
                <th className="text-center">Judge 3</th>
                <th className="text-center">Judge 4</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map(row => (
                <tr key={row} className="bg-gray-50">
                  <td className="px-4 py-3">Contestant {row}</td>
                  {[1, 2, 3, 4].map(col => (
                    <td key={col} className="text-center">
                      <div className="w-6 h-6 mx-auto bg-gray-200 rounded" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      ))}
    </div>
  );
}

export default CategoryCard;
