// Open Layers import
import Map from 'ol/Map';
import View from 'ol/View';
import Feature from 'ol/Feature';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile';
import { useGeographic } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import MultiPolygon from 'ol/geom/MultiPolygon';

// Angular imports
import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	private getCenterCoordinate(polygon: MultiPolygon) {
		let cords = polygon.getCoordinates();
		if (!cords || !cords[0] || !cords[0][0]) return [0, 0];

		// Initial values
		let highX = 0;
		let lowX = 180;
		let highY = 0;
		let lowY = 180;

		let coordinates = cords[0][0];

		// Find high and low for both X and Y
		coordinates.forEach(cord => {
			if (cord[0] > highX) highX = cord[0];
			if (cord[0] < lowX) lowX = cord[0];

			if (cord[1] > highY) highY = cord[1];
			if (cord[1] < lowY) lowY = cord[1];
		});

		// Average
		let x = (highX + lowX) / 2;
		let y = (highY + lowY) / 2;

		return [x, y];
	}

	ngOnInit() {
		useGeographic();

		// Create a multipolygon object
		let multiPolygon = new MultiPolygon([
			[[
				[11.021941683607787, 59.944518214479572],
				[11.02233843840375, 59.94441885931758],
				[11.130057365507325, 59.94610785657823],
				[11.130850875099249, 59.911913750299867],
				[11.017379003454229, 59.911714844292121],
				[11.021941683607787, 59.944518214479572]
			]]
		]);

		// Create a feature
		let feature = new Feature({
			geometry: multiPolygon,
			name: "My Polygon",
		});

		// Create the map
		new Map({
			target: 'map',
			layers: [
				new TileLayer({
					source: new OSM()
			  	}),
				new VectorLayer({
					source: new VectorSource({
						features: [feature]
					})
				})
			],
			view: new View({
				center: this.getCenterCoordinate(multiPolygon),
				zoom: 13
			})
		});

		this.getCenterCoordinate(multiPolygon);
	}
}
