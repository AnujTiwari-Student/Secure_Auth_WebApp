"use client";

import axios from "axios";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface AvatarUploaderProps {
  onSelect: (imageInfo: any) => void;
  reset?: boolean
}

export default function AvatarUploader({onSelect , reset}: AvatarUploaderProps) {

  const [resource, setResource] = useState<CloudinaryUploadWidgetInfo | string>();

  useEffect(() => {
    if (reset) {
      setResource(undefined);
    }
  }, [reset]);

  useEffect(() => {
    if (resource) console.log("Updated Resource:", resource);
  }, [resource]);

  return (
    <CldUploadWidget
      uploadPreset="next_authentication_upload"
      onSuccess={(result) => {
        console.log("Cloudinary upload result:", result);
        setResource(result?.info);
        onSelect(result.info);
      }}
    >
      {({ open }) => {
        function handleOnClick() {
          setResource(undefined);
          open();
        }
        return (
          <div
            onClick={handleOnClick}
            className="w-full max-w-sm h-10 px-3 border border-gray-300 rounded-md shadow-sm flex items-center gap-3 text-sm text-gray-700 bg-white cursor-pointer hover:border-blue-400 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4"
              />
            </svg>
            <span className="truncate">
              {/* @ts-ignore */}
              {resource ? resource.display_name : "Upload Avatar"}
            </span>
          </div>
        );
      }}
    </CldUploadWidget>
  );
}
