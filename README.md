# TravelTogether

PPIL project to create a carpooling web application
## How to configure WAMP
### Create a Vhost
![image](https://user-images.githubusercontent.com/73916045/221879737-1328a310-cc92-45bb-bb6f-c7f154cc791f.png)
In "Nom du Virtual Host" write the name of the api : api-traveltogether

Write the path in the second field to the index.php file. (.../www/TravelTogether/backend).

Leave the last field empty.

Follow the instructions with DNS reload.

### Check the Apache modules
![image](https://user-images.githubusercontent.com/73916045/221881307-1ee17f31-02c3-42d4-9a5e-ed6b0bc0c002.png)

Restart WAMP if rewrite_module was disabled.

## How to configure XAMPP
### Linux
#### check httpd-vhost conf
```shell
sudo gedit /opt/lampp/etc/httpd.conf
```
Check at the line 487-488 and uncomment the line with the Include.

You have to get this line
```
# Virtual hosts
Include etc/extra/httpd-vhosts.conf
```
Restart XAMPP

#### Create custom DNS
Open the hosts file
```shell
sudo gedit /etc/hosts
```
Write the name of your domain like *api-traveltogether*
```
127.0.0.1	api-traveltogether
```

#### Create the Virtual Host
Go to the httpd-vhost file :
```
sudo gedit /opt/lampp/etc/extra/httpd-vhosts.conf
```
At the end of the file paste these lines :

```vhost
<VirtualHost *>
    DocumentRoot "le chemin jusqu'au fichier index.php"
    ServerName api-traveltogether
    
    <Directory "le chemin jusqu'au fichier index.php">
        Order allow,deny
        Allow from all
        Require all granted
    </Directory>
</VirtualHost>
```
Restart XAMPP

Now you can acces to api from http://api-traveltogether/

### Windows
#### Create the custom domain
Open cmd in Admin
Open this file with notepad.exe
```
notepad.exe \drivers\etc\hosts
```

Add this line at the end :
```
127.0.0.1 api-traveltogether
```
Save and quit notepad

#### Config Apache hosts
Open the file httpd-vhosts.conf at
```
C:\xampp\apache\conf\extra\httpd-vhosts.conf
```

Add these lines :
```vhost
<VirtualHost *>
    DocumentRoot "le chemin jusqu'au fichier index.php"
    ServerName api-traveltogether
    
    <Directory "le chemin jusqu'au fichier index.php">
        Order allow,deny
        Allow from all
        Require all granted
    </Directory>
</VirtualHost>
```
Save the file and restart XAMPP.

Now you can acces to api from http://api-traveltogether/

## How to configure the project

### Get the project from github
Pull the project in your www folder

```shell
git pull github
cd TravelTogether
```

### Create the database and the user

You must be in the folder containing the script.

```sql
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
    url: "http://domain_to_api_root",
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
