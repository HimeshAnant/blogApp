import { useState } from "react";

const AddComment = ({ blogOrCommentId, createComment }) => {
  const [val, setVal] = useState("");

  const handleClick = () => {
    setVal("");
    createComment(blogOrCommentId, val);
  };

  return (
    <div className="ml-8 mt-4 mb-4">
      <textarea
        value={val}
        onChange={({ target }) => setVal(target.value)}
        className="resize-none w-full textarea"
        placeholder="type comment"
      ></textarea>
      <button onClick={handleClick} className="btn btn-ghost px-2 text-primary">
        create
      </button>
    </div>
  );
};

export default AddComment;
