var express = require('express');
var router = express.Router();
var connection = require('../database/connection');


router.get('/', function(req, res, next) {
  res.render('home',{title: "Wyatt's Epic Cooking Page", books});
});

/* GET recipe list page. */
router.get('/list', (req, res) => {
  let sql = 'SELECT * FROM recipes';

  connection.query(sql, (err, result) => {
      if (err) throw err;

      // Group recipes by category
      const groupedRecipes = result.reduce((groups, recipe) => {
        const { category } = recipe;
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(recipe);
        return groups;
      }, {});

      res.render('recipe_listing', { title: 'Recipe Inventory', groupedRecipes });
  });
});




/* GET single recipe page */
router.get('/recipe/:id', (req, res) => {
  let recipeId = req.params.id;

  let sql = `
      SELECT r.id, r.name, r.description, r.instructions, r.category, 
             i.name AS ingredient_name, i.info AS ingredient_info
      FROM recipes r
      JOIN recipe_ingredients ri ON r.id = ri.recipe_id
      JOIN ingredients i ON ri.ingredient_id = i.id
      WHERE r.id = ?`;

  connection.query(sql, [recipeId], (err, results) => {
      if (err) throw err;

      if (results.length === 0) {
          return res.status(404).send("Recipe not found");
      }

      let recipe = {
          id: results[0].id,
          name: results[0].name,
          description: results[0].description,
          instructions: results[0].instructions,
          category: results[0].category,
          ingredients: results.map(row => ({
              name: row.ingredient_name,
              info: row.ingredient_info
          }))
      };

      console.log(recipe); // ✅ Log to see if ingredients & info are available

      res.render('select_recipe', { title: recipe.name, recipe });
  });
});


/* Add recipe route */
router.get('/add-recipe', (req, res) => {
  let sql = 'SELECT * FROM ingredients'; 
  connection.query(sql, (err, ingredients) => {
      if (err) throw err;
      res.render('add_recipe', { title: 'Add a New Recipe', ingredients });
  });
});

router.post('/add-recipe', (req, res) => {
  const { name, description, instructions, category, ingredient_ids } = req.body;

  // Insert into recipes table
  let sql = 'INSERT INTO recipes (name, description, instructions, category) VALUES (?, ?, ?, ?)';
  connection.query(sql, [name, description, instructions, category], (err, result) => {
      if (err) throw err;
      const recipeId = result.insertId;

      // Insert into recipe_ingredients table
      if (ingredient_ids && ingredient_ids.length > 0) {
          let values = ingredient_ids.map(id => [recipeId, id]);
          let ingredientSql = 'INSERT INTO recipe_ingredients (recipe_id, ingredient_id) VALUES ?';
          connection.query(ingredientSql, [values], (err) => {
              if (err) throw err;
              res.redirect('/list'); 
          });
      } else {
          res.redirect('/list');
      }
  });
});




const dataToSend = {
  title: "Wyatt's Epic Cooking Website",
  isSpecial: false
}


const books = [
  {title: '1984', author: 'George Orwell'}, 
  {title: 'Physicall Prototyping Physics for Play',author:'Dr. Horn'},
  {title:'Cooperative Softare Development', author:'Amy Ko'}
]

module.exports = router;
