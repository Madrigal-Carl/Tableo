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

  const filteredData = useMemo(() => {
    if (isJudge) return data; // no sex filter for judges

    const filtered =
      sexFilter === "ALL"
        ? data
        : data.filter((c) => c.sex?.toLowerCase() === sexFilter.toLowerCase());

    return filtered.sort((a, b) => {
      if (a.sequence == null && b.sequence != null) return 1;
      if (a.sequence != null && b.sequence == null) return -1;
      if (!a.sex && b.sex) return 1;
      if (a.sex && !b.sex) return -1;
      if (a.sequence != null && b.sequence != null)
        return a.sequence - b.sequence;
      return 0;
    });
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
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>

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
            <table className="min-w-full text-sm border-separate border-spacing-y-2 table-fixed">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-gray-400">
                  {isJudge ? (
                    <>
                      <th className="px-4 py-3 w-1/4 text-center">
                        Judge Code
                      </th>
                      <th className="px-4 py-3 w-1/4 text-center">
                        {nameLabel}
                      </th>
                      <th className="px-4 py-3 w-1/4 text-center">Suffix</th>
                      <th className="px-4 py-3 w-1/4 text-center">Actions</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3 w-1/4 text-center">
                        Participant No.
                      </th>
                      <th className="px-4 py-3 w-1/4 text-center">
                        {nameLabel}
                      </th>
                      {fieldKey && (
                        <th className="px-4 py-3 w-1/4 text-center">
                          {fieldLabel}
                        </th>
                      )}
                      <th className="px-4 py-3 w-1/4 text-center">Actions</th>
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
                    {isJudge ? (
                      <>
                        <td className="px-4 py-4 text-center font-medium text-gray-600">
                          {item.invitationCode}
                        </td>

                        {/* Judge Name */}
                        <td className="px-4 py-4 text-center font-semibold text-gray-800 capitalize">
                          {item.name}
                        </td>

                        {/* Suffix */}
                        <td className="px-4 py-4 text-center text-gray-600 capitalize">
                          {item.suffix}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-4 text-center font-medium text-gray-600">
                          {item.sequence != null ? item.sequence : "-"}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-sm font-semibold text-gray-600">
                              {item.path ? (
                                <img
                                  src={`${import.meta.env.VITE_ASSET_URL}/uploads/candidates/${item.path}`}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                item.name
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .slice(0, 2)
                                  .join("")
                                  .toUpperCase()
                              )}
                            </div>
                            <p className="font-semibold text-gray-800">
                              {item.name}
                            </p>
                          </div>
                        </td>
                        {fieldKey && (
                          <td className="px-4 py-4 text-center text-gray-600 capitalize">
                            {item[fieldKey] || "-"}
                          </td>
                        )}
                      </>
                    )}

                    {/* ACTIONS */}
                    <td className="px-4 py-4 text-center">
                      {editable ? (
                        <div className="flex justify-center gap-2">
                          {/* EDIT (Participants only) */}
                          {!isJudge && (
                            <button
                              onClick={() => canEdit && openEditModal(item)}
                              disabled={!canEdit}
                              className={`p-2 rounded-lg transition
            ${
              canEdit
                ? "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                : "text-gray-300 cursor-not-allowed"
            }`}
                            >
                              <SquarePen size={16} />
                            </button>
                          )}

                          {/* DELETE */}
                          <button
                            onClick={() => canEdit && onDelete?.(item)}
                            disabled={!canEdit}
                            className={`p-2 rounded-lg transition
          ${
            canEdit
              ? "text-gray-500 hover:text-red-600 hover:bg-red-50"
              : "text-gray-300 cursor-not-allowed"
          }`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">View only</span>
                      )}
                    </td>
                  </tr>
                ))}

                {/* ADD ROW */}
                {onAdd && (
                  <tr
                    className={`bg-gray-100 transition
      ${canEdit ? "hover:bg-gray-200 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                    onClick={() => canEdit && onAdd()}
                  >
                    <td
                      colSpan={isJudge ? 4 : fieldKey ? 4 : 3}
                      className="px-4 py-4 text-center text-blue-600 font-semibold"
                      onClick={onAdd}
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
