# Scopes

### What is a scope?

A scope is a filter which applies to a collection and all its segments.&#x20;

It is useful in that it can be used to control what data is available to users. More specifically, scopes can be set up to filter data dynamically on the current user.

{% hint style="warning" %}
**Scopes** are applied to the entire application excluding global smart actions, API & SQL charts and Collaboration & Activities.
{% endhint %}

### How to set up a scope

To access the scope management page for a given collection, you'll need to [go to that collection's settings page](broken-reference) using the Layout editor mode.&#x20;

![](<../../.gitbook/assets/Capture d’écran 2019-08-13 à 11.54.36.png>)

Once on the Scopes tab **(1)**, you can set up your filter **(2)** and save **(3)**. In the above screenshot, only customers with an email ending with _@forestadmin.com_ will be displayed in the collection **and** all of its segments. All other customers won't be accessible.

### Using a dynamic scope

Imagine a situation where you have several Operations teams each specialized in a specific country's operations:

* _France_ team handles customers from France
* _Germany_ team handles customers from Germany
* ...

![](<../../.gitbook/assets/Capture d’écran 2019-08-21 à 10.34.44.png>)

If you set up the following scope...

![](<../../.gitbook/assets/image (294).png>)

...then Marc who belongs to the _France_ team will only see customers from France.\
However, Louis who belongs to the _Germany_ team will only see customers from Germany.

![After the scope has been set up](<../../.gitbook/assets/image (295).png>)

#### Dynamic variables

In the example above, we used the team name to filter out what the user sees: `$currentUser.team.name`

Here the exhaustive list of available dynamic variables:

| Syntax                       | Result                                                                 |
| ---------------------------- | ---------------------------------------------------------------------- |
| `$currentUser.id`            | The id of the current user                                             |
| `$currentUser.firstName`     | The first name of the current user                                     |
| `$currentUser.lastName`      | The last name of the current user                                      |
| `$currentUser.fullName`      | The full name of the current user                                      |
| `$currentUser.email`         | The email of the current user                                          |
| `$currentUser.team.id`       | The id of the team of the current user                                 |
| `$currentUser.team.name`     | The name of the team of the current user                               |
| `$currentUser.tags.your-tag` | The value associated with key `your-tag` for the current user, if any. |

#### Using user tags

The above example is only possible if your data matches your users' details (email, team, etc). It's likely that it won't always be the case. This is why we've introduced user tags:

![](<../../.gitbook/assets/image (357).png>)

User tags are [set from each user's details page](broken-reference) and allow you to freely associate your users to a value which will match against your data using the `$currentUser.tags.your-tag` dynamic variable:

![](<../../.gitbook/assets/image (358).png>)

Using the above scope, the above user would see **1**, **2** but not **3**:

![](<../../.gitbook/assets/Capture d’écran 2020-04-15 à 18.58.32 copie.png>)
