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

# Create a Map view

The example below shows how to display a map view:

![](<../../.gitbook/assets/image (253).png>)

{% code title="component.js" %}

```javascript
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import { action } from '@ember/object';
import { observes } from '@ember-decorators/object';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import {
  triggerSmartAction,
  deleteRecords,
  getCollectionId,
  loadExternalStyle,
  loadExternalJavascript,
} from 'client/utils/smart-view-utils';

export default class extends Component {
  @service router;
  @service store;

  @tracked map = null;
  @tracked loaded = false;

  constructor(...args) {
    super(...args);

    this.loadPlugin();
  }

  get mapId() {
    return `map-${guidFor(this)}`;
  }

  async loadPlugin() {
    loadExternalStyle(
      '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/leaflet.css'
    );
    loadExternalStyle(
      '//cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css'
    );

    await loadExternalJavascript(
      '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/leaflet.js'
    );
    await loadExternalJavascript(
      '//cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js'
    );

    this.loaded = true;
    this.displayMap();
  }

  @action
  displayMap() {
    if (!this.loaded) {
      return;
    }

    if (this.map) {
      this.map.off();
      this.map.remove();
      this.map = null;
    }

    const markers = [];

    this.args.records?.forEach(function (record) {
      markers.push([
        record.get('forest-lat'),
        record.get('forest-lng'),
        record.get('id'),
      ]);
    });

    this.map = new L.Map(this.mapId);

    const osmUrl =
      'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png';
    const osmAttrib =
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';
    const osm = new L.TileLayer(osmUrl, { attribution: osmAttrib });
    const drawnItems = new L.FeatureGroup();
    this.map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      draw: {
        polygon: false,
        polyline: false,
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: true,
      },
      edit: {
        featureGroup: drawnItems,
      },
    });

    this.map.setView(new L.LatLng(48.8566, 2.3522), 2);
    this.map.addLayer(osm);
    this.map.addControl(drawControl);

    this.map.on(L.Draw.Event.CREATED, (event) => {
      const { layer, layerType: type } = event;

      if (type === 'marker') {
        const coordinates = event.layer.getLatLng();
        const newRecord = this.store.createRecord('forest_delivery', {
          'forest-is_delivered': false,
          'forest-lng': coordinates.lng,
          'forest-lat': coordinates.lat,
        });

        newRecord.save().then((savedRecord) => {
          layer.on('click', () => {
            this.router.transitionTo(
              'project.rendering.data.collection.list.view-edit.details',
              this.args.collection.id,
              savedRecord.id
            );
          });
        });
      }

      this.map.addLayer(layer);
    });

    this.addMarkers(markers);
  }

  addMarker(marker) {
    const lat = Number.parseFloat(marker[0]);
    const long = Number.parseFloat(marker[1]);

    const recordId = marker[2];
    marker = L.marker([lat, long]).addTo(this.map);

    marker.on('click', () => {
      this.router.transitionTo(
        'project.rendering.data.collection.list.view-edit.details',
        this.args.collection.id,
        recordId
      );
    });
  }

  addMarkers(markers) {
    markers.forEach((marker) => this.addMarker(marker));
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

{% endcode %}

{% code title="style.css" %}

```css
.c-map {
  width: 100%;
  height: 100%;
  z-index: 4;
}

#map {
  width: 100%;
  z-index: 4;
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

{% endcode %}

{% code title="template.hbs" %}

```handlebars
<div
  id={{this.mapId}}
  class='c-map'
  {{did-insert this.displayMap}}
  {{did-update this.displayMap @records}}
></div>
```

{% endcode %}
