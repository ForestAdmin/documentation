# Another example



For the purpose of this example let's say we have an `activity-logs` index in Elasticsearch with the following mapping.

```javascript
{
  "mappings": {
    "_doc": {
      "dynamic": "strict",
      "properties": {
        "action": {
          "type": "keyword"
        },
        "label": {
          "type": "text",
          "index_options": "docs",
          "norms": false
        },
        "userId": {
          "type": "keyword"
        },
        "collectionId": {
          "type": "keyword"
        },
        "createdAt": {
          "type": "date"
        }
      }
    }
  }
}
```

## Creating the Smart Collection with related data

First, we declare the `activity-logs` collection in the `forest/` directory.

In this Smart Collection, we want to display for each activity log its action, the label (in a field description), the **related user** that made the activity, the collectionId on which the activity was made and the date the activity was made by the user.

You can check out the list of [available field options](https://docs.forestadmin.com/documentation/reference-guide/fields/create-and-manage-smart-fields#available-field-options) if you need them for your own case.

{% code title="/forest/activity-logs.js" %}
```javascript
const { collection } = require('forest-express-sequelize');
const models = require('../models');

collection('activity-logs', {
  isSearchable: false,
  fields: [{
    field: 'id',
    type: 'string',
  }, {
    field: 'action',
    type: 'Enum',
    isFilterable: true,
    enums: [
      'create',
      'read',
      'update',
      'delete',
      'action',
      'search',
      'filter'],
  }, {
    field: 'label',
    type: 'String',
    isFilterable: true,
  }, {
    field: 'collectionId',
    type: 'String',
    isFilterable: true,
  }, {
    field: 'userId',
    type: 'String',
    isFilterable: true,
  }, {
    field: 'createdAt',
    type: 'Date',
    isFilterable: true,
  }, {
    field: 'user',
    type: 'Number',
    reference: 'users.id',
    get: async (activityLog) => {
      // For search queries, the user is already loaded for performance reasons
      if (activityLog.user) { return activityLog.user; }
      if (!activityLog.userId) { return null; }

      return models.users.findOne({
        attributes: ['id', 'firstName', 'lastName', 'email'],
        paranoid: false,
        where: {
          id: activityLog.userId,
        },
      });
    },
  }, {
    field: 'user_email',
    type: 'String',
    isFilterable: true,
    get: (activityLog) => {
      // The field is declared after, when processed, the user has already been retrieved
      return activityLog.user.email;
    },
  }
  ],
});

```
{% endcode %}

## Implementing the GET (all records with a filter on related data)

This is a complex use case: How to handle filters on related data. We want to be able to filter using the  `user.mail` field.\
\
To accommodate you we already provide you a simple service [`ElasticsearchHelper`](https://docs.forestadmin.com/woodshop/how-tos/create-a-smart-collection-with-elasticsearch/elasticsearch-service-utils) that handles all the logic to connect with your Elasticsearch data.

{% code title="routes/activity-logs.js" %}
```javascript
const express = require('express');
const router = express.Router();

const models = require('../models');

// We need parseFilter utils to create the where clause for sequelize
const { RecordSerializer, Schemas, parseFilter } = require('forest-express-sequelize');

const ElasticsearchHelper = require('../service/elasticsearch-helper');
const { FIELD_DEFINITIONS } = require('../utils/filter-translator');

const serializer = new RecordSerializer({ name: 'es-activity-logs' });

// Custom mapping function
function mapActivityLog(id, source) {
  const {
    createdAt,
    ...simpleProperties
  } = source;

  return {
    id,
    ...simpleProperties,
    createdAt: source.createdAt ? new Date(source.createdAt) : null,
  };
}

const configuration = {
  index: 'activity-logs-*',
  filterDefinition: {
    action: FIELD_DEFINITIONS.keyword,
    label: FIELD_DEFINITIONS.text,
    collectionId: FIELD_DEFINITIONS.keyword,
    userId: FIELD_DEFINITIONS.keyword,
    createdAt: FIELD_DEFINITIONS.date,
  },
  mappingFunction: mapActivityLog,
  sort: [
    { createdAt: { order: 'desc' } },
  ],
}

const elasticsearchHelper = new ElasticsearchHelper(configuration);

// Specific implementation to handle related data
async function computeUserFilter(models, filter, options) {
  const where = await parseFilter({
    ...filter,
    field: filter.field.replace('user_', ''),
  }, Schemas.schemas.users, options.timezone);

  const users = await models.users.findAll({
    where,
    attributes: ['id'],
    paranoid: false,
  });

  return { operator: 'equal', field: 'userId', value: users.map((user) => user.id) };
}

async function computeFilterOnRelatedEntity(models, options, filter) {
  if (filter.field === 'user_email') {
    return computeUserFilter(models, filter, options);
  }

  return filter;
}

async function computeFiltersOnRelatedEntities(models, filters, options) {
  if (!filters) {
    return undefined;
  }

  if (!filters.aggregator) {
    return computeFilterOnRelatedEntity(models, options, filters);
  }

  return {
    ...filters,
    conditions: await Promise.all(filters.conditions.map(
      computeFilterOnRelatedEntity.bind(undefined, models, options),
    )),
  };
}

router.get('/es-activity-logs', async (request, response, next) => {
  try {
    const pageSize = Number(request?.query?.page?.size) || 20;
    const page = Number(request?.query?.page?.number) || 1;
    const options = { timezone: request.query?.timezone };

    let filters;
    try {
      filters = request.query?.filters && JSON.parse(request.query.filters);
    } catch (e) {
      filters = undefined;
    }

    const filtersWithRelatedEntities = await computeFiltersOnRelatedEntities(models, filters, options);

    const result = await elasticsearchHelper.functionSearch({
      page,
      pageSize,
      filters: filtersWithRelatedEntities || undefined,
      options,
    });

    response.send({
      ...await serializer.serialize(result.results),
      meta: {
        count: result.count,
      }
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
```
{% endcode %}

## Implementing the GET (all records with the search)

Another way to search through related data is to implement your own search logic.

{% code title="routes/activity-logs.js" %}
```javascript
const express = require('express');
const router = express.Router();

const models = require('../models');
const Sequelize = require('sequelize');

const { RecordSerializer } = require('forest-express-sequelize');

const ElasticsearchHelper = require('../service/elasticsearch-helper');
const { FIELD_DEFINITIONS } = require('../utils/filter-translator');

const serializer = new RecordSerializer({ name: 'es-activity-logs' });

// Custom mapping function
function mapActivityLog(id, source) {
  const {
    createdAt,
    ...simpleProperties
  } = source;

  return {
    id,
    ...simpleProperties,
    createdAt: source.createdAt ? new Date(source.createdAt) : null,
  };
}

const configuration = {
  index: 'activity-logs-*',
  filterDefinition: {
    action: FIELD_DEFINITIONS.keyword,
    label: FIELD_DEFINITIONS.text,
    collectionId: FIELD_DEFINITIONS.keyword,
    userId: FIELD_DEFINITIONS.keyword,
    createdAt: FIELD_DEFINITIONS.date,
  },
  mappingFunction: mapActivityLog,
  sort: [
    { createdAt: { order: 'desc' } },
  ],
}

const elasticsearchHelper = new ElasticsearchHelper(configuration);

router.get('/es-activity-logs', async (request, response, next) => {
  try {
    const pageSize = Number(request?.query?.page?.size) || 20;
    const page = Number(request?.query?.page?.number) || 1;
    const search = request.query?.search;

    // NOTICE: search all user ids whom firstName or lastName or email match %search%
    const { Op } = Sequelize;

    const where = {};
    const searchCondition = { [Op.iLike]: `%${search}%` };
    where[Op.or] = [
      { firstName: searchCondition },
      { lastName: searchCondition },
      { email: searchCondition },
    ];

    const userIdsFromSearch = await models.users.findAll({
      where,
      attributes: ['id'],
      paranoid: false,
    });

    // NOTICE: Create a custom boolean query for Elasticsearch
    const booleanQuery = {
      should: [{
        terms: {
          userId: userIdsFromSearch.map((user) => user.id),
        },
      }],
      minimum_should_match: 1,
    };

    // NOTICE: Use the elasticsearchHelper to query Elasticsearch
    const [results, count] = await Promise.all([
      elasticsearchHelper.esSearch(
        { page, pageSize },
        booleanQuery,
      ),
      elasticsearchHelper.esCount(booleanQuery),
    ]);

    response.send({
      ...await serializer.serialize(results),
      meta: {
        count: count,
      }
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
```
{% endcode %}

![](<../../../.gitbook/assets/image (483).png>)
