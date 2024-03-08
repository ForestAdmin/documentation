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

# branch

The `forest branch` command is at the center of what your Forest Admin development workflow should look like. As explained on [this page](../using-branches.md), it allows you to manage your UI, a bit like you would use git's branches for your code.

```
$ forest branch --help
Create a new branch or list your existing branches.

USAGE
  $ forest branch [BRANCH_NAME]

ARGUMENTS
  BRANCH_NAME  The name of the branch to create.

OPTIONS
  -d, --delete            Delete the branch.
  -f, --format=table|json [default: table] Output format.
  -o, --origin=origin     Set the origin of the created branch.
  --force                 When deleting a branch, skip confirmation.
  --help                  Display usage information.
  --projectId=projectId   The id of the project to create a branch in.
```

Here are a few extra details on how it works.

The `forest branch` command has 3 uses, depending on how you use it:

- **List** branches
- **Create** branches
- **Delete** branches

### Listing existing branches

To list your existing branches, simply omit any argument to the command:

```
$ forest branch
NAME                    ORIGIN      IS CURRENT  CLOSED AT
feature/new-button      production  ✅
fix-missing-label       staging
feature/remove-tooltip  preprod                 2022-08-19T08:08:47.678Z
```

{% hint style="info" %}
`IS CURRENT` indicates your currently selected branch: your project's UI will locally be displayed according to this branch's layout settings.
{% endhint %}

### Creating a new branch

To create a new branch, append the name of the branch you wish to create after `forest branch`, like so:

```
$ forest branch feature/new-ops-feature --origin production
✅ Switched to new branch: feature/new-ops-feature
```

{% hint style="warning" %}
There is no specific constraint on branch names, though kebab-case is generally used.

However, keep in mind that your branch _name_ must be **unique** in the project.
{% endhint %}

Note that your project must be deployed remotely before you can start using branches:

```
$ forest branch add-refund-action
❌ You cannot create a branch until this project has either a remote or a production environment.
```

Any branch reflects `LayoutChange(s)` (i.e. changes in your UI) that you've made on that branch: to make this possible, a branch needs an **origin**, which is the state of the layout you started from and made those `LayoutChange(s)` on. This is why you need to [have a production environment](../../environments.md#deploying-to-production) (ideally) or simply a remote environment: those environments can serve as origin to your branches.

### Deleting a branch

To delete a branch, simply add the -d option and a branch name to the `forest branch` command:

```
$ forest branch -d hotfix/fix-dropdown-issue
[? Delete branch "hotfix/fix-dropdown-issue"? Y
✅ Branch hotfix/fix-dropdown-issue successfully deleted.
```

{% hint style="info" %}
You will be prompted for confirmation before deleting a branch. To skip that confirmation, use the `--force` option.
{% endhint %}
