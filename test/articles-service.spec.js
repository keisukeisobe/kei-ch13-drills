const ArticlesService = require('../src/articles-service');
const knex = require('knex');

describe('Articles service object', function() {
  let db;
  let testArticles = [
    {
      id: 1,
      title: 'First test post!',
      date_published: new Date(),
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
    },
    {
      id: 2,
      title: 'Second test post!',
      date_published: new Date(),
      content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.'
    },
    {
      id: 3,
      title: 'Third test post!',
      date_published: new Date(),
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.'
    }];
  before( () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
  });
  before( () => db('blogful_articles').truncate());
  afterEach(() => db('blogful_articles').truncate());
  describe('getAllArticles()', () => {
    context('given blogful_articles has data', () => {
      beforeEach( () => {
        return db.into('blogful_articles').insert(testArticles);
      });
      it('getAllArticles() resolves all articles from blogful_articles', () => {
        return ArticlesService.getAllArticles(db)
          .then(actual => {
            expect(actual).to.eql(testArticles);
          });
      });
      it('getById() resolves an article by id from blogful_articles table', () => {
        const thirdId = 3;
        const thirdTestArticle = testArticles[thirdId - 1];
        return ArticlesService.getById(db, thirdId)
          .then(actual => {
            expect(actual).to.eql({
              id: thirdId,
              title: thirdTestArticle.title,
              content: thirdTestArticle.content,
              date_published: thirdTestArticle.date_published
            });
          });
      });
      it('deleteArticle() removes an article by id blogful_articles table', () => {
        const articleId = 3;
        return ArticlesService.deleteArticle(db, articleId)
          .then( () => ArticlesService.getAllArticles(db))
          .then(allArticles => {
            const expected = testArticles.filter(article => article.id !== articleId);
            expect(allArticles).to.eql(expected);
          });
      });
      it('updateArticle() updates an article from the blogful_articles table', () => {
        const idOfArticleToUpdate = 3;
        const newArticleData= {
          title: 'updated title',
          content: 'updated content',
          date_published: new Date(),
        };
        return ArticlesService.updateArticle(db, idOfArticleToUpdate, newArticleData)
          .then( () => ArticlesService.getById(db, idOfArticleToUpdate))
          .then(article => {
            expect(article).to.eql({
              id: idOfArticleToUpdate,
              title: newArticleData.title,
              content: newArticleData.content,
              date_published: newArticleData.date_published
            });
          });
      });
    });
    context('given blogful_articles has no data', () => {
      it('getallarticles() resolves an empty array', () => {
        return ArticlesService.getAllArticles(db)
          .then(actual => {
            expect(actual).to.eql([]);
          });
      });
      it('insertArticle() inserts a new article and resolves the new article with an id', () => {
        const newArticle = {
          title: 'Test new title',
          content: 'Test new content',
          date_published: new Date()
        };
        return ArticlesService.insertArticle(db, newArticle)
          .then(actual => {
            expect(actual).to.eql({
              id: 1,
              title: newArticle.title,
              content: newArticle.content,
              date_published: newArticle.date_published
            });
          });
      });
    });
    after( () => {
      return db.destroy();
    });
  });
});