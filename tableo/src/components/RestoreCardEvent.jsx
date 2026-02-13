import React from "react";
import { FiRotateCcw } from "react-icons/fi";

function RestoreCardEvent({
    title,
    description,
    date,
    location,
    children,
    onRestore,
}) {
    return (
        <div
            className="relative w-full h-full min-h-[420px] sm:min-h-[450px] md:min-h-[480px] rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition flex flex-col cursor-pointer opacity-90 grayscale"
        >
            {/* ACTION BUTTON */}
            <div className="absolute top-4 right-4 z-20">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRestore?.();
                    }}
                    className="p-2 rounded-full bg-black/50 text-white hover:bg-green-600 transition"
                    title="Restore Event"
                >
                    <FiRotateCcw size={16} />
                </button>
            </div>

            {/* IMAGE */}
            <div className="absolute inset-0 w-full h-full">
                <div className="w-full h-full">
                    {children && React.isValidElement(children) ? (
                        React.cloneElement(children, {
                            className: `${children.props.className ?? ""} w-full h-full object-cover`,
                        })
                    ) : (
                        <img
                            src={`${import.meta.env.VITE_ASSET_URL}/uploads/images/default_event_img.jpg`}
                            alt="Default Event"
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>

            {/* CONTENT */}
            <div className="absolute bottom-0 p-5 text-white">
                <h2 className="text-xl font-bold mb-2">{title}</h2>

                <p className="text-sm text-gray-200 mb-3 line-clamp-4">
                    {description}
                </p>

                <div className="text-xs space-y-1">
                    <p>
                        <span className="font-semibold">Date:</span> {date}
                    </p>
                    <p>
                        <span className="font-semibold">Location:</span> {location}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RestoreCardEvent;
