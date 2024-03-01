{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

# Elasticsearch service/utils

## Connecting to Elasticsearch with a Custom Service

This service wraps the [Elasticsearch Node.js client](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html) and provides the following implementation:

* Get a list of records (with Pagination and Filters handling)
* Get a simple record
* Create a record
* Update an existing record
* Delete a record

{% tabs %}
{% tab title="Prototype" %}
```javascript
const { Client } = require('@elastic/elasticsearch');

// Our own utils that transform ForestAdmin filters to Elasticsearch one
const { esTranslateFilter } = require('../utils/filter-translator');

class ElasticsearchHelper {
  // Allow to create a ElasticsearchHelper on your elastic index
  constructor({
    index,
    filterDefinition,
    mappingFunction,
    sort,
  });

  // Get a List of Records based on the query (page, filter, search, sort)
  functionSearch ({
    pageSize, page, filters, options,
  });

  // Get a Record by Id
  getRecord(recordId);

  // Create a Record in your Elasticsearch index
  createRecord(recordToCreate);

  // Update a Record in from your Elasticsearch index
  updateRecord(recordToUpdate);

  // Remove a by Id
  removeRecord(recordId);

  // Remove multiple Ids
  removeRecords(recordsIdsToDelete);
}

module.exports = ElasticsearchHelper;
```
{% endtab %}

{% tab title="Full implementation" %}
{% code title="service/elasticsearch-helper.js" %}
```javascript
const { Client } = require('@elastic/elasticsearch');

const { esTranslateFilter } = require('../utils/filter-translator');


function baseMappingFunction(id, source) {
  return {
    id,
    ...source,
  };
}

class ElasticsearchHelper {

  constructor({
    index,
    filterDefinition,
    mappingFunction = baseMappingFunction,
    sort,
  }) {

    if (!index) {
      throw new Error('Your elasticsearch index for this collection is required !');
    }

    this.index = index;
    this.filterDefinition = filterDefinition;
    this.mappingFunction = mappingFunction;
    this.sort = sort;

    this.elasticsearchClient = new Client({ node: 'http://localhost:9200' });
  }

  /**
   * @param {{
   *  pageSize?: number
   *  page?: number
   * }} params
   * @param {any} booleanQuery Elasticsearch bool query
   * @returns {Promise<Array<Record>>}
   */
  async  esSearch({
    pageSize, page,
  }, booleanQuery) {
    const size = pageSize || 20;
    const from = ((page || 1) - 1) * size;

    const response = await this.elasticsearchClient.search({
      index: this.index,
      body: {
        query: {
          bool: {
            ...booleanQuery,
          },
        },
        sort: this.sort,
      },
      size,
      from,
    });

    return response.body.hits.hits
      .map((hit) => this.mappingFunction(hit._id, hit._source));
  }

  /**
   * @param {any} booleanQuery Elasticsearch bool query
   * @returns {Promise<number>}
   */
  async esCount(booleanQuery) {
    const response = await this.elasticsearchClient.count({
      index: this.index,
      body: {
        query: {
          bool: {
            ...booleanQuery,
          },
        },
      },
    });

    return Number(response.body.count);
  }

  /**
   * @param {{
   *  pageSize?: number
   *  page?: number
   *  filters: any
   *  options: any
   * }} params
   * @returns {Promise<{
   *  count: number;
   *  results: Array<Record>
   * }>}
   */
  async functionSearch({
    pageSize, page, filters, options,
  }) {
    const esFilter = esTranslateFilter(this.filterDefinition, filters, options);

    const [results, count] = await Promise.all([
      this.esSearch(
        { page, pageSize },
        { filter: esFilter },
      ),
      this.esCount({ filter: esFilter }),
    ]);

    return {
      results,
      count,
    };
  }

  /**
   * @param {string} id
   * @returns {Promise<Record>}
   */
  async getRecord(id) {
    const response = await this.elasticsearchClient.search({
      index: this.index,
      body: {
        query: {
          bool: {
            filter: {
              term: {
                _id: id,
              },
            },
          },
        },
      },
    });

    const hit = response.body.hits.hits[0];

    if (!hit) {
      return null;
    }

    return this.mappingFunction(hit._id, hit._source);
  }

  /**
   * @param {any} recordToCreate
   * @returns {Promise<Record>}
   */
  async createRecord(recordToCreate) {
    const response = await this.elasticsearchClient.index({
      index: this.index,
      body: recordToCreate,
      op_type: 'create',
      refresh: true,
    });

    return this.getRecord(response.body._id);
  }

  /**
   * @param {any} recordToUpdate
   * @returns {Promise<Record>}
   */
  async updateRecord(recordToUpdate) {
    const { id, ...propertiesToUpdate } = recordToUpdate;

    await this.elasticsearchClient.update({
      id,
      index: this.index,
      body: {
        doc: {
          ...propertiesToUpdate,
        }
      },
      refresh: true,
    });

    return this.getRecord(id);
  }

  /**
   * @param {any} id
   * @returns {Promise}
   */
  async removeRecord(id) {
    await this.elasticsearchClient.delete({
      id,
      index: this.index,
      refresh: true,
    });
  }

 /**
   * @param {Array<any>} idsToDelete
   * @returns {Promise}
   */
  async removeRecords(idsToDelete) {
    const body = idsToDelete.map(id => {
      return {
        delete: {
          _index: this.index,
          _id: id
        }
      };
    });

    await this.elasticsearchClient.bulk({
      body,
      refresh: true,
    });
  }
}

module.exports = ElasticsearchHelper;
```
{% endcode %}
{% endtab %}
{% endtabs %}

{% hint style="info" %}
You need to add Elasticsearch Node.js client to your project`npm install @elastic/elasticsearch`
{% endhint %}

## Creating utils to convert Express query filters to Elasticsearch one

This utils takes an object representing a filter from the ForestAdmin UI and transforms it into a filter for Elasticsearch.

* Date filters
* Number filters
* Text filters
* Enum filters

{% tabs %}
{% tab title="Full implementation" %}
{% code title="utils/filter-translator.js" %}
```javascript
const { BaseOperatorDateParser } = require('forest-express-sequelize');
const moment = require('moment');
/**
 * @enum {string}
 */
const DATE_OPERATORS = {
  today: 'today',
  yesterday: 'yesterday',
  previous_week: 'previous_week',
  previous_month: 'previous_month',
  previous_quarter: 'previous_quarter',
  previous_year: 'previous_year',
  previous_week_to_date: 'previous_week_to_date',
  previous_month_to_date: 'previous_month_to_date',
  previous_quarter_to_date: 'previous_quarter_to_date',
  previous_year_to_date: 'previous_year_to_date',
  previous_x_days: 'previous_x_days',
  previous_x_days_to_date: 'previous_x_days_to_date',
  past: 'past',
  future: 'future',
  before_x_hours_ago: 'before_x_hours_ago',
  after_x_hours_ago: 'after_x_hours_ago',
};

/**
 * @typedef {{
 *  field: string;
 *  operator: 'before' | 'after' | 'equal' | 'not_equal' | 'present' | 'blank' | 'today'
 *    | 'yesterday' | 'previous_x_days' | 'previous_week' | 'previous_month' | 'previous_quarter'
 *    | 'previous_year' | 'previous_x_days_to_date' | 'previous_week_to_date'
 *    | 'previous_month_to_date' | 'previous_quarter_to_date' | 'previous_year_to_date'
 *    | 'past' | 'future' | 'before_x_hours_ago' | 'after_x_hours_ago'
 *  value: string | null;
 * }} OneFilter
 *
 * @typedef {{
 *  aggregator: 'and' | 'or'
 *  conditions: OneFilter[]
 * }} FilterCombination
 *
 * @typedef {{
 *  timezone: string
 * }} FilterOptions
 */

/**
 * @enum {string}
 */
const FIELD_DEFINITIONS = {
  date: 'date',
  keyword: 'keyword',
  text: 'text',
  number: 'number',
};

/**
 * @param {FieldDefinition} fieldDefinition
 * @param {OneFilter} oneFilter
 * @param {FilterOptions} options
 */
function equal(fieldDefinition, oneFilter, options) {
  switch (fieldDefinition) {
    case FIELD_DEFINITIONS.date: {
      const date = moment.tz(oneFilter.value, options.timezone);

      return {
        term: {
          [oneFilter.field]: date.toISOString(),
        },
      };
    }

    case FIELD_DEFINITIONS.keyword:
    case FIELD_DEFINITIONS.text:
    case FIELD_DEFINITIONS.number: {
      return {
        terms: {
          [oneFilter.field]: Array.isArray(oneFilter.value)
            ? oneFilter.value
            : [oneFilter.value],
        },
      };
    }

    default: throw new Error('Invalid field type for operator equal');
  }
}

/**
 * @param {(fieldDefinition: FieldDefinition, oneFilter: OneFilter, options: FilterOptions) => any}
 * @param {FieldDefinition} fieldDefinition
 * @param {OneFilter} oneFilter
 * @param {FilterOptions} options
 */
function not(mapper, fieldDefinition, oneFilter, options) {
  return {
    bool: {
      must_not: mapper(fieldDefinition, oneFilter, options),
    },
  };
}

/**
 * @param {FieldDefinition} fieldDefinition
 * @param {OneFilter} oneFilter
 */
function present(fieldDefinition, oneFilter) {
  return {
    exists: {
      field: oneFilter.field,
    },
  };
}

/**
 * @param {'gt' | 'lt'} rangeOperator
 * @param {FieldDefinition} fieldDefinition
 * @param {OneFilter} oneFilter
 * @param {FilterOptions} options
 */
function dateInRange(rangeOperator, fieldDefinition, oneFilter, options) {
  if (fieldDefinition !== FIELD_DEFINITIONS.date) {
    throw new Error('Invalid field type for operator after');
  }

  return {
    range: {
      [oneFilter.field]: {
        [rangeOperator]: oneFilter.value,
        time_zone: options.timezone,
      },
    },
  };
}

/**
 * @param {FieldDefinition} fieldDefinition
 * @param {OneFilter} oneFilter
 */
function startsWith(fieldDefinition, oneFilter) {
  if (![FIELD_DEFINITIONS.keyword, FIELD_DEFINITIONS.text].includes(fieldDefinition)) {
    throw new Error('Unsupported operator starts_with');
  }

  return {
    wildcard: {
      [oneFilter.field]: {
        value: `${oneFilter.value}*`,
        case_insensitive: true,
      },
    },
  };
}

/**
 * @param {FieldDefinition} fieldDefinition
 * @param {OneFilter} oneFilter
 */
function endsWith(fieldDefinition, oneFilter) {
  if (![FIELD_DEFINITIONS.keyword, FIELD_DEFINITIONS.text].includes(fieldDefinition)) {
    throw new Error('Unsupported operator ends_with');
  }

  return {
    wildcard: {
      [oneFilter.field]: {
        value: `*${oneFilter.value}`,
        case_insensitive: true,
      },
    },
  };
}

/**
 * @param {FieldDefinition} fieldDefinition
 * @param {OneFilter} oneFilter
 */
function contains(fieldDefinition, oneFilter) {
  if (![FIELD_DEFINITIONS.keyword, FIELD_DEFINITIONS.text].includes(fieldDefinition)) {
    throw new Error('Unsupported operator contains');
  }

  return {
    wildcard: {
      [oneFilter.field]: {
        value: `*${oneFilter.value}*`,
        case_insensitive: true,
      },
    },
  };
}

/**
 * @param {FieldDefinition} fieldDefinition
 * @param {OneFilter} oneFilter
 */
 function numberInRange(rangeOperator, fieldDefinition, oneFilter) {
  if (![FIELD_DEFINITIONS.number].includes(fieldDefinition)) {
    throw new Error(`Unsupported operator ${rangeOperator}`);
  }

  return {
    range: {
      [oneFilter.field]: {
        [rangeOperator]: oneFilter.value,
      },
    },
  };
}

/**
 * @param {BaseOperatorDateParser} operatorDateParser
 * @param {OneFilter} filter
 * @param {FilterOptions} options
 * @returns { range: any}
 */
function mapDateOperator(operatorDateParser, filter, options) {
  return {
    range: {
      [filter.field]: {
        ...operatorDateParser.getDateFilter(filter.operator, filter.value),
        time_zone: options.timezone,
      },
    },
  };
}

const MAPPING = {
  equal,
  not_equal: not.bind(undefined, equal),
  present,
  blank: not.bind(undefined, present),
  before: dateInRange.bind(undefined, 'lt'),
  after: dateInRange.bind(undefined, 'gt'),
  starts_with: startsWith,
  ends_with: endsWith,
  contains,
  not_contains: not.bind(undefined, contains),
  greater_than: numberInRange.bind(undefined, 'gt'),
  less_than: numberInRange.bind(undefined, 'lt'),
};

/**
 * @param {Record<string, FIELD_DEFINITIONS>} fieldDefinitions
 * @param {BaseOperatorDateParser} operatorDateParser
 * @param {FilterOptions} options
 * @param {OneFilter} oneFilter
 */
function mapFilter(fieldDefinitions, operatorDateParser, options, oneFilter) {
  if (fieldDefinitions[oneFilter.field] === FIELD_DEFINITIONS.date
    && Object.values(DATE_OPERATORS).includes(oneFilter.operator)) {
    return mapDateOperator(operatorDateParser, oneFilter, options);
  }

  const mapper = MAPPING[oneFilter.operator];
  const fieldDefinition = fieldDefinitions[oneFilter.field];

  if (!mapper) { throw new Error(`Unknown operator ${oneFilter.operator}, you need to define it !`); }
  if (!fieldDefinition) { throw new Error(`Unknown field ${oneFilter.field}, your field hasn't any field definition. Please check your ElasticsearchHelper configuration`); }

  return mapper(fieldDefinition, oneFilter, options);
}

