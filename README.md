## Notes service

A robust API for a notes service using Node.js. The API should allow users to manage notes effectively, incorporated features that enhance the overall user experience.

## Initial steps
1. Install Node.js
```
sudo apt update
sudo apt install nodejs
sudo apt install npm
```
2. Install Mongodb 
Using docker
```
docker pull mongo
docker run -d -p 27017:27017 --name mongodb mongo

```
local installation
```
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/mongodb-archive-keyring.gpg] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

sudo apt update

sudo apt update

sudo systemctl start mongod

```
3. Add .env file on root folder
##

## Getting started 

```
# Add required variables in .env 
PORT=6000
NOTES_DB=mongodb://localhost:27017/notes_db

# install dependencies using
npm install


# To start the server
npm run start

```

## Swagger URI for Endpoints

Test the endpoints using the below URI

```
http://127.0.0.1:6000/api-docs

```