const Notification = ({ notification, setNotification }) => {
  const closeNotification = () => {
    setNotification(null);
  };

  if (notification === null) {
    return null;
  }

  setTimeout(() => {
    setNotification(null);
  }, 3000);

  return (
    <div
      role="alert"
      className="alert alert-vertical sm:alert-horizontal fixed top-0 z-50 w-full opacity-90"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="stroke-info h-6 w-6 shrink-0"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <div>
        <h3 className="font-bold">{notification}</h3>
      </div>
      <button onClick={closeNotification} className="btn btn-sm">
        close
      </button>
    </div>
  );
};

export default Notification;
