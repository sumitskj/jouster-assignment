**Setup**

To run using Docker, use following commands:

`docker-compose build`

`docker-compose up`

To run apps individually:
You need postgres and poetry locally installed.

For Backend run command:

`poetry install`

`make run`

For Fontend run command:

`npm install`

`npm run dev`


**Overview:**

For backend FastAPI app, I have used a layered architecture which gives me clear seperation of concern and makes the code modular and extensible. There is presentation layer in router folder, Business Logic Layer in services and Data Access Layer entities folder.
I have chosen Tortoise ORM apart from the regular required libraries. I chose that because it's async-first and can handle large number of concurrent db connections easily. Apart from that used poetry and makefile for easy dependecy management and development.

For frontend, I have used ReactJs app with tailwindcss, because I am very much proficient with ReactJs and its very quick style app using tailwindcss. Apart from that code is modular with components and services in each different folder.

**Tradeoffs I made due to time limits:**
1. I could have added pagination in GET search results feature.