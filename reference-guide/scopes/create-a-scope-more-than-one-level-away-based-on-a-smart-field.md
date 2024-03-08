{% hint style="warning" %}
Please be sure of your agent type and version and pick the right documentation accordingly.
{% endhint %}

{% tabs %}
{% tab title="Node.js" %}
{% hint style="danger" %}
This is the documentation of the `forest-express-sequelize` and `forest-express-mongoose` Node.js agents that will soon reach end-of-support.

`forest-express-sequelize` v9 and `forest-express-mongoose` v9 are replaced by [`@forestadmin/agent`](https://docs.forestadmin.com/developer-guide-agents-nodejs/) v1.

Please check your agent type and version and read on or switch to the right documentation.
{% endhint %}
{% endtab %}

{% tab title="Ruby on Rails" %}
{% hint style="success" %}
This is still the latest Ruby on Rails documentation of the `forest_liana` agent, you’re at the right place, please read on.
{% endhint %}
{% endtab %}

{% tab title="Python" %}
{% hint style="danger" %}
This is the documentation of the `django-forestadmin` Django agent that will soon reach end-of-support.

If you’re using a Django agent, notice that `django-forestadmin` v1 is replaced by [`forestadmin-agent-django`](https://docs.forestadmin.com/developer-guide-agents-python) v1.

If you’re using a Flask agent, go to the [`forestadmin-agent-flask`](https://docs.forestadmin.com/developer-guide-agents-python) v1 documentation.

Please check your agent type and version and read on or switch to the right documentation.
{% endhint %}
{% endtab %}

{% tab title="PHP" %}
{% hint style="danger" %}
This is the documentation of the `forestadmin/laravel-forestadmin` Laravel agent that will soon reach end-of-support.

If you’re using a Laravel agent, notice that `forestadmin/laravel-forestadmin` v1 is replaced by [`forestadmin/laravel-forestadmin`](https://docs.forestadmin.com/developer-guide-agents-php) v3.

If you’re using a Symfony agent, go to the [`forestadmin/symfony-forestadmin`](https://docs.forestadmin.com/developer-guide-agents-php) v1 documentation.

Please check your agent type and version and read on or switch to the right documentation.
{% endhint %}
{% endtab %}
{% endtabs %}

# Create a scope more than one level away based on a Smart field

**Context:** As a user I want to create a scope on a table that does not have the tag column in the table.

As a user I want to create a scope on related tables more than one level away

**Example:**

The objective is to implement scopes on all tables, filtering on`companies` to make sure that companies can only see their own data. In this example, `companies` has many `departments`, `departments` has many `users`. The company id is not in `users` table but in the `departments` table. We want to scope `users` according to a company value.

### **Step 1: Create a smart field and the filter for the `users` table**

{% tabs %}
{% tab title="SQL" %}
{% code title="forest/users.js" %}

```javascript
const { collection } = require('forest-express-sequelize');
const { users, departments, companies } = require('../models');
const models = require('../models');
const { Op } = models.objectMapping;

collection('users', {
  actions: [],
  fields: [
    {
      field: 'company name',
      isFilterable: true,
      type: 'String',
      get: async (user) => {
        //We are looking for the company name of the user (user belongs to a department that belongs to a company)
        const company = await companies.findOne({
          attributes: ['name'],
          include: {
            required: true,
            model: departments,
            where: { id: user.departmentId },
          },
        });

        return company.name;
      },
      filter: async ({ condition: { value, operator } }) => {
        switch (operator) {
          case 'equal':
            //We are looking for all the users ids that have a company name equal to the condition value
            const queryToFindUsers = await users.findAll({
              attributes: ['id'],
              include: [
                {
                  required: true,
                  model: departments,
                  include: [
                    {
                      required: true,
                      model: companies,
                      where: { name: { [Op.eq]: value } },
                    },
                  ],
                },
              ],
            });
            //We map this array of objects to retrieve the user ids
            const userIds = queryToFindUsers.map((user) => user.id);
            return { id: { [Op.in]: userIds } };
          default:
            return null;
        }
      },
    },
  ],
  segments: [],
});
```

{% endcode %}
{% endtab %}

{% tab title="Rails" %}
{% code title="lib/forest_liana/collections/user.rb" %}

```ruby
class Forest::Customer
    include ForestLiana::Collection

    collection :User

    filter_company = lambda do |condition, where|
        company_value = condition['value']
        case condition['operator']
        when 'equal'
            "users.id IN (SELECT users.id
            FROM users
            JOIN departments ON departments.id = users.department_id
            JOIN companies ON companies.id = departments.company_id
            WHERE companies.name = '#{company_value}')"
        end
    end

    field :company, type: 'String', is_filterable: true, filter: filter_company do
      company = User.find(object.id).department.company
      "#{company.name}"
    end
end
```

{% endcode %}
{% endtab %}

{% tab title="Laravel" %}
{% code title="app/Models/User.php" %}

```php
<?php

namespace App\Models;

use ForestAdmin\LaravelForestAdmin\Services\Concerns\ForestCollection;
use ForestAdmin\LaravelForestAdmin\Services\SmartFeatures\SmartField;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class User extends Model
{
    use HasFactory;
    use ForestCollection;

    /**
     * @return SmartField
     */
    public function company(): SmartField
    {
        return $this->smartField(['type' => 'String'])
            ->get(function() {
                $company = Company::whereHas('departments', fn($query) => $query->where('departments.id', $this->department->id))->first();
                return $company->name;
            })
            ->filter(
                function (Builder $query, $value, string $operator, string $aggregator) {
                    switch ($operator) {
                        case 'equal':
                            $query
                                ->whereIn('users.id', function ($q) use ($value, $aggregator) {
                                    return $q
                                        ->select('users.id')
                                        ->from('companies')
                                        ->join('departments', 'departments.company_id', '=', 'companies.id')
                                        ->join('users', 'users.department_id', '=', 'departments.id')
                                        ->whereRaw("LOWER (companies.name) LIKE LOWER(?)", ['%' . $value . '%'], $aggregator);
                                });
                            break;
                        default:
                            throw new ForestException(
                                "Unsupported operator: $operator"
                            );
                    }

                    return $query;
                }
            );
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
}
```

{% endcode %}
{% endtab %}
{% endtabs %}

### **Step 2: Configure the scope in the UI**

In project settings:

![](<../../.gitbook/assets/image (513).png>)

In the table `users`

![](<../../.gitbook/assets/image (516).png>)
