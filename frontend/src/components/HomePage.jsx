import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-screen bg-base-200 text-base-content px-4 py-10">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4">Welcome to BlogApp</h1>
        <p className="text-lg">
          A clean and powerful platform to write, read, and engage with blogs.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate("/blogs")}
            className="btn btn-primary mr-3"
          >
            Explore Blogs
          </button>
          <button
            onClick={() => navigate("/createBlog")}
            className="btn btn-outline"
          >
            Create Blog
          </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body text-center">
            <h2 className="card-title justify-center">✍️ Write Blogs</h2>
            <p>Markdown editor with formatting options.</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-md">
          <div className="card-body text-center">
            <h2 className="card-title justify-center">💬 Nested Comments</h2>
            <p>Reply to posts and comments with full threading support.</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-md">
          <div className="card-body text-center">
            <h2 className="card-title justify-center">❤️ Likes</h2>
            <p>Show appreciation for great blogs and comments.</p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <p className="mb-6">
          1. Create an account. 2. Write your thoughts.
          <br />
          Simple.
        </p>
        <p className="text-sm opacity-70">
          Built using React, TailwindCSS, DaisyUI, MongoDB, and GraphQL.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
