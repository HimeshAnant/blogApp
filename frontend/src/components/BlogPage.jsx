import { useNavigate } from "react-router-dom";

const BlogPage = ({ blogs }) => {
  const navigate = useNavigate();

  if (!blogs || blogs.length === 0) {
    return (
      <div className="mt-20 text-center text-lg opacity-70">
        No blogs found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      <div className="grid gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-base-100 px-4 py-2 shadow-md cursor-pointer transition-transform hover:scale-[1.01]"
            onClick={() => navigate(`/blogs/${blog.id}`)}
          >
            <h2 className="text-xl font-bold mb-4">{blog.title}</h2>
            <p className="text-sm font-semibold opacity-60">
              by {blog.user.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
