"use client";

import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";

// Pre-typed components that know about our endpoint shape.
// Import these instead of the generic UploadButton from the package
// so endpoint names + inputs are type-checked.
export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