/**
 * Takes an object representing a filter from the UI
 * and transforms it into a filter for elasticSearch
 * @param {Record<string, FIELD_DEFINITIONS>} fieldDefinitions
 * @param {FilterCombination | OneFilter} filters
 * @param {FilterOptions} options
 * @returns {any} A valid ES filter
 */
function esTranslateFilter(fieldDefinitions, filters, options) {
  if (!filters) { return []; }

  const operatorDateParser = new BaseOperatorDateParser({
    timezone: options.timezone,
    operators: {
      GTE: 'gte',
      LTE: 'lte',
      GT: 'gt',
      LT: 'lt',
    },
  });

  if (!filters.aggregator) {
    return [mapFilter(fieldDefinitions, operatorDateParser, options, filters)];
  }

  const mapped = filters.conditions.map(
    mapFilter.bind(undefined, fieldDefinitions, operatorDateParser, options),
  );

  if (filters.aggregator === 'and') {
    return mapped;
  }

  return {
    bool: {
      should: mapped,
      minimum_should_match: 1,
    },
  };
}

exports.esTranslateFilter = esTranslateFilter;
exports.FIELD_DEFINITIONS = FIELD_DEFINITIONS;

```
{% endcode %}
{% endtab %}
{% endtabs %}

{% hint style="warning" %}
We expose utils to parse filters through **forest-express-sequelize** since version **7.6.0**
{% endhint %}
