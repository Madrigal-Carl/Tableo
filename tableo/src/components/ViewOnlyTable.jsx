import React, { useState } from "react";
import { SquarePen, Trash2, Plus } from "lucide-react";
import EditModal from "./EditModal";

function ViewOnlyTable({
  title,
  data,
  nameLabel = "Name",
  fieldLabel = "Sex",
  fieldKey = "sex",
  editable = false,
  onEdit,
  onDelete,
  onAdd, // optional add button callback
  isJudge = false,
}) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (!data || data.length === 0) {
    return (
      <h1 className="text-4xl font-bold text-gray-300 mt-20 text-center">
        No {title}
      </h1>
    );
  }

  const openEditModal = (item) => {
    setSelectedItem({ ...item });
    setIsEditOpen(true);
  };

  const handleConfirmEdit = (updatedItem) => {
    onEdit?.(updatedItem);
  };

  const handleConfirmDelete = () => {
    onDelete?.(selectedItem);
    setIsDeleteOpen(false);
    setSelectedItem(null);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-separate border-spacing-y-2 table-fixed">
            {/* HEADER */}
            <thead>
              <tr className="text-xs uppercase tracking-wider text-gray-400">
                {isJudge && (
                  <>
                    <th className="px-4 py-3 w-1/4 text-center">Judge Code</th>
                    <th className="px-4 py-3 w-1/4 text-center">Suffix</th>
                  </>
                )}
                {!isJudge && (
                  <th className="px-4 py-3 w-1/4 text-center">
                    Participant No.
                  </th>
                )}
                <th className="px-4 py-3 w-1/4 text-center">{nameLabel}</th>
                {!isJudge && fieldKey && (
                  <th className="px-4 py-3 w-1/4 text-center">{fieldLabel}</th>
                )}
                <th className="px-4 py-3 w-1/4 text-center">Actions</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={item.id}
                  className="bg-gray-50 hover:bg-gray-100 transition shadow-sm"
                >
                  {/* Judge columns */}
                  {isJudge && (
                    <>
                      <td className="px-4 py-4 text-center font-medium text-gray-600">
                        JDG-{String(index + 1).padStart(3, "0")}
                      </td>
                      <td className="px-4 py-4 text-center text-gray-600">
                        {item.suffix}
                      </td>
                    </>
                  )}

                  {/* Participant number */}
                  {!isJudge && (
                    <td className="px-4 py-4 text-center font-medium text-gray-600">
                      {index + 1}
                    </td>
                  )}

                  {/* Name with avatar for participants */}
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      {!isJudge && (
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-sm font-semibold text-gray-600">
                          {item.photo || item.avatar ? (
                            <img
                              src={item.photo || item.avatar}
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
                      )}
                      <p className="font-semibold text-gray-800">
                        {item.suffix ? `${item.suffix}. ` : ""}
                        {item.name}
                      </p>
                    </div>
                  </td>

                  {/* Sex column for participants */}
                  {!isJudge && fieldKey && (
                    <td className="px-4 py-4 text-center text-gray-600">
                      {item[fieldKey]}
                    </td>
                  )}

                  {/* Actions */}
                  <td className="px-4 py-4 text-center">
                    {editable ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition"
                        >
                          <SquarePen size={16} />
                        </button>
                        <button
                          onClick={() => onDelete?.(item)}
                          className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
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

              {/* ADD BUTTON ROW */}
              {onAdd && (
                <tr className="bg-gray-100 hover:bg-gray-200 cursor-pointer transition">
                  <td
                    colSpan={isJudge ? data.length + 2 : fieldKey ? 4 : 3}
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
      </div>

      {/* EDIT MODAL */}
      <EditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleConfirmEdit}
        item={selectedItem}
        isParticipant={!isJudge} // Pass true for participants
      />
    </>
  );
}

export default ViewOnlyTable;
