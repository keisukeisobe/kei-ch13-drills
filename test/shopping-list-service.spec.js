const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');

describe('ShoppingListService object', function() {
  let db;
  let testItems = [
    {
      id: 1,
      name: 'Hot Dogs',
      price: '15.00',
      category: 'Main',
      checked: false,
      date_added: new Date()
    },
    {
      id: 2,
      name: 'Hamburgers',
      price: '20.00',
      category: 'Lunch',
      checked: false,
      date_added: new Date()
    },
    {
      id: 3,
      name: 'Baked Beans',
      price: '10.00',
      category: 'Breakfast',
      checked: true,
      date_added: new Date()
    }
  ];
  //set up database
  before ( () => {
    db = knex( {
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
  });
  //empty database
  before( () => db('shopping_list').truncate());
  //after each test, empty database
  afterEach( () => db('shopping_list').truncate());
  //destroy?
  after( () => db.destroy() );
  context('given shopping_list has data', () => {
    //before each test in this block, add test items
    beforeEach( () => db.into('shopping_list').insert(testItems));
    it('getAllItems() resolves all items from shopping_list', () => {
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql(testItems);
        });
    });
    it('getById() resolves an item by id from shopping_list', () => {
      const thirdId = 3;
      const thirdItem = testItems[thirdId - 1];
      return ShoppingListService.getById(db, thirdId)
        .then(actual => {
          expect(actual).to.eql({
            id: thirdId,
            name: thirdItem.name,
            price: thirdItem.price,
            category: thirdItem.category,
            checked: thirdItem.checked,
            date_added: thirdItem.date_added
          });
        });
    });
    it('deleteById() removes an item by id from shopping_list', () => {
      const itemId = 3;
      return ShoppingListService.deleteById(db, itemId)
        .then( () => ShoppingListService.getAllItems(db))
        .then(actual => {
          expect(actual).to.eql(testItems.filter(item => item.id !== itemId));
        });
    });
    it('updateById() updates an item from shopping_list', () => {
      const idToUpdate = 3;
      const newItemData = {
        name: 'Unbaked Beans',
        price: '20.00',
        category: 'Lunch',
        checked: false,
        date_added: new Date()
      };
      return ShoppingListService.updateById(db, idToUpdate, newItemData)
        .then( () => ShoppingListService.getById(db,idToUpdate))
        .then( item => {
          expect(item).to.eql({
            id: idToUpdate,
            name: newItemData.name,
            price: newItemData.price,
            category: newItemData.category,
            checked: newItemData.checked,
            date_added: newItemData.date_added
          });
        });
    });
  });
  context('given shopping_list has no data', () => {
    it('getAllItems() resolves an empty array', () => {
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql([]);
        });
    });
    it('insertItem() inserts a new item and resolves the new item with an id', () => {
      const newItem = {
        name: 'Unbaked Beans',
        price: '20.00',
        category: 'Lunch',
        checked: false,
        date_added: new Date()
      };
      return ShoppingListService.insertItem(db, newItem)
        .then(actual => {
          expect(actual).to.eql( {
            id: 1,
            name: newItem.name,
            price: newItem.price,
            category: newItem.category,
            checked: newItem.checked,
            date_added: newItem.date_added
          });
        });
    });
  });
});