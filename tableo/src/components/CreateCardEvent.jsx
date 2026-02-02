import React from "react";

function CreateCardEvent({ title, description, date, location, children }) {
  return (
    <div className="relative w-full h-full min-h-[360px] rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition flex flex-col">
      
      {/* IMAGE / MEDIA SLOT */}
      <div className="absolute inset-0 w-full h-full">
        {/* Wrap children so it fills the card */}
        <div className="w-full h-full">
          {children && (
            <div className="w-full h-full">
              {React.isValidElement(children)
                ? React.cloneElement(children, {
                    className: `${
                      children.props.className ?? ""
                    } w-full h-full object-cover`,
                  })
                : children}
            </div>
          )}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* CONTENT */}
      <div className="absolute bottom-0 p-5 text-white">
        <h2 className="text-xl font-bold mb-1">{title}</h2>

        <p className="text-sm text-gray-200 mb-3 line-clamp-3">
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

export default CreateCardEvent;
