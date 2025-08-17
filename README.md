# Blog App

A full-stack blogging platform built with React, Node.js, MongoDB, and GraphQL. Users can create blogs, post nested comments, like posts and comments, and authenticate via JWT login/signup. The app is deployed and accessible [here](https://blogapp-dzjb.onrender.com/).

---

## **Features**

- **User Authentication**
  - JWT-based login/signup.
  - While routes aren’t explicitly protected, users can’t perform critical actions like posting a blog without being logged in — the backend throws an error and the frontend displays an error message.

- **Blogs**
  - Create, view, delete and like blog posts.
  - Blogs support Markdown formating.
  
- **Comments**
  - Full nested comment threads.
  - Recursive rendering on frontend for easy display.
  - Comments don’t store parent references; deletion uses a workaround where backend receives the parent ID.

- **Likes**
  - Users can like both blogs and comments.
  - Users can only like a particular resource once. This is achieved by keeping an array of userIDs.

- **GraphQL API**
  - Efficient querying and mutations using Apollo Server and Apollo Client.

---

## **Tech Stack**

- **Frontend:** React, Apollo Client  
- **Backend:** Node.js, Express, Apollo Server, GraphQL  
- **Database:** MongoDB  
- **Authentication:** JWT tokens  

---

## **Project Highlights / Learning Outcomes**

- Developed a full-stack application with frontend-backend integration.  
- Implemented nested comments and recursive rendering.  
- Learned to handle JWT-based login/signup flows.  
- Gained experience designing GraphQL schemas and working with Apollo Client caching.

---

