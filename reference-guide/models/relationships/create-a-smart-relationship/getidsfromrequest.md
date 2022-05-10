# GetIdsFromRequest

In recent versions of our agents, you may have noticed a new helper, which is `getIdsFromRequest`. This helper comes alongside the ['Select All' feature](https://docs.forestadmin.com/documentation/how-tos/maintain/upgrade-notes-sql-mongodb/upgrade-to-v6#select-all-feature), allowing you to trigger a Smart Action on more records than those displayed in the UI.

Unfortunately, this helper is not compatible with Smart Actions triggered on Smart Relationships. This is due to the Smart Relationship concept. When you create a [HasMany Smart Relationship](https://docs.forestadmin.com/documentation/reference-guide/relationships/create-a-smart-relationship#creating-a-hasmany-smart-relationship), you become the owner of the way your data are linked together by overriding the routes. Forest can't retrieve the logic to link the data, this is why you also need to code your own `getIdsFromRequest` helper. This documentation will guide you through the steps you need to create your own helper.

Let's take an example to illustrate what we want to achieve:

![](<../../../../.gitbook/assets/image (503).png>)

In this case, with have a HasMany Smart Relationship between `owners` and `articles` called `Liked articles`.  As you can see, we are about to trigger the `Unlike` Smart Action on every article the owner liked that corresponds to the filter and the search we configured.&#x20;

### What is the getIdsFromRequest about?

This helper simply takes a query as a parameter (containing your filters, your search, and some other configuration) and then returns the ids corresponding to this query. In other words, based on what the user selects ('select all', 'select current page', ...) this helper is able to return the exact ids the user wants to operate on. With these ids, your will then be able to perform operations related to your smart actions.

4 cases need to be handled there:

* Select all: each of the related records should be impacted
* Select all, minus some: each of the related records should be impacted, except specific ones
* Select current page: each of the listed records should be impacted
* Select some: only some specific records should be impacted

Only the two first cases need to be handled, because the last two cases consist of a simple list of the ids selected by the user directly in the request. So nothing special to do here.

In conjunction with the previous 4 cases, we also need to handle the filters and the search set up before executing the smart action.&#x20;

### Code Snippet

Please find in the following snippet every of the requirement listed above fulfilled to make the Smart Action work with the Select All feature.

```javascript
// In this function, we want to mimic the getIdsFromRequest behaviour,
// Used in conjunction with the "select all record" feature on a smart relationship
async function customGetIdsFromRequest(request) {
  const {
    all_records,
    all_records_ids_excluded,
    parent_collection_id: parentRecordId,
    all_records_subset_query,
    ids,
  } = request.body.data.attributes;

  if (all_records) {
    // In this case, the "select all records" option has been selected.
    // This means that the action we want to trigger needs to be performed
    // On every record
    const options = {
      where: {
        owners_id: parentRecordId,
      },
      attributes: ['id'],
      raw: true,
    }

    // Handle filters on records if any
    if (all_records_subset_query && all_records_subset_query.filters) {
      const filter = await parseFilter(
        JSON.parse(all_records_subset_query.filters),
        Schemas.schemas.articles,
        request.query.timezone
      );

      options.where = { ...options.where, ...filter };
    }

    // Handle the search if any
    if (all_records_subset_query.search) {
      if (options.where.body) {
        options.where.body[Op.like] = all_records_subset_query.search;
      } else {
        options.where.body = { [Op.like]: all_records_subset_query.search };
      }
    }

    if (all_records_ids_excluded && all_records_ids_excluded.length) {
      // In this case, the "select all records" option has been selected but some records
      // has been unselected right after. This means that the action we want to trigger
      // needs to be performed on every relationship, except some specific one
      options['where']['id'] = {
        [Op.notIn]: all_records_ids_excluded
      };
    }

    return (await articles.findAll(options)).map((record) => record.id);
  }

  // In any other cases, the ids selected to perform the
  // smart action on are listed in the "ids" attribute
  return ids;
}

router.post('/actions/Unlike', permissionMiddlewareCreator.smartAction(), async (request, response, next) => {
  const ids = await customGetIdsFromRequest(request);

  // Do whatever you want with the ids here

  response.status(200).send();
})
```

Explanation of the code:

* Line 1: If the Select All feature has been used, we need to build a query to concatenate the filter, the search, and the Select All configuration. Otherwise, the ids are already present in the query (see line 58)
* Line 25: Here is an example to show you how to quickly handle filters, if any
* Line 36: Here is an example to show you how to handle the search, if any
* Line 44: Finally, this snippet of code removes any ids that have been unselected by the user after using the Select All feature.
