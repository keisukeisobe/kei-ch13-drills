require('dotenv').config();
const knex = require('knex');
const ShoppingListService = require('./shopping-list-service');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});

ShoppingListService.getAllItems(knexInstance)
  .then(() =>
    ShoppingListService.insertItem(knexInstance, {
      name: 'newItem',
      price: '99.99',
      category: 'Main',
      checked: false,
      date_added: new Date()
    })
  )
  .then(newItem => {
    //console.log(newItem);
    return ShoppingListService.updateById(
      knexInstance,
      newItem.id,
      {
        name: newItem.name,
        price: newItem.price,
        category: newItem.category,
        checked: newItem.checked,
        date_added: newItem.date_added
      }
    ).then(() => ShoppingListService.getById(knexInstance, newItem.id));
  })
  .then(article => {
    //console.log(article);
    return ShoppingListService.deleteById(knexInstance, article.id);
  });

