const knex = require('knex');
require('dotenv').config();

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

function getAllItemsWithText(searchTerm) {
  knexInstance
    .select('id', 'name', 'price', 'category')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result);
    });
}

//getAllItemsWithText('Pizza');

function paginateProducts(pageNumber){
  const productsPerPage = 6;
  const offset = productsPerPage * (pageNumber - 1);
  knexInstance
    .select('id', 'name', 'price', 'category')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result);
    });
}

//paginateProducts(3);

function getItemsAfterDate(daysAgo){
  knexInstance
    .select('id', 'name', 'price', 'category', 'date_added')
    .where(
      'date_added', 
      '>',
      knexInstance.raw('now() - \'?? days\'::INTERVAL', daysAgo)
    )
    .from('shopping_list')
    .then(result=> {
      console.log(result);
    });
}

//getItemsAfterDate(3);

function getTotalCost() {
  knexInstance
    .select('category')
    .sum('price')
    .groupBy('category')
    .orderBy('sum', 'desc')
    .from('shopping_list')
    .then(result => {
      console.log(result);
    });
}

getTotalCost();