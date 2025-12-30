import Pencil from "../../../assets/icons/pencil.svg";
import PinIcon from "../../../assets/icons/pin-icon.svg";
import "animate.css";
import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function PinItem({ pin, index, isOwner, onUpdate }) {
  const { t } = useTranslation();

  const DefinitionInput = useRef(null);

  const [edit, setEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedDefinition, setEditedDefinition] = useState(pin.definition);

  useEffect(() => {
    setEditedDefinition(pin.definition);
  }, [pin.definition]);

  const toggleEdit = () => {
    if (!isOwner) return;

    if (!edit) {
      setEditedDefinition(pin.definition);
    }
    setEdit((prev) => !prev);
  };

  const cancelEdit = () => {
    setEditedDefinition(pin.definition);
    setEdit(false);
  };

  const saveChanges = async () => {
    if (!isOwner || isSaving) return;
    if (editedDefinition === pin.definition) {
      setEdit(false);
      return;
    }
    if (!editedDefinition.trim()) {

      return;
    }

    setIsSaving(true);
    try {

      await onUpdate(pin.id, editedDefinition.trim());
      setEdit(false);
    } catch (error) {

    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      saveChanges();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  return (
    <div
      className="w-full flex flex-row items-center justify-start flex-nowrap
        bg-studowhite min-h-[10vh] gap-4
        border-1 rounded-[30px]
        shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] p-5 backdrop-blur-xs
        dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
        border-[0.5px] border-solid dark:border-t-gray-500 dark:border-l-gray-500
        border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2] outline-0"
      data-index={index}
    >
      <div className="flex items-center justify-center min-w-10 h-10 rounded-full
        bg-studoblue text-white font-bold text-sm">
        {pin.number}
      </div>


      <div className="flex items-center min-h-[5vh]" style={{ flex: "1" }}>
        {!edit ? (
          <span className="break-words dark:text-white">{pin.definition}</span>
        ) : (
          <input
            type="text"
            required
            ref={DefinitionInput}
            value={editedDefinition}
            onChange={(e) => setEditedDefinition(e.target.value)}
            onKeyDown={handleKeyPress}
            autoComplete="off"
            placeholder={t("Edit the definition...")}
            autoFocus
            className="w-full p-2 pl-5 bg-studowhite rounded-4xl
              border-solid dark:border-t-gray-500 dark:border-l-gray-500 border-1
              border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2] outline-0
              dark:bg-gray-600 dark:text-white"
          />
        )}
      </div>

      {pin.imageTitle && (
        <div className="flex items-center gap-1 text-xs opacity-50 dark:text-gray-400"
             style={{ flex: "0 0 auto" }}>
          <span className="truncate max-w-20">{pin.imageTitle}</span>
        </div>
      )}

      <div className="flex flex-row gap-3 items-center" style={{ flex: "0 0 auto" }}>
        {isOwner && (
          <>
            {!edit ? (
              <img
                className="cursor-pointer h-5 dark:brightness-0 dark:invert opacity-60
                  hover:opacity-100 transition-opacity duration-200"
                src={Pencil}
                alt={t("Edit")}
                onClick={toggleEdit}
                title={t("Edit identify")}
              />
            ) : (
              <div className="flex flex-row gap-2">
                <button
                  onClick={saveChanges}
                  disabled={isSaving}
                  className={`px-3 py-1 rounded-full bg-green-500 hover:bg-green-600 
                    text-white text-sm font-medium transition-colors duration-200
                    ${isSaving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  title={t("Save changes")}
                >
                  {isSaving ? "..." : "✓"}
                </button>
                <button
                  onClick={cancelEdit}
                  disabled={isSaving}
                  className="px-3 py-1 rounded-full bg-red-500 hover:bg-red-600
                    text-white text-sm font-medium transition-colors duration-200 cursor-pointer"
                  title={t("Cancel")}
                >
                  ✕
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}