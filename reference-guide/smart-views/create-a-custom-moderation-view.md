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

# Create a custom moderation view

This example shows you how you can implement a moderation view with a custom Approve/Reject workflow.

![](<../../.gitbook/assets/image (541).png>)

In our example, we want to Approve or Reject products to moderate content on our website:

- We want to preview products images
- We want to bulk Approve/Reject products

## How it works

### Smart view definition

Learn more about [smart views](./).\
\
**File template.hbs**

This file contains the HTML and CSS needed to build the view.

{% tabs %}
{% tab title="Template" %}

```css
<div class="view-wrapper">
  <div class="table-wrapper">
    <table class="c-table-frame">
      <thead class="l-table-frame-headers">
        <tr class="l-table-frame-headers-line">
          <th scope="col" role="button" class="c-table-frame__header c-table-frame__header--select-all">
            <div class="c-table-frame__checkbox-select-all">
              <div class="l-table-frame-checkbox-select-all">
                <BetaCheckbox
                  @value={{this.allSelected}}
                  @small={{true}}
                  @disabled={{false}}
                  @onChange={{fn this.selectAll}}
                />
              </div>
            </div>
          </th>
          <th scope="col" class="c-table-frame__header c-table-column-header">
            <span class="c-table-column-header__content">
              <span class="c-table-column-header__display-name
                c-table-column-header__display-name--sortable
                c-table-column-header__display-name--first" role="button">
                Product details
              </span>
            </span>
          </th>
          <th scope="col" class="c-table-frame__header c-table-column-header">
            <span class="c-table-column-header__content">
              <span class="c-table-column-header__display-name" role="button">
                Images
              </span>
            </span>
          </th>
          <th scope="col" class="c-table-frame__header c-table-column-header">
            <span class="c-table-column-header__content">
              <span class="c-table-column-header__display-name" role="button">
                <Button::BetaButton
                  @type="primary"
                  @text="Approve"
                  @size="tiny"
                  @action={{fn this.triggerSmartAction @collection 'Approve' this.selectedRecords}}
                  @disabled={{this.disableButtons}}
                  @class="no-margin"
                />
                <Button::BetaButton
                  @type="danger"
                  @text="Reject"
                  @size="tiny"
                  @disabled={{this.disableButtons}}
                  @action={{fn this.triggerSmartAction @collection 'Reject' this.selectedRecords}}
                  @class="no-margin"
                />
              </span>
            </span>
          </th>
        </tr>
      </thead>
      <tbody class="l-table-frame-body">
        {{#each this.formattedRecords as |record|}}
          <tr>
            <td class="align-top first-column" role="">
              <BetaCheckbox
                @value={{record._selected}}
                @small={{true}}
                @disabled={{false}}
                @onChange={{fn this.selectRecord}}
              />
            </td>
            <td class="align-top">
              <div class="title">
                <LinkTo
                  @route="project.rendering.data.collection.list.viewEdit.details"
                  @models={{array @collection.id record.id}}
                >
                 {{record.forest-name}}
                </LinkTo>
              </div>
              <div class="status">
                <span class="c-badge" style="--badge-color:#0cc251; --badge-background-color:#0cc25133;">
                  <p class="c-badge__label">
                    {{record.forest-state}}
                  </p>
                </span>
              </div>
            </td>
            <td class="second-column">
              {{#each record.forest-imagesSF as |image|}}
                <Widgets::Display::FileViewer::WidgetLayout
                  @value={{image}}
                  @field={{this.pictureField}}
                />
              {{/each}}
            </td>
          </tr>
        {{/each}}
      </tbody>
    </table>
  </div>

  <DataDisplay::Table::TableFooter
    @collection={{@collection}}
    @records={{@records}}
    @selectedRecordsCount={{this.selectedRecords.length}}
    @recordsCount={{@recordsCount}}
    @currentPage={{@currentPage}}
    @numberOfPages={{@numberOfPages}}
    @fetchRecords={{@fetchRecords}}
    @canEdit={{@canEdit}}
    @isLoading={{@isLoading}}
    @displaySearchExtendedButton={{@displaySearchExtendedButton}}
    @disablePagination={{false}}
    @hasShowMore={{false}}
    @class="pagination"
  />
</div>
```

{% endtab %}
{% endtabs %}
