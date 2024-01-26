# Create a Calendar view

The example below shows how to display a calendar view:

![](<../../.gitbook/assets/image (255).png>)

```javascript
import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { guidFor } from "@ember/object/internals";
import {
  triggerSmartAction,
  deleteRecords,
  getCollectionId,
  loadExternalStyle,
  loadExternalJavascript,
} from "client/utils/smart-view-utils";

export default class extends Component {
  @service() router;
  @service() store;

  @tracked conditionAfter = null;
  @tracked conditionBefore = null;
  @tracked loaded = false;

  constructor(...args) {
    super(...args);

    this.loadPlugin();
  }

  get calendarId() {
    return `${guidFor(this)}-calendar`;
  }

  async loadPlugin() {
    loadExternalStyle(
      "https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.css"
    );
    await loadExternalJavascript(
      "https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"
    );
    this.loaded = true;

    this.onInsert();
  }

  @action
  onInsert() {
    if (!this.loaded || !document.getElementById(this.calendarId)) return;

    this.calendar = new FullCalendar.Calendar(
      document.getElementById(this.calendarId),
      {
        allDaySlot: false,
        minTime: "00:00:00",
        initialDate: new Date(2018, 2, 1),
        eventClick: ({ event, jsEvent, view }) => {
          this.router.transitionTo(
            "project.rendering.data.collection.list.view-edit.details",
            this.args.collection.id,
            // This is not a mistake, you have to specify the collection twice
            this.args.collection.id,
            event.id
          );
        },
        events: async (info, successCallback, failureCallback) => {
          const field = this.args.collection.fields.findBy(
            "fieldName",
            "start_date"
          );

          if (this.conditionAfter) {
            this.args.removeCondition(this.conditionAfter, true);
            this.conditionAfter.unloadRecord();
          }
          if (this.conditionBefore) {
            this.args.removeCondition(this.conditionBefore, true);
            this.conditionBefore.unloadRecord();
          }

          const conditionAfter =
            this.store.createFragment("fragment-condition");
          conditionAfter.set("field", field);
          conditionAfter.set("operator", "is after");
          conditionAfter.set("value", info.start);
          conditionAfter.set("smartView", this.args.viewList);
          this.conditionAfter = conditionAfter;

          const conditionBefore =
            this.store.createFragment("fragment-condition");
          conditionBefore.set("field", field);
          conditionBefore.set("operator", "is before");
          conditionBefore.set("value", info.end);
          conditionBefore.set("smartView", this.args.viewList);
          this.conditionBefore = conditionBefore;

          this.args.addCondition(conditionAfter, true);
          this.args.addCondition(conditionBefore, true);

          await this.args.fetchRecords({ page: 1 });

          successCallback(
            this.args.records?.map((appointment) => {
              return {
                id: appointment.get("id"),
                title: appointment.get("forest-name"),
                start: appointment.get("forest-start_date"),
                end: appointment.get("forest-end_date"),
              };
            })
          );
        },
      }
    );

    this.calendar.render();
  }

  @action
  triggerSmartAction(...args) {
    return triggerSmartAction(this, ...args);
  }

  @action
  deleteRecords(...args) {
    return deleteRecords(this, ...args);
  }
}
```

```css
.calendar {
  padding: 20px;
  background: var(--color-beta-surface);
  height: 100%;
  overflow: scroll;
}
.calendar .fc-toolbar.fc-header-toolbar .fc-left {
  font-size: 14px;
  font-weight: bold;
}
.calendar .fc-day-header {
  padding: 10px 0;
  background-color: var(--color-beta-secondary);
  color: var(--color-beta-on-secondary_dark);
}
.calendar .fc-event {
  background-color: var(--color-beta-secondary);
  border: 1px solid var(--color-beta-on-secondary_border);
  color: var(--color-beta-on-secondary_medium);
  font-size: 14px;
}
.calendar .fc-day-grid-event {
  background-color: var(--color-beta-info);
  color: var(--color-beta-on-info);
  font-size: 10px;
  border: none;
  padding: 2px;
}
.calendar .fc-day-number {
  color: var(--color-beta-on-surface_medium);
}
.calendar .fc-other-month .fc-day-number {
  color: var(--color-beta-on-surface_disabled);
}
.fc-left {
  color: var(--color-beta-on-surface_dark);
}

.c-smart-view {
  display: flex;
  white-space: normal;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  background-color: var(--color-beta-surface);
}

.c-smart-view__content {
  margin: auto;
  text-align: center;
  color: var(--color-beta-on-surface_medium);
}

.c-smart-view_icon {
  margin-bottom: 32px;
  font-size: 32px;
}
```

```html
<div
  id="{{this.calendarId}}"
  class="calendar"
  {{did-insert
  this.onInsert}}
></div>
```
