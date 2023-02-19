# TravelTogether

PPIL project to create a carpooling web application

## How to configure the project

### Get the project from github

Pull the project in your www folder

```shell
git pull github
cd TravelTogether
```

### Create the database and the user

The dbname must be **travel_together**.
You can create a user for this db or use the root one.
In the folder that contains script.sql :

```sql
CREATE DATABASE travel_together;
USE travel_together;
SOURCE script.sql;
```

### Create the config files

#### DB config file

```shell
touch backend/dbconnect/dbinfos.php
```

put your db infos in the file like this :

```php
<?php

$login = "your_login";
$password = "your_password";
```

#### API config file

```shell
touch frontend/src/data/url_api.js
```

write your api url infos :

```js
export const url_api = {
    url: "http(s)://domain_to_api_root",
};
```

### Install Node.js

#### For Windows

Download Node.js from https://nodejs.org/en/download/

#### For Linux

```bash
wget -qO- https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### Start the local server

```shell
cd frontend
npm install
npm start
```
