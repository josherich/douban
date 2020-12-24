Douban for academic notes, a fork of [douban clone](https://github.com/jeneser/douban)

## Get Started

### 1. Prepare DB
```
# install postgresql 
brew install postgresql
psql postgre
CREATE USER {user_name};
CREATE DATABASE academiadoc;
```

### 1. build backend
```
cd backend
npx babel lib -d dist
node dist/app.js
```

### 2. build frontend
`npm run dev` or `npm run build` on production

---

### Run migration
```
export NODE_ENV=production
npx sequelize-cli db:migrate
```

