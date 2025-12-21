import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import VsHeader from "./header/VsHeader.jsx";
import VsFooter from "./footer/VsFooter.jsx";
import VsInput from "./inputfield/VsInput.jsx";
import { getAll, getById, axios } from "../../api";

const EMPTY_IMAGE = {
  title: "",
  file: null,
  previewUrl: "",
  grid_x: 0,
  grid_y: 0,
  scale: "1",
  pins: []
};

const EMPTY_VISUALSET = {
  title: "",
  subject: "",
  folder_id: "",
  images: [{ ...EMPTY_IMAGE }]
};

const saveVisualset = async (url, { arg }) => {
  const { id, title, subject, folder_id, images } = arg;

  const formData = new FormData();
  formData.append("title", title);
  formData.append("subject", subject);
  formData.append("folder_id", folder_id);

  const imagesMetadata = images.map((img, index) => ({
    title: img.title || `Image ${index + 1}`,
    index,
    grid_x: img.grid_x || 0,
    grid_y: img.grid_y || 0,
    scale: img.scale || "1"
  }));
  formData.append("images_metadata", JSON.stringify(imagesMetadata));

  const pinsData = images.flatMap((img, imgIndex) =>
    (img.pins || []).map((pin, pinIndex) => ({
      definition: pin.definition,
      x: pin.x,
      y: pin.y,
      number: pinIndex + 1,
      image_index: imgIndex,
      img_url: ""
    }))
  );
  formData.append("pins_data", JSON.stringify(pinsData));

  images.forEach((img) => {
    if (img.file) {
      formData.append("files", img.file);
    }
  });

  const response = await axios({
    method: id ? "PUT" : "POST",
    url: `${url}${id ? `/${id}` : ""}`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;
};

export default function CreateOrEditVisualset() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { data: existingVisualset } = useSWR(
    id ? `visualsets/${id}` : null,
    getById
  );

  const { data: foldersData = { folders: [] }, isLoading: foldersLoading } = useSWR(
    "folders/me",
    getAll
  );

  const { trigger: saveSet, isMutating } = useSWRMutation(
    "visualsets",
    saveVisualset
  );

  const methods = useForm({
    mode: "onBlur",
    defaultValues: existingVisualset || EMPTY_VISUALSET,
    values: existingVisualset
  });

  const { handleSubmit, control, formState: { errors }, getValues, setValue, watch } = methods;

  const { fields: imageFields, append: appendImage, remove: removeImage, move: moveImage } = useFieldArray({
    control,
    name: "images"
  });

  const currentImage = watch(`images.${activeImageIndex}`);

  const addImage = useCallback(() => {
    appendImage({ ...EMPTY_IMAGE });
    setActiveImageIndex(imageFields.length);
  }, [appendImage, imageFields.length]);

  const handleRemoveImage = useCallback((index) => {
    if (imageFields.length > 1) {
      removeImage(index);
      if (activeImageIndex >= index && activeImageIndex > 0) {
        setActiveImageIndex(activeImageIndex - 1);
      }
    }
  }, [removeImage, imageFields.length, activeImageIndex]);

  const handleReorderImages = useCallback((fromIndex, toIndex) => {
    moveImage(fromIndex, toIndex);
    if (activeImageIndex === fromIndex) {
      setActiveImageIndex(toIndex);
    }
  }, [moveImage, activeImageIndex]);

  const addPin = useCallback((pin) => {
    const currentPins = getValues(`images.${activeImageIndex}.pins`) || [];
    setValue(`images.${activeImageIndex}.pins`, [...currentPins, pin]);
  }, [activeImageIndex, getValues, setValue]);

  const removePin = useCallback((pinIndex) => {
    const currentPins = getValues(`images.${activeImageIndex}.pins`) || [];
    setValue(
      `images.${activeImageIndex}.pins`,
      currentPins.filter((_, i) => i !== pinIndex)
    );
  }, [activeImageIndex, getValues, setValue]);

  const removePinByCoords = useCallback((x, y) => {
    const currentPins = getValues(`images.${activeImageIndex}.pins`) || [];
    setValue(
      `images.${activeImageIndex}.pins`,
      currentPins.filter((pin) => !(pin.x === x && pin.y === y))
    );
  }, [activeImageIndex, getValues, setValue]);

  const handleFileUpload = useCallback((file) => {
    if (file && file.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(file);
      setValue(`images.${activeImageIndex}.file`, file);
      setValue(`images.${activeImageIndex}.previewUrl`, previewUrl);
    }
  }, [activeImageIndex, setValue]);

  const onSubmit = useCallback(async (data) => {
    const hasImages = data.images.some((img) => img.file || img.previewUrl);
    if (!hasImages) {

      return;
    }

    const hasPins = data.images.some((img) => img.pins && img.pins.length > 0);
    if (!hasPins) {

      return;
    }

    await saveSet(
      {
        ...data,
        id: id || undefined
      },
      {
        throwOnError: false,
        onSuccess: (response) => {
          navigate(`/visualsets/${response.id || id}`);
        },
        onError: (error) => {
        }
      }
    );
  }, [id, saveSet, navigate]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full min-h-screen flex text-sm sm:text-base flex-col items-center justify-baseline
          pt-20 sm:pt-25 md:pt-35 gap-3 sm:gap-4 md:gap-5 mb-16 sm:mb-20 overflow-y-auto
          scroll-hidden px-4 sm:px-6 lg:px-8">
        <div className="w-full sm:w-11/12 md:w-4/5 lg:w-3/5 h-fit flex flex-col gap-3 sm:gap-4 md:gap-5 scroll-hidden">
          <VsHeader
            folders={foldersData.folders || []}
            foldersLoading={foldersLoading}
            errors={errors}
          />

          <VsInput
            activeImageIndex={activeImageIndex}
            currentImage={currentImage}
            onFileUpload={handleFileUpload}
            onAddPin={addPin}
            onRemovePin={removePin}
            onRemovePinByCoords={removePinByCoords}
          />

          <VsFooter
            images={imageFields}
            activeIndex={activeImageIndex}
            onSelectImage={setActiveImageIndex}
            onAddImage={addImage}
            onRemoveImage={handleRemoveImage}
            onReorderImages={handleReorderImages}
            isMutating={isMutating}
          />
        </div>
      </form>
    </FormProvider>
  );
}