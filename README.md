# 🧑‍💻 Portfolio Builder Web App

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Tech](https://img.shields.io/badge/stack-MERN-purple)

A portfolio builder that allows users to register, upload projects, showcase skills, track profile views, and receive updates via newsletters.

---

## 🚀 Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT, bcrypt
- **File Uploads:** Cloudinary
- **Email Service:** Nodemailer
- **API Docs:** Swagger (Live Docs)
- **Testing:** Jest, Supertest

---

## 📦 Features

- 🔐 User registration & login (JWT-based)
- 👤 Editable user profiles
- 💾 Project uploads (with Cloudinary integration)
- 📊 Profile view tracking
- 🔍 Project filtering by category (frontend, backend, all)
- 🔎 Search functionality
- 📬 Newsletter subscription
- 📘 Live Swagger API docs

---

## 📁 Project Structure

```
├── backend/
app.js
config
├── cloudinaryConfig.js
├── db.js
controllers
├── authController.js
├── projectController.js
├── searchController.js
├── userController.js
middlewares
├── protect.js
├── token.js
models
├── projectModel.js
├── subscriberModel.js
├── userModel.js
package-lock.json
package.json
routes
├── profileRoute.js
├── projectRoute.js
├── userRoute.js
swagger
├── swagger.js
tests
├── authTest.js
├── profileTest.js
├── projectTest.js
utils
├── cloudinary.js
├── emailService.js
├── jwtService.js
```

---

## 📅 Timeline

This project was developed during a 4-week sprint. Check the project plan document for weekly goals and assignments.

---

## 📄 License

MIT License © 2025

---
