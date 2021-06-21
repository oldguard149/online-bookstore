# online-bookstore
An online bookstore that using express, angular, angular material and a simple recommendation model to recommend similar books.

## Installation

### 1. Install modules
- In ```/```, run 
``` npm install ```
- In ```/client```, run
``` npm install ```

### 2. Import data
1. Create a database and modify mysql config information including host, user, password and database's name in ```/api/config/config.json
2. In ```/seeder```, run
``` node script.js```

### 3. Fetch recommendation-model submodule
- In ```/```, run
```
git submodule init
git submodule update
```

### 4. Authentication config
In the root directory, create a file name ```.env``` and add the line below
```jwt_secret=fill_in_jwt_secret```
where fill_in_jwt_secret is a random string you like

## Run servers
- In ```/```, open one terminal and run ```npm start``` to start express server.
- In ```/client```, open other terminal and run ```ng serve``` to start angular
- In ```/book-recommendation-model```, use one terminal and run ```python wsgi.py``` to start recommendation server
- Open a browser and navigate to <http://localhost:4200>

Use account with email ```admin@admin.com``` and password ```admin``` for management tasks.