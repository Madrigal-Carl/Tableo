import React, { useState, useMemo } from "react";
import { SquarePen, Trash2, Plus } from "lucide-react";
import EditModal from "./EditModal";

function ViewOnlyTable({
  title,
  data,
  nameLabel = "Name",
  fieldLabel = "Sex",
  fieldKey = "sex",
  editable = false,
  canEdit = true,
  onEdit,
  onDelete,
  onAdd,
  isJudge = false,
}) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [sexFilter, setSexFilter] = useState("ALL");

  /* ===================================================== */
  /* ============== TOTAL + AVERAGE + RANK ================ */
  /* ===================================================== */

  const filteredData = useMemo(() => {
    if (!data) return [];

    let base = isJudge
      ? [...data]
      : sexFilter === "ALL"
        ? [...data]
        : data.filter(
          (c) => c.sex?.toLowerCase() === sexFilter.toLowerCase()
        );

    /* Sort by sequence first */
    base.sort((a, b) => {
      if (a.sequence == null && b.sequence != null) return 1;
      if (a.sequence != null && b.sequence == null) return -1;
      if (a.sequence != null && b.sequence != null)
        return a.sequence - b.sequence;
      return 0;
    });

    /* ✅ Compute Total + Average */
    base = base.map((item) => {
      const total =
        Number(item.total) ||
        Number(item.score) ||
        Number(item.scores) ||
        0;

      const judgeCount = Number(item.judgeCount) || 1;

      const average =
        judgeCount > 0 ? (total / judgeCount).toFixed(2) : 0;

      return {
        ...item,
        total,
        average: Number(average),
      };
    });

    /* ✅ Sort by Highest Total */
    base.sort((a, b) => b.total - a.total);

    /* ✅ Assign Ranking (Tie Safe) */
    let rank = 1;
    for (let i = 0; i < base.length; i++) {
      if (i > 0 && base[i].total < base[i - 1].total) {
        rank = i + 1;
      }
      base[i].rank = rank;
    }

    return base;
  }, [data, sexFilter, isJudge]);

  const openEditModal = (item) => {
    setSelectedItem({ ...item });
    setIsEditOpen(true);
  };

  const handleConfirmEdit = (updatedItem) => {
    if (updatedItem.photo instanceof File) {
      const formData = new FormData();
      formData.append("name", updatedItem.name);
      formData.append("sex", updatedItem.sex || "");

      if (updatedItem.photo) {
        formData.append("image", updatedItem.photo);
      }

      onEdit?.({ id: updatedItem.id, formData, isFile: true });
    } else {
      onEdit?.(updatedItem);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {title}
          </h2>

          {!isJudge && (
            <div className="flex items-center gap-3">
              <label className="text-gray-600 font-medium">
                Filter by Sex:
              </label>
              <select
                value={sexFilter}
                onChange={(e) => setSexFilter(e.target.value)}
                className="px-4 py-2 rounded-md focus:ring-2 focus:ring-orange-400"
              >
                <option value="ALL">All</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
          )}
        </div>

        {/* TABLE */}
        {filteredData.length === 0 ? (
          <h1 className="text-4xl font-bold text-gray-300 mt-20 text-center">
            No {title}
          </h1>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-max text-sm border-separate border-spacing-y-2 table-fixed">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-gray-400">
                  {isJudge ? (
                    <>
                      <th className="px-4 py-3 text-center">
                        Judge Code
                      </th>
                      <th className="px-4 py-3 text-center">
                        {nameLabel}
                      </th>
                      <th className="px-4 py-3 text-center">Suffix</th>

                      {/* ✅ TOTAL + AVERAGE + RANK */}
                      <th className="px-4 py-3 text-center font-bold text-blue-600">
                        Total
                      </th>
                      <th className="px-4 py-3 text-center font-bold text-purple-600">
                        Avg
                      </th>
                      <th className="px-4 py-3 text-center font-bold text-green-600">
                        Rank
                      </th>

                      <th className="px-4 py-3 text-center">
                        Actions
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3 text-center">
                        Participant No.
                      </th>
                      <th className="px-4 py-3 text-center">
                        {nameLabel}
                      </th>

                      {fieldKey && (
                        <th className="px-4 py-3 text-center">
                          {fieldLabel}
                        </th>
                      )}

                      {/* ✅ TOTAL + AVERAGE + RANK */}
                      <th className="px-4 py-3 text-center font-bold text-blue-600">
                        Total
                      </th>
                      <th className="px-4 py-3 text-center font-bold text-purple-600">
                        Avg
                      </th>
                      <th className="px-4 py-3 text-center font-bold text-green-600">
                        Rank
                      </th>

                      <th className="px-4 py-3 text-center">
                        Actions
                      </th>
                    </>
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="bg-gray-50 hover:bg-gray-100 transition shadow-sm rounded-xl"
                  >
                    {/* LEFT SIDE */}
                    {isJudge ? (
                      <>
                        <td className="px-4 py-4 text-center">
                          {item.invitationCode}
                        </td>
                        <td className="px-4 py-4 text-center font-semibold">
                          {item.name}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {item.suffix || "-"}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-4 text-center">
                          {item.sequence ?? "-"}
                        </td>

                        <td className="px-4 py-4 text-center font-semibold">
                          {item.name}
                        </td>

                        {fieldKey && (
                          <td className="px-4 py-4 text-center capitalize">
                            {item[fieldKey] || "-"}
                          </td>
                        )}
                      </>
                    )}

                    {/* ✅ TOTAL */}
                    <td className="px-4 py-4 text-center font-bold text-blue-600">
                      {item.total ?? 0}
                    </td>

                    {/* ✅ AVERAGE */}
                    <td className="px-4 py-4 text-center font-bold text-purple-600">
                      {item.average ?? 0}
                    </td>

                    {/* ✅ RANK */}
                    <td className="px-4 py-4 text-center font-bold text-green-600">
                      {item.rank ?? "-"}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-4 text-center">
                      {editable ? (
                        <div className="flex justify-center gap-2">
                          {!isJudge && (
                            <button
                              onClick={() =>
                                canEdit && openEditModal(item)
                              }
                              disabled={!canEdit}
                              className="p-2 text-gray-500 hover:text-blue-600"
                            >
                              <SquarePen size={16} />
                            </button>
                          )}

                          <button
                            onClick={() =>
                              canEdit && onDelete?.(item)
                            }
                            disabled={!canEdit}
                            className="p-2 text-gray-500 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">
                          View only
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {/* ADD ROW */}
                {onAdd && (
                  <tr
                    className={`bg-gray-100 transition ${canEdit
                      ? "hover:bg-gray-200 cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                      }`}
                    onClick={() => canEdit && onAdd()}
                  >
                    <td
                      colSpan={
                        isJudge ? 7 : fieldKey ? 7 : 6
                      }
                      className="px-4 py-4 text-center text-blue-600 font-semibold"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Plus size={16} />
                        Add {title.slice(0, -1)}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      <EditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleConfirmEdit}
        item={selectedItem}
        isParticipant={!isJudge}
      />
    </>
  );
}

export default ViewOnlyTable;