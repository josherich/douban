import 'dotenv/config';
import '@babel/polyfill';

var express = require('express')
var config = require('./config/config')
import models, { sequelize } from './app/models';

var app = express()

module.exports = require('./config/express')(app, config)

const eraseDatabaseOnSync = false;
const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: 'abc',
      email: 'abc@gmail.com',
      password: '96e79218965eb72c92a549dd5a330112'
    },
  );
  await models.Doc.create(
    {
      "title": "The Probablistic Method",
      "author": ["Andrew Lin"],
      "rating": 7,
      "uri": "https://www.dropbox.com/sh/vkexrfecjdgej9j/AADxKV1NEiQuTDhuXVqdJm7ra?dl=0&preview=all-notes-up-to-spring-break.pdf",
      "publisher": "MIT",
      "category": "Math",
      "image": null,
      "isbn10": null,
      "isbn13": null,
      "pubdate": null,
      "summary": "",
      "pages": "0",
      "price": 0,
      "userId": 1
    }
  );
  await models.Doc.create(
    {
      "title": "Concentration of Markov chains with bounded moments",
      "author": ["Assaf Naor", "Shravas Rao", "Oded Regev"],
      "rating": 7,
      "uri": "https://arxiv.org/pdf/1906.07260",
      "arxivId": "1906.07260",
      "publisher": "arxiv",
      "category": "Math",
      "image": null,
      "isbn10": null,
      "isbn13": null,
      "pubdate": null,
      "summary": "Let {Wt}∞t=1 be a finite state stationary Markov chain, and suppose that f is a real-valued function on the state space. If f is bounded, then Gillman's expander Chernoff bound (1993) provides concentration estimates for the random variable f(W1)+⋯+f(Wn) that depend on the spectral gap of the Markov chain and the assumed bound on f. Here we obtain analogous inequalities assuming only that the q'th moment of f is bounded for some q≥2. Our proof relies on reasoning that differs substantially from the proofs of Gillman's theorem that are available in the literature, and it generalizes to yield dimension-independent bounds for mappings f that take values in an Lp(μ) for some p≥2, thus answering (even in the Hilbertian special case p=2) a question of Kargin (2007).",
      "pages": "0",
      "price": 0,
      "userId": 1
    }
  );
};

sequelize.sync({ force: eraseDatabaseOnSync }).then(() => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages();
  }
  app.listen(config.port, function () {
    console.log('Express server listening on port ' + config.port)
  })
});
