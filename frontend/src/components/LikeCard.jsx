const LikeCard = ({ handleLike, likes, userCred }) => {
  const alreadyLiked = likes.some(
    (userId) => userId.toString() === userCred.user?.id.toString()
  );

  return (
    <div className="flex items-center gap-4 px-4 py-2 rounded-2xl bg-base-200">
      <button
        onClick={handleLike}
        className={`btn btn-ghost btn-circle btn-sm
              ${
                alreadyLiked
                  ? "btn-active text-primary scale-120 hover:scale-100 hover:text-base-100"
                  : "hover:text-primary hover:scale-120"
              }
              ${userCred.user ? "" : "btn-disabled"}
              `}
      >
        <svg
          className="size-[1.2em]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2"
            fill="currentColor"
            stroke="currentColor"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </g>
        </svg>
      </button>
      <p className={`mb-1 ${userCred.user ? "" : "opacity-50"}`}>
        {likes.length}
      </p>
    </div>
  );
};

export default LikeCard;
