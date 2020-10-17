# coderooms-backend
backend source for coderooms


## Install dependencies
```
npm install
```

## Set following environment files in `.env` file in the root directory
```
HE_SECRET_KEY="<hackerearth secret key>"
MONGODB_URI="<Mongo db URI>"
NODE_ENV="<development/production>"
PORT="<PORT>"
SECRET="<SERECT KEY>"
```

## Run the application in development mode
```
npm run dev
```

## coderooms uses peerjs for peer-to-peer video chat

```
npm install -g peer
peerjs --port 9000
```