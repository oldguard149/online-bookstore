# online-bookstore
An online bookstore that using expressjs framework at backend, angular at frontend and a simple recommendation system to recommend similar books.

## Installation

### 1. Install modules
- At /, run 
``` npm install ```
- At /client, run
``` npm install ```

### 2. Import data
1. Create database and modify mysql config information include host, user, password and database's name in /api/config/config.json
2. At /seeder, run
``` node script.js```

## Run servers
- At /, open one terminal and run ```npm start``` to start expressjs server.
- At /client, open other terminal and run ```ng serve``` to start angular server.
- Open a browser and access at <http://localhost:4200>
