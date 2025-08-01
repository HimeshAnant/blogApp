import { useState } from "react";

import MDEditor from "@uiw/react-md-editor";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const BlogForm = ({
  createOrUpdateBlog,
  buttonText = "publish",
  defaultTitle = "",
  defaultContent = "",
}) => {
  const [title, setTitle] = useState(defaultTitle);
  const [content, setContent] = useState(defaultContent);

  return (
    <div className="flex flex-col items-center px-12 pt-3 pb-12 min-h-screen">
      <input
        value={title}
        onChange={({ target }) => setTitle(target.value)}
        type="text"
        placeholder="Title"
        className="input input-ghost text-3xl font-bold text-gray-300 mt-12 text-center w-full"
      />

      <MDEditor
        value={content}
        onChange={setContent}
        className="w-11/12 mt-12"
        height={512}
      />
      <button
        onClick={() => createOrUpdateBlog(title, content)}
        className="btn btn-neutral flex-none mt-12"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default BlogForm;
