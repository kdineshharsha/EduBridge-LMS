import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function mediaUpload(file) {
  const promise = new Promise((resolve, reject) => {
    if (!file) {
      reject("No file selected");
      return;
    }

    const timestamp = new Date().getTime();
    const newFileName = `${file.name}_${timestamp}`;

    // Determine bucket based on MIME type
    const isImage = file.type.startsWith("image/");
    const bucket = isImage ? "images" : "documents";

    supabase.storage
      .from(bucket)
      .upload(newFileName, file, {
        cacheControl: "3600",
        upsert: false,
      })
      .then(() => {
        const fileUrl = supabase.storage.from(bucket).getPublicUrl(newFileName)
          .data.publicUrl;
        resolve(fileUrl);
      })
      .catch((error) => {
        reject("Error uploading file: " + error.message);
      });
  });

  return promise;
}
