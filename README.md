Douban for academic notes, a fork of [douban clone](https://github.com/jeneser/douban)

### build frontend
`npm run build`

### build backend
`npx babel lib -d dist && node dist/app.js`

### migrate
```
export NODE_ENV=production
npx sequelize-cli db:migrate
```

### import new resource
```
npx babel-node lib/scripts/import.js ./data_path ./public_path
```
