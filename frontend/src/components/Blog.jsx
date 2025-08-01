import { useContext, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

import Comments from "./Comments";

import { GET_BLOG, GET_BLOGS } from "../graphql/queries/blog";
import {
  CREATE_COMMENT,
  DELETE_COMMENT,
  LIKE_COMMENT,
  UPDATE_COMMENT,
} from "../graphql/mutations/comment";
import { GET_COMMENT } from "../graphql/queries/comment";
import AddComment from "./AddComment";
import { DELETE_BLOG, LIKE_BLOG, UPDATE_BLOG } from "../graphql/mutations/blog";
import BlogForm from "./BlogForm";
import LikeCard from "./LikeCard";

import UserContext from "./UserContext";

const Blog = ({ setNotification }) => {
  const [userCred] = useContext(UserContext);
  const [addCommentVis, setAddCommentVis] = useState(false);
  const [updating, setUpdating] = useState(false);

  const navigate = useNavigate();

  const blogId = useParams().id;
  const blogResult = useQuery(GET_BLOG, { variables: { id: blogId } });

  const [createCommentMutation] = useMutation(CREATE_COMMENT, {
    onError: (error) => {
      console.error(error);
      setNotification("Error in creating comment");
    },
    onCompleted: () => {
      setNotification("successfully created comment");
    },
    update: (cache, response, { variables }) => {
      if (variables.isBlog) {
        cache.updateQuery(
          { query: GET_BLOG, variables: { id: variables.blogOrCommentId } },
          (previousResult) => {
            if (!previousResult?.getBlog) return previousResult;

            return {
              getBlog: {
                ...previousResult.getBlog,
                comments: [
                  ...previousResult.getBlog.comments,
                  response.data.createComment.id,
                ],
              },
            };
          }
        );
      } else {
        cache.updateQuery(
          { query: GET_COMMENT, variables: { id: variables.blogOrCommentId } },
          (previousResult) => {
            return {
              getComment: {
                ...previousResult.getComment,
                comments: [
                  ...previousResult.getComment.comments,
                  response.data.createComment.id,
                ],
              },
            };
          }
        );
      }
    },
  });

  const createComment = (isBlog) => {
    return (blogOrCommentId, content) => {
      createCommentMutation({
        variables: { blogOrCommentId, content, isBlog },
      });
    };
  };

  const handleBlogComment = (blogOrCommentId, content) => {
    const func = createComment(true);
    func(blogOrCommentId, content);
    setAddCommentVis(false);
  };

  const [deleteCommentMutation] = useMutation(DELETE_COMMENT, {
    onError: (error) => {
      console.error(error);
      setNotification("error in deleting comment");
    },
    onCompleted: () => {
      setNotification("Successfully deleted comment");
    },
    update: (cache, response, { variables }) => {
      if (variables.isBlog) {
        cache.updateQuery(
          { query: GET_BLOG, variables: { id: variables.parId } },
          (previousResult) => {
            if (!previousResult.getBlog) return previousResult;
            return {
              getBlog: {
                ...previousResult.getBlog,
                comments: previousResult.getBlog.comments.filter(
                  (comment) => comment.toString() != variables.id.toString()
                ),
              },
            };
          }
        );
      } else {
        cache.updateQuery(
          { query: GET_COMMENT, variables: { id: variables.parId } },
          (previousResult) => {
            console.log("prev res: ", previousResult);
            if (!previousResult.getComment) return previousResult;
            return {
              getComment: {
                ...previousResult.getComment,
                comments: previousResult.getComment.comments.filter(
                  (comment) => comment.toString() != variables.id.toString()
                ),
              },
            };
          }
        );
      }
    },
  });

  const deleteComment = (commentId, parId, isBlog) => {
    deleteCommentMutation({ variables: { id: commentId, parId, isBlog } });
  };

  const [deleteBlogMutation] = useMutation(DELETE_BLOG, {
    onError: (error) => {
      console.error(error);
      setNotification("error in deleting blog");
    },
    onCompleted: () => {
      setNotification("Successfully deleted blog");
      navigate("/blogs");
    },
    update: (cache) => {
      cache.updateQuery({ query: GET_BLOGS }, (prevResponse) => {
        if (!prevResponse.getBlogs) return prevResponse;
        return {
          getBlogs: prevResponse.getBlogs.filter(
            (blog) => blog.id.toString() !== blogId
          ),
        };
      });
    },
  });

  const handleBlogDelete = (blogId) => {
    deleteBlogMutation({ variables: { id: blogId } });
  };

  const [updateCommentMutation] = useMutation(UPDATE_COMMENT, {
    onError: (error) => {
      console.error(error);
      setNotification("Error updating comment");
    },
    onCompleted: () => {
      setNotification("Successfully updated comment");
    },
    update: (cache, response) => {
      cache.updateQuery(
        {
          query: GET_COMMENT,
          variables: { id: response.data.updateComment.id },
        },
        (prevResponse) => {
          if (!prevResponse?.getComment) return prevResponse;
          return {
            getComment: response.data.updateComment,
          };
        }
      );
    },
  });

  const updateComment = (id, content) => {
    updateCommentMutation({ variables: { id, content } });
  };

  const [updateBlogMutation] = useMutation(UPDATE_BLOG, {
    onError: (error) => {
      console.error(error);
      setNotification("error updating blog");
    },
    update: (cache, response) => {
      cache.updateQuery(
        { query: GET_BLOG, variables: { id: response.data.updateBlog.id } },
        (prevResponse) => {
          if (!prevResponse?.getBlog) return prevResponse;
          return {
            getBlog: response.data.updateBlog,
          };
        }
      );
    },
    onCompleted: () => {
      setNotification("successfully updated blog");
    },
  });

  const handleBlogUpdate = (title, content) => {
    if (!updating) return setUpdating(true);

    updateBlogMutation({ variables: { id: blog.id, title, content } });
    setUpdating(false);
  };

  const [likeBlogMutation] = useMutation(LIKE_BLOG, {
    onError: (error) => {
      console.error(error);
      setNotification("Error, couldn't add like to blog");
    },
    update: (cache, response) => {
      cache.updateQuery(
        { query: GET_BLOG, variables: { id: blogId } },
        (prevResult) => {
          if (!prevResult?.getBlog) return prevResult;
          return {
            getBlog: {
              ...prevResult.getBlog,
              likes: response.data.likeBlog.likes,
            },
          };
        }
      );
    },
  });
  const handleLike = () => {
    likeBlogMutation({ variables: { id: blogId } });
  };

  const [likeCommentMutation] = useMutation(LIKE_COMMENT, {
    onError: (error) => {
      console.error(error);
      setNotification("error liking comment");
    },
    update: (cache, response) => {
      cache.updateQuery(
        {
          query: GET_COMMENT,
          variables: { id: response.data.likeComment.id },
        },
        (prevResponse) => {
          if (!prevResponse?.getComment) return prevResponse;
          return {
            getComment: response.data.likeComment,
          };
        }
      );
    },
  });
  const likeComment = (id) => {
    likeCommentMutation({ variables: { id } });
  };

  if (blogResult.loading) {
    return <div>Loading...</div>;
  }

  if (blogResult.error) {
    return <div>Blog doesn't exist!</div>;
  }

  const blog = blogResult.data.getBlog;

  let blogEditDel = (
    <div className="ml-3 dropdown dropdown-end">
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
      <ul className="flex dropdown-content bg-base-300 rounded-xl">
        <button onClick={handleBlogUpdate} className="btn btn-ghost rounded-xl">
          Update
        </button>
        <button
          onClick={() => handleBlogDelete(blog.id)}
          className="btn btn-ghost rounded-xl"
        >
          Delete
        </button>
      </ul>
    </div>
  );

  const displayBlog = (
    <>
      <div className="flex">
        <div className="flex items-center justify-between gap-12">
          <h2 className="text-3xl font-bold text-gray-300">{blog.title}</h2>
          <LikeCard
            userCred={userCred}
            handleLike={handleLike}
            likes={blog.likes}
          />
        </div>
        <div className="flex ml-auto items-center">
          <p className="opacity-60 font-semibold">{blog.user.name}</p>
          {userCred.user?.id.toString() === blog.user.id.toString()
            ? blogEditDel
            : null}
        </div>
      </div>
      <div className="mt-6">
        <MDEditor.Markdown
          source={blog.content}
          className="min-h-96 rounded-lg p-4 shadow-lg"
        />
      </div>
    </>
  );

  const editBlog = (
    <BlogForm
      createOrUpdateBlog={handleBlogUpdate}
      buttonText="update"
      defaultTitle={blog.title}
      defaultContent={blog.content}
    />
  );

  return (
    <div className="mt-12 mb-12 mx-6">
      {updating ? editBlog : displayBlog}

      <div className="flex justify-between mt-12 mb-12">
        <h3 className="font-bold text-2xl opacity-90">Comments</h3>

        {userCred.token ? (
          <button
            onClick={() => setAddCommentVis(!addCommentVis)}
            className="btn btn-ghost"
          >
            {addCommentVis ? "close" : "add comment"}
          </button>
        ) : null}
      </div>

      {addCommentVis ? (
        <AddComment
          blogOrCommentId={blogId}
          createComment={handleBlogComment}
        />
      ) : null}

      <Comments
        commentsId={blog.comments}
        createComment={createComment(false)}
        deleteComment={deleteComment}
        updateComment={updateComment}
        likeComment={likeComment}
      />
    </div>
  );
};

export default Blog;
