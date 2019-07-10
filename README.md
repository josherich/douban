Douban for academic notes, a fork of [douban clone](https://github.com/jeneser/douban)

### build frontend
`npm run build`

### build backend
`npx babel lib -d dist && node dist/app.js`

### migrate
`npx sequelize-cli db:migrate`
