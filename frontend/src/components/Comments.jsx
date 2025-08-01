import { useQuery } from "@apollo/client";
import { GET_COMMENT } from "../graphql/queries/comment.js";
import { useContext, useEffect, useState } from "react";

import AddComment from "./AddComment.jsx";
import LikeCard from "./LikeCard.jsx";

import UserContext from "./UserContext.jsx";

const Comment = ({
  commentId,
  createComment,
  deleteComment,
  updateComment,
  likeComment,
}) => {
  const [visible, setVisible] = useState(false);
  const [addVis, setAddVis] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updatingVal, setUpdatingVal] = useState("");

  const [userCred] = useContext(UserContext);

  const commentResult = useQuery(GET_COMMENT, { variables: { id: commentId } });
  useEffect(() => {
    if (commentResult.data) {
      setUpdatingVal(commentResult.data.getComment.content);
    }
  }, [commentResult.data]);

  if (commentResult.loading) {
    return <div>loading...</div>;
  }
  if (!commentResult.data) {
    return null;
  }

  const comment = commentResult.data.getComment;
  const commentsId = comment.comments;

  let visButton = null;
  if (commentsId.length > 0) {
    visButton = (
      <button
        onClick={() => setVisible(!visible)}
        className="btn btn-ghost px-0 opacity-50"
      >
        {visible ? "Hide comments" : "Show comments"}
      </button>
    );
  }

  const handleCreateComment = (blogOrCommentId, val) => {
    setAddVis(false);
    createComment(blogOrCommentId, val);
  };

  const handleDeleteComment = () => {
    setDeleting(true);
    deleteComment(commentId, comment.parent.parentId, comment.parent.isBlog);
  };

  const handleCommentUpdate = async () => {
    if (!updating) return setUpdating(true);

    await updateComment(commentId, updatingVal);
    setUpdating(false);
  };

  const handleLike = () => {
    likeComment(comment.id);
  };

  let updateBlock = (
    <div>
      <textarea
        value={updatingVal}
        onChange={({ target }) => setUpdatingVal(target.value)}
        className="textarea textarea-ghost w-full resize-none mt-2 mb-2"
      ></textarea>
      <button
        onClick={handleCommentUpdate}
        className="btn btn-ghost pl-1 pr-1 opacity-60"
      >
        save
      </button>
    </div>
  );

  let defaultBlock = (
    <>
      <p className="whitespace-pre-line">{comment.content}</p>

      <div>
        {userCred.token ? (
          <button
            onClick={() => setAddVis(!addVis)}
            className="btn btn-ghost px-0 opacity-50 mr-3"
          >
            {addVis ? "close" : "add comment"}
          </button>
        ) : null}
        {visButton}
      </div>
    </>
  );

  const commentEditDel = (
    <div className="dropdown dropdown-bottom dropdown-end">
      <div tabIndex={0} role="button">
        <button className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current cursor-pointer opacity-60"
          >
            {" "}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            ></path>{" "}
          </svg>
        </button>
      </div>
      <ul className="dropdown-content">
        <div className="flex">
          <button
            onClick={handleCommentUpdate}
            className="btn btn-ghost opacity-60"
          >
            update
          </button>

          <button
            onClick={() => handleDeleteComment()}
            className="btn btn-ghost opacity-60"
          >
            {deleting ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "delete"
            )}
          </button>
        </div>
      </ul>
    </div>
  );

  return (
    <div>
      <div className="border-b bg-base-300 pt-2 pb-2 px-4 mt-2 rounded-xl border-b-gray-800">
        <div className="flex justify-between">
          <h4 className="font-bold text-sm opacity-60">{comment?.user.name}</h4>
          <div className="flex gap-4">
            <LikeCard
              userCred={userCred}
              likes={comment.likes}
              handleLike={handleLike}
            />
            {userCred.user?.id.toString() === comment?.user.id.toString() &&
            !updating
              ? commentEditDel
              : null}
          </div>
        </div>

        <div>{updating ? updateBlock : defaultBlock}</div>
      </div>

      {addVis ? (
        <AddComment
          blogOrCommentId={commentId}
          createComment={handleCreateComment}
        />
      ) : null}

      {visible ? (
        <Comments
          commentsId={commentsId}
          createComment={createComment}
          deleteComment={deleteComment}
          updateComment={updateComment}
          likeComment={likeComment}
        />
      ) : null}
    </div>
  );
};

const Comments = ({
  commentsId,
  createComment,
  deleteComment,
  updateComment,
  likeComment,
}) => {
  return (
    <div className="ml-8 rounded-lg mt-4 border-l border-l-gray-700">
      {commentsId.map((commentId) => (
        <Comment
          key={commentId}
          commentId={commentId}
          createComment={createComment}
          deleteComment={deleteComment}
          updateComment={updateComment}
          likeComment={likeComment}
        />
      ))}
    </div>
  );
};

export default Comments;
