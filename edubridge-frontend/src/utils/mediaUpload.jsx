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
    const newFileName = timestamp + "_" + file.name;
    supabase.storage
      .from("images")
      .upload(newFileName, file, {
        cacheControl: "3600",
        upsert: false,
      })
      .then(() => {
        const fileUrl = supabase.storage
          .from("images")
          .getPublicUrl(newFileName).data.publicUrl;
        resolve(fileUrl);
      })
      .catch((error) => {
        reject("Error uploading file: " + error);
      });
  });
  return promise;
}
