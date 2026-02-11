import React, { useState } from "react";
import { SquarePen, Trash2 } from "lucide-react";

function ViewOnlyTable({
  title,
  data,
  nameLabel,
  fieldLabel = "Sex", // Column label
  fieldKey = "sex",    // Key in data object
  editable = false,
  onEdit,
  onDelete,
}) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [editName, setEditName] = useState("");
  const [editField, setEditField] = useState("");

  if (!data || data.length === 0) {
    return (
      <h1 className="text-4xl font-bold text-gray-300 mt-20 text-center">
        No {title}
      </h1>
    );
  }

  /* -------------------- HANDLERS -------------------- */
  const openEditModal = (item) => {
    setSelectedItem(item);
    setEditName(item.name);
    setEditField(item[fieldKey] || "");
    setIsEditOpen(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleConfirmEdit = () => {
    onEdit?.({
      ...selectedItem,
      name: editName,
      [fieldKey]: editField,
    });
    setIsEditOpen(false);
    setSelectedItem(null);
  };

  const handleConfirmDelete = () => {
    onDelete?.(selectedItem);
    setIsDeleteOpen(false);
    setSelectedItem(null);
  };

  return (
    <>
      <div className="w-full px-6">
        <div className="mb-8">
          {/* TITLE ROW */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-700">{title}</h2>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-sm text-gray-500">
                  <th className="text-left py-3 w-20">No.</th>
                  <th className="text-left py-3 w-64">{nameLabel}</th>
                  <th className="text-left py-3 w-32">{fieldLabel}</th>
                  <th className="text-center py-3 w-32">Actions</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 last:border-b-0"
                  >
                    <td className="py-4 text-sm text-gray-600">{index + 1}</td>
                    <td className="py-4 text-sm text-gray-700">{item.name}</td>
                    <td className="py-4 text-sm text-gray-600">{item[fieldKey]}</td>
                    <td className="py-4 text-center">
                      {editable ? (
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() => openEditModal(item)}
                            className="text-gray-500 hover:text-blue-600 transition"
                            title="Edit"
                          >
                            <SquarePen size={16} />
                          </button>

                          <button
                            onClick={() => openDeleteModal(item)}
                            className="text-gray-500 hover:text-red-600 transition"
                            title="Delete"
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
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-6 text-center">
              Edit {title.slice(0, -1)}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Name</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full mt-1 rounded-full border px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#FA824C]"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">{fieldLabel}</label>
                <input
                  value={editField}
                  onChange={(e) => setEditField(e.target.value)}
                  className="w-full mt-1 rounded-full border px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#FA824C]"
                />
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-6 py-2 rounded-full border border-orange-400 text-orange-500"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEdit}
                className="px-6 py-2 rounded-full bg-[#FA824C] text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Delete {title.slice(0, -1)}
            </h2>

            <p className="text-center text-gray-500 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-700">{selectedItem?.name}</span>?
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
