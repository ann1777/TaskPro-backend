# TaskPro-backend

Project Layout: [https://www.figma.com/file/yRrel7KUKlBkO3pYa7kWqR/QuizMaster?type=design&node-id=0%3A1&mode=design&t=eavwxuklWNZuRV15-1]
Project terms of reference: [https://docs.google.com/spreadsheets/d/1zaiiXTcm5e26T-sU9FoVuSzqlTsONBt4GrHaTGhgsKo/edit?usp=sharing]

API

https://taskpro-backend-c73a.onrender.com/api <<BASE_URL>>

BASE_URL/auth/signup <<registration>>
BASE_URL/auth/signin <<login>>
BASE_URL/auth/signout <<logout>>
BASE_URL/auth/current <<curent>>
BASE_URL/auth/updatedata <<update name && || avatar(cloud)>>
BASE_URL/auth/update <<update name && || avatar (backend)>>

BASE_URL/dashboard/ <<get all DASHBOARDS, post>>
BASE_URL/dashboard/:dashboardId <<get byID, del byID, updateByID>>

BASE_URL/column/:dashboardId <<get all COLUMNS, post>>
BASE_URL/column/:dashboardId/:columnId <<get byID, del byID, updateByID>>

BASE_URL/card/:columnId <<get all CARDS, post>>
BASE_URL/card/:columnId/:cardId <<get byID, del byID, updateByID>>
