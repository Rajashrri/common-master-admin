import { useEffect, useRef } from "react";

const RichTextEditor = ({ value = "", onChange, height = 400 }) => {
  const editorRef = useRef(null);
  const instanceRef = useRef(null);

  // 👉 prevents flicker / repeated setData
  const lastValueRef = useRef("");

  useEffect(() => {
    if (!window.CKEDITOR) {
      console.error("CKEditor not loaded");
      return;
    }

    if (!editorRef.current) return;

    const BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

    // destroy old instance safely
    const old =
      window.CKEDITOR.instances[editorRef.current.id];
    if (old) {
      old.destroy(true);
    }

    const editor = window.CKEDITOR.replace(editorRef.current, {
      height,
      removePlugins: "elementspath",
      resize_enabled: false,

    
  uploadUrl: `${BASE_URL}/api/ckeditor/upload`,
  filebrowserUploadUrl: `${BASE_URL}/api/ckeditor/upload`,
  filebrowserImageUploadUrl: `${BASE_URL}/api/ckeditor/upload`,
    });

    instanceRef.current = editor;

    // 👉 INIT VALUE (edit page fix)
    editor.on("instanceReady", () => {
      if (value && value !== lastValueRef.current) {
        editor.setData(value);
        lastValueRef.current = value;
      }
    });

    // 👉 ON CHANGE (safe update)
    editor.on("change", () => {
      const data = editor.getData();

      if (data !== lastValueRef.current) {
        lastValueRef.current = data;
        onChange?.(data);
      }
    });

    return () => {
      editor.destroy(true);
      instanceRef.current = null;
    };
  }, []);

  // 👉 SYNC VALUE FROM PARENT (EDIT FIX - NO FLICKER)
  useEffect(() => {
    const editor = instanceRef.current;
    if (!editor) return;

    const sync = () => {
      if (value !== lastValueRef.current) {
        editor.setData(value || "");
        lastValueRef.current = value || "";
      }
    };

    if (editor.status === "ready") {
      sync();
    } else {
      editor.on("instanceReady", sync);
    }
  }, [value]);

  // 👉 HEIGHT UPDATE
  useEffect(() => {
    const editor = instanceRef.current;
    if (!editor) return;

    if (editor.status === "ready") {
      editor.resize("100%", height);
    }
  }, [height]);

  return (
    <div>
      <textarea
        id="rich-editor"
        ref={editorRef}
        defaultValue={value}
      />
    </div>
  );
};

export default RichTextEditor;