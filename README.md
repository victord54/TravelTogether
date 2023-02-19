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

-   dbname = travel_together
-   user = \_
-   password = \_

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

### Start the local server

```shell
cd frontend
npm install
npm start
```
