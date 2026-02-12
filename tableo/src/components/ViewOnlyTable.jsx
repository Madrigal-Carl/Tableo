import React, { useState } from "react";
import { SquarePen, Trash2, Settings } from "lucide-react";
import EditModal from "./EditModal";

function ViewOnlyTable({
  title,
  data,
  nameLabel,
  fieldLabel = "Sex",
  fieldKey = "sex",
  editable = false,
  onEdit,
  onDelete,
  isJudge = false, // <-- ADD THIS
}) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (!data || data.length === 0) {
    return (
      <h1 className="text-4xl font-bold text-gray-300 mt-20 text-center">
        No {title}
      </h1>
    );
  }

  /* ================== HANDLERS ================== */

  const openEditModal = (item) => {
    setSelectedItem({ ...item });
    setIsEditOpen(true);
  };


  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleConfirmEdit = (updatedItem) => {
    onEdit?.(updatedItem);
  };

  const handleConfirmDelete = () => {
    onDelete?.(selectedItem);
    setIsDeleteOpen(false);
    setSelectedItem(null);
  };

  /* ================== JUDGE CODE GENERATOR ================== */
  const generateJudgeCode = (index) => {
    return `JDG-${String(index + 1).padStart(3, "0")}`;
  };

  return (
    <>
      <div className="w-full px-6">
        <div className="mb-8">

          {/* TITLE */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-700">{title}</h2>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-sm text-gray-500">

                  {/* PARTICIPANT NUMBER */}
                  {!isJudge && (
                    <th className="text-left py-3 w-24">No.</th>
                  )}

                  {/* JUDGE CODE + NUMBER */}
                  {isJudge && (
                    <>
                      <th className="text-left py-3 w-32">Judge Code</th>
                      <th className="text-left py-3 w-24">Judge No.</th>
                    </>
                  )}

                  <th className="text-left py-3 w-64">{nameLabel}</th>
                  {fieldKey && (
                    <th className="text-left py-3 w-32">{fieldLabel}</th>
                  )}

                  <th className="text-center py-3 w-32">Actions</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 last:border-b-0"
                  >

                    {/* PARTICIPANT NUMBER */}
                    {!isJudge && (
                      <td className="py-4 text-sm text-gray-600">
                        {index + 1}
                      </td>
                    )}

                    {/* JUDGE CODE + NUMBER */}
                    {isJudge && (
                      <>
                        <td className="py-4 text-sm text-gray-600">
                          {`JDG-${String(index + 1).padStart(3, "0")}`}
                        </td>

                        <td className="py-4 text-sm text-gray-600">
                          {index + 1}
                        </td>
                      </>
                    )}

                    {/* SUFFIX + NAME */}
                    <td className="py-4 text-sm text-gray-700">
                      {item.suffix ? `${item.suffix}. ` : ""}
                      {item.name}
                    </td>

                    {/* OTHER FIELD */}
                    {fieldKey && (
                      <td className="py-4 text-sm text-gray-600">
                        {item[fieldKey]}
                      </td>
                    )}

                    {/* ACTIONS */}
                    <td className="py-4 text-center">
                      {editable ? (
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() => openEditModal(item)}
                            className="text-gray-500 hover:text-blue-600 transition"
                          >
                            <SquarePen size={16} />
                          </button>

                          <button
                            onClick={() => openDeleteModal(item)}
                            className="text-gray-500 hover:text-red-600 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-300">View only</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= EDIT MODAL ================= */}
      <EditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleConfirmEdit}
        title={title.slice(0, -1)}
        item={selectedItem}
        fieldLabel={fieldLabel}
        fieldKey={fieldKey}
      />

      {/* ================= DELETE MODAL ================= */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Delete {title.slice(0, -1)}
            </h2>

            <p className="text-center text-gray-500 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-700">
                {selectedItem?.name}
              </span>
              ?
            </p>

            <div className="flex justify-between">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-6 py-2 rounded-full border border-gray-300 text-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                className="px-6 py-2 rounded-full bg-red-500 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ViewOnlyTable;
