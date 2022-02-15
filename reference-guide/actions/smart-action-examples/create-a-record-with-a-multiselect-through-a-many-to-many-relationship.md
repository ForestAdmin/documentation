# Create a record with a multiselect through a many-to-many relationship

**Context:** In this case, a card has many expense categories through a many to many relationships, using a join table (card expense categories). We want to be able to create a card, selecting the categories, and creating the card expense categories at the same time.

**Implementation:**

We will use a [smart action](../create-and-manage-smart-actions/) form with a hook to retrieve the categories as values for the multi select.

Then we implement the creation of cards and expenseCategories in the form.

`forest/cards.js`

```jsx
const { collection } = require('forest-express-sequelize');
const { expenseCategories } = require('../models');

// This file allows you to add to your Forest UI:
// - Smart actions: <https://docs.forestadmin.com/documentation/reference-guide/actions/create-and-manage-smart-actions>
// - Smart fields: <https://docs.forestadmin.com/documentation/reference-guide/fields/create-and-manage-smart-fields>
// - Smart relationships: <https://docs.forestadmin.com/documentation/reference-guide/relationships/create-a-smart-relationship>
// - Smart segments: <https://docs.forestadmin.com/documentation/reference-guide/segments/smart-segments>
collection('cards', {
  actions: [{
    name: "Create card",
    type: 'global',
    fields: [{
      field: "name",
      type: "String",
      isRequired: true,
    },
    {
      field: "user",
      type: "Number",
      reference: "users.id",
      isRequired: true,
    },
    {
      field: "categories",
      type: ['Enum'],
    }
  ],
    hooks: {
      load: async ({ fields, request }) => {
        const categories = fields.find(field => field.field === 'categories');
        categories.enums = await expenseCategories.findAll({raw: true}).map(category => category.title);
        return fields;
      },
    }
  }],
  fields: [],
  segments: [],
  
});
```

`routes/cards.js`

```jsx
const express = require('express');
const { PermissionMiddlewareCreator } = require('forest-express-sequelize');
const { cards, cardExpenseCategories, expenseCategories } = require('../models');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('cards');

// This file contains the logic of every route in Forest Admin for the collection cards:
// - Native routes are already generated but can be extended/overriden - Learn how to extend a route here: <https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/extend-a-route>
// - Smart action routes will need to be added as you create new Smart Actions - Learn how to create a Smart Action here: <https://docs.forestadmin.com/documentation/v/v6/reference-guide/actions/create-and-manage-smart-actions>

//...

//Smart action - Create a card
router.post('/actions/create-card', permissionMiddlewareCreator.smartAction(), (req, res) => {
  let attrs = req.body.data.attributes.values;
  categories_attrs = attrs['categories'];
  attrs = { name: attrs['name'], userId: attrs['user'] };
 
  return cards
    .create(attrs)
    .then((card) => {
      categories_attrs.forEach((category) => {
        return expenseCategories.findOne({ where: { title: category } })
        .then(expenseCategory => cardExpenseCategories.create({cardId: card.id, expenseCategoryId: expenseCategory.id})) 
      })
    })
    .then(() => {
      res.send({ success: 'Your card is created!', refresh: { relationships: ['cardExpensesCategories'] },});
  });
});
```

### Rails version:

`lib/forest_liana/collections/card.rb`

```jsx
class Forest::Card
    include ForestLiana::Collection
    collection :Card
    
    action 'Create Card', 
        type: 'global', 
        fields: [{
            field: "name",
            type: "String",
            isRequired: true,
        },
        {
            field: "user",
            type: "Number",
            reference: "User.id",
            isRequired: true,
        },
        {
            field: "company",
            type: "Number",
            reference: "Company.id",
            isRequired: true,
        },
        {
            field: "vendor",
            type: "Number",
            reference: "Vendor.id",
            isRequired: true,
        },
        {
            field: "categories",
            type: ['Enum'],
        }
        ],
        :hooks => {
            :load => -> (context) {
                categories = context[:fields].find{|field| field[:field] == 'categories'}
                categories[:enums] = ExpenseCategory.all.pluck(:title)
                return context[:fields]
            }
        }
end
```

`config/routes.rb`

```jsx
Rails.application.routes.draw do
  ...
  namespace :forest do
    post '/actions/create-card' => 'cards#create_card'
  end
  mount ForestLiana::Engine => '/forest'
end
```

`controllers/forest/cards_controller.rb`

```jsx
class Forest::CardsController < ForestLiana::SmartActionsController
    def create_card
        attrs = params.dig('data', 'attributes', 'values')
        categories_attrs = attrs['categories'];
        attrs = { name: attrs['name'], user_id: attrs['user'], company_id: attrs['company'], vendor_id: attrs['vendor'] };

        card = Card.create(attrs)
        categories_attrs.each do|category| 
            expense_category = ExpenseCategory.find_by(title: category)
            card_expense_category = CardExpenseCategory.create(card_id: card.id, expense_category_id: expense_category.id)
        end

        render json: { success: 'Your card has been created.' }
    end
end
```
