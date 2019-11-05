const ShoppingListService = {
  getAllItems(knex) {
    return knex.select('*').from('shopping_list');
  },
  insertItem(knex, newItem) {
    return knex.insert(newItem)
      .into('shopping_list')
      .returning('*')
      .then(rows => rows[0]);
  },
  getById(knex, id) {
    return knex.select('*').from('shopping_list').where({id}).first();
  },
  deleteById(knex, id) {
    return knex.from('shopping_list').where({id}).delete();
  },
  updateById(knex, id, newItemData) {
    return knex.from('shopping_list').where({id}).update(newItemData);
  }
};

module.exports = ShoppingListService;