# Create a scope more than one level away based on a Smart field

**Context:** As a user I want to create a scope on a table that does not have the tag column in the table.

As a user I want to create a scope on related tables more than one level away

**Example:**

The objective is to implement scopes on all tables, filtering on`companies` to make sure that companies can only see their own data. In this example, `companies` has many `departments`, `departments` has many `users`. The company id is not in `users` table but in the `departments` table. We want to scope `users` according to a company value.

### **Step 1: Create a smart field and the filter for the `users` table**

lib/forest\_liana/collections/user.rb

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

### **Step 2: Configure the scope in the UI**

In project settings:

![](<../../.gitbook/assets/image (513).png>)

In the table `users`

![](<../../.gitbook/assets/image (516).png>)
