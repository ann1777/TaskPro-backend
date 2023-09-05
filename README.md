# TaskPro-backend

## Project Overview

This project implements the server-side component of the TaskPro application. It is built on Node.js, utilizing the Express.js framework to implement the API and Mongoose for interacting with the MongoDB database.

## References

This is a link to the Project Layout: [![Figma](https://www.figma.com/file/yRrel7KUKlBkO3pYa7kWqR/QuizMaster?type=design&node-id=0%3A1&mode=design&t=eavwxuklWNZuRV15-1)
This is a link to the Project terms of reference: [![Requirements](https://docs.google.com/spreadsheets/d/1zaiiXTcm5e26T-sU9FoVuSzqlTsONBt4GrHaTGhgsKo/edit?usp=sharing)
This is a link to the Project frontend repository: [![GitHub Frontend part](https://github.com/ann1777/TaskPro-frontend)]
This is a link to the Project frontend deploy page: [![Vercel App](https://task-pro-frontend.vercel.app/)]
This is a link to the Project backend deploy page: [![Render](https://dashboard.render.com/web/srv-cjitbvfjbvhs73clv0fg/deploys/dep-cjqaig0cfp5c73ejq4g0)

## Technologies Used

Here are some of the key technologies and libraries used in this project:

![Node.js](https://img.shields.io/badge/Node.js-14-green) ![Express.js](https://img.shields.io/badge/Express.js-4.18-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-4.4-lightgreen) ![Mongoose](https://img.shields.io/badge/Mongoose-7.4-orange) ![Bcryptjs](https://img.shields.io/badge/Bcrypt-5.1-purple) ![Cloudinary](https://img.shields.io/badge/Cloudinary-1.40-brightgreen) ![Joi](https://img.shields.io/badge/Joi-17.9-lightblue) ![Swagger UI](https://img.shields.io/badge/Swagger%20UI-5.0-maroon) ![Multer](https://img.shields.io/badge/Multer-1.4.5--lts.1-teal) ![Multer Storage Cloudinary](https://img.shields.io/badge/Multer%20Storage%20Cloudinary-4.0-navy) ![Nanoid](https://img.shields.io/badge/Nanoid-3.3.4-orange) ![Nodemailer](https://img.shields.io/badge/Nodemailer-6.9-moccasin) ![CORS](https://img.shields.io/badge/CORS-2.8-indigo) ![Cross-env](https://img.shields.io/badge/Cross--env-7.0-palevioletred) ![Dotenv](https://img.shields.io/badge/Dotenv-16.3-skyblue)

## Requirements

Before getting started with the project, make sure you have the following tools installed on your computer:

- Node.js (version 12 or higher)

## Installation

1. Clone this repository to your local computer.
2. Open the terminal and navigate to the root folder of the project.
3. Run the command `npm install` or `yarn` to install project dependencies.

## Configuration

1. Create a .env file in the project's root folder, based on the .env.example file.
2. Specify the necessary environment variables in this file.

## Server Commands

**npm:**

- `npm start` — Start the server in production mode.
- `npm run start:dev` — Start the server in development mode.
- `npm run lint` — Run code linting using eslint. Perform this before each PR and fix all linting errors.
- `npm run lint:fix` — Similar to lint command, but automatically fixes simple linting errors.

**yarn:**

- `yarn start` — Start the server in production mode.
- `yarn start:dev` — Start the server in development mode.
- `yarn lint` — Run code linting using eslint. Perform this before each PR and fix all linting errors.
- `yarn lint:fix` — Similar to lint command, but automatically fixes simple linting errors.

## API Documentation

For detailed descriptions of API requests and interactions, run this project end open Live Server page in browser [ProTask V1 API docs]

## Project API Queries

https://taskpro-backend-c73a.onrender.com/api <<BASE_URL>>

BASE_URL/auth/signup <<registration>>

BASE_URL/auth/signin <<login>>

BASE_URL/auth/signout <<logout>>

BASE_URL/auth/current <<curent>>

BASE_URL/auth/updatedata <<update name && || avatar(cloud)>>

BASE_URL/auth/update <<update name && || avatar (backend)>>

BASE_URL/auth/updatetheme <<update theme>>

BASE_URL/auth/help <<send help message >>

BASE_URL/dashboard/ <<get all DASHBOARDS, post>>

BASE_URL/dashboard/:dashboardId <<get byID, del byID, updateByID>>

BASE_URL/column/:dashboardId <<get all COLUMNS, post>>

BASE_URL/column/:dashboardId/:columnId <<get byID, del byID, updateByID>>

BASE_URL/card/:columnId <<get all CARDS, post>>

BASE_URL/card/:columnId/:cardId <<get byID, del byID, updateByID>>

## MondoDB

- ![MondoDB link](https://cloud.mongodb.com/v2/64b7c2e1a6ea8e41b4c0e43e#/metrics/replicaSet/64b7c3279e64f96b41b97eec/explorer/task-pro-db)

## Our "JustDoIt" team back-end developers

- [▶️ **Back-end developer:** Dmytro Komurko](https://www.linkedin.com/in/dmytro-komurko-5075a8194)
- [▶️ **Back-end developer:** Angela Potapchuk](https://www.linkedin.com/in/angela-potapchuk/)
