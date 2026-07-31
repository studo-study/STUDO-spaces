"use client";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Pin } from "@/types/types";
import VsInput from "@/components/ui/app/private/create-visualset/VsInput";
import VsFooter from "@/components/ui/app/private/create-visualset/VsFooter";

export interface VisualsetImage {
  id: string;
  title: string;
  file: File | null;
  previewUrl: string;
  grid_x: number;
  grid_y: number;
  scale: string;
  pins: Pin[];
}

const createEmptyImage = (): VisualsetImage => ({
  id: crypto.randomUUID(),
  title: "",
  file: null,
  previewUrl: "",
  grid_x: 0,
  grid_y: 0,
  scale: "1",
  pins: [],
});

export default function CreateVisualsetForm() {
  const t = useTranslations("createvisualset");
  const router = useRouter();

  const [isMutating, setIsMutating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<VisualsetImage[]>([createEmptyImage()]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const titleRef = useRef<HTMLInputElement>(null);

  const currentImage = images[activeImageIndex];

  const handleFileUpload = useCallback(
    (file: File) => {
      if (file && file.type.startsWith("image/")) {
        const previewUrl = URL.createObjectURL(file);
        setImages((prev) =>
          prev.map((img, i) =>
            i === activeImageIndex ? { ...img, file, previewUrl } : img,
          ),
        );
      }
    },
    [activeImageIndex],
  );

  const addPin = useCallback(
    (
      pin: Omit<
        Pin,
        | "id"
        | "number"
        | "created_at"
        | "updated_at"
        | "image_id"
        | "set_id"
        | "owner_id"
      >,
    ) => {
      setImages((prev) =>
        prev.map((img, i) =>
          i === activeImageIndex
            ? { ...img, pins: [...img.pins, pin as Pin] }
            : img,
        ),
      );
    },
    [activeImageIndex],
  );

  const removePin = useCallback(
    (pinIndex: number) => {
      setImages((prev) =>
        prev.map((img, i) =>
          i === activeImageIndex
            ? { ...img, pins: img.pins.filter((_, idx) => idx !== pinIndex) }
            : img,
        ),
      );
    },
    [activeImageIndex],
  );

  const removePinByCoords = useCallback(
    (x: number, y: number) => {
      setImages((prev) =>
        prev.map((img, i) =>
          i === activeImageIndex
            ? {
                ...img,
                pins: img.pins.filter((pin) => !(pin.x === x && pin.y === y)),
              }
            : img,
        ),
      );
    },
    [activeImageIndex],
  );

  const updateImageTitle = useCallback(
    (title: string) => {
      setImages((prev) =>
        prev.map((img, i) =>
          i === activeImageIndex ? { ...img, title } : img,
        ),
      );
    },
    [activeImageIndex],
  );

  const addImage = useCallback(() => {
    const newImage = createEmptyImage();
    setImages((prev) => [...prev, newImage]);
    setActiveImageIndex(images.length);
  }, [images.length]);

  const removeImage = useCallback(
    (index: number) => {
      if (images.length > 1) {
        setImages((prev) => prev.filter((_, i) => i !== index));
        if (activeImageIndex >= index && activeImageIndex > 0) {
          setActiveImageIndex(activeImageIndex - 1);
        }
      }
    },
    [images.length, activeImageIndex],
  );

  const reorderImages = useCallback(
    (fromIndex: number, toIndex: number) => {
      setImages((prev) => {
        const newArr = [...prev];
        const [moved] = newArr.splice(fromIndex, 1);
        newArr.splice(toIndex, 0, moved);
        return newArr;
      });
      if (activeImageIndex === fromIndex) {
        setActiveImageIndex(toIndex);
      }
    },
    [activeImageIndex],
  );

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!titleRef.current?.value) newErrors.title = "title_error";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;

    setIsMutating(true);

    const formData = new FormData();
    formData.append("title", titleRef.current!.value);

    const imagesMetadata = images.map((img, index) => ({
      title: img.title || `Image ${index + 1}`,
      index,
      grid_x: img.grid_x || 0,
      grid_y: img.grid_y || 0,
      scale: img.scale || "1",
    }));
    formData.append("images_metadata", JSON.stringify(imagesMetadata));

    const pinsData = images.flatMap((img, imgIndex) =>
      (img.pins || []).map((pin, pinIndex) => ({
        definition: pin.definition,
        x: pin.x,
        y: pin.y,
        number: pinIndex + 1,
        image_index: imgIndex,
        img_url: "",
      })),
    );
    formData.append("pins_data", JSON.stringify(pinsData));

    images.forEach((img) => {
      if (img.file) {
        formData.append("files", img.file);
      }
    });

    try {
      const res = await fetch("/api/visualsets", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      router.push(`/visualset/${data.id}`);
    } catch {
      setIsMutating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex w-full flex-col items-center justify-center gap-3">
        <span className="w-full text-2xl sm:text-3xl flex flex-col justify-center items-baseline text-studodarkblue font-bold dark:text-white">
          {t("title")}
        </span>

        <div className="w-full gap-3 sm:gap-4 md:gap-5 flex-col flex">
          <div className="flex flex-col gap-1">
            <input
              ref={titleRef}
              type="text"
              className="w-full h-12 px-5 rounded-full glass-rgb border border-studoborder/30 text-white outline-none"
              autoComplete="off"
              placeholder={t("title_placeholder")}
            />
            <div className="h-5">
              {errors.title && (
                <span className="w-full h-fit text-rose-500 px-5 flex">
                  {t(errors.title)}
                </span>
              )}
            </div>
          </div>
        </div>

        <VsInput
          activeImageIndex={activeImageIndex}
          currentImage={currentImage}
          onFileUpload={handleFileUpload}
          onAddPin={addPin}
          onRemovePin={removePin}
          onRemovePinByCoords={removePinByCoords}
          onUpdateImageTitle={updateImageTitle}
        />

        <VsFooter
          images={images}
          activeIndex={activeImageIndex}
          onSelectImage={setActiveImageIndex}
          onAddImage={addImage}
          onRemoveImage={removeImage}
          onReorderImages={reorderImages}
          isMutating={isMutating}
        />
      </div>
    </form>
  );
}
