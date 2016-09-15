/*
Copyright 2016 The Johns Hopkins University Applied Physics Laboratory

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { Component } from 'react';

export default class Visualizer extends Component {

    constructor(props) {
        super(props);

        let self = this;

        this.setCameraLocRot = this.setCameraLocRot.bind(this);
        this.init = this.init.bind(this);
        this.animate = this.animate.bind(this);
        this.triggerRender = this.triggerRender.bind(this);
        this.updateCameraState = this.updateCameraState.bind(this);

        this.renderLayers = this.props.renderLayers || {};
        this.setControls = this.props.setControls || ((cam, dom) => {
            self.controls = new THREE.TrackballControls(cam, dom);
            self.controls.maxDistance = 4000;
            self.controls.addEventListener('end', ev => {
                self.updateCameraState();
            });
        });
        this.cameraDistance = this.props.cameraDistance || 1000;

        this.onReady = this.props.onReady || (() => {});
        this.onReady(self);

        this.onKeyDown = this.props.onKeyDown || (() => {});
        this.onClick = this.props.onClick || (() => {});
    }

    requestUpdate() {
        for (var i = 0; i < this.renderLayers.length; i++) {
            this.renderLayers[i].needsUpdate = true;
        }
    }

    setCameraLocRot(loc, rot) {
        let self = this;
        self.camera.position.set(...loc);
        self.camera.up.set(...rot);
        self.camera.updateProjectionMatrix();
    }

    updateCameraState() {
        let self = this;
    }

    init() {
        let self = this;

        // Needed for mouse-camera raytracing (for mouse events):
        self.mouse = new THREE.Vector2();
        self.raycaster = new THREE.Raycaster();

        // Set up scene primitives:
        self.scene = new THREE.Scene();
        window.scene = self.scene;
        self.renderer = new THREE.WebGLRenderer();
        self.renderer.setPixelRatio(window.devicePixelRatio);
        self.renderer.setSize(window.innerWidth, window.innerHeight);

        // Insert into document:
        var container = document.getElementById('visualizer-target');
        container.appendChild(self.renderer.domElement);

        // Provide camera, controls, and renderer:
        self.camera = new THREE.PerspectiveCamera(
            10,
            window.innerWidth / window.innerHeight,
            1, 100000
        );

        // Set the default camera location.
        // TODO: Allow this to be overridden by a prop
        self.setCameraLocRot(
            [0, self.cameraDistance, 0],
            [1, 0, 0]
        );

        self.setControls(self.camera, self.renderer.domElement);

        // Add event listeners:
        addEventListener('keydown', ev => {
            self.onKeyDown(self, ev);
        });

        addEventListener('click', ev => {
            // Set the position of the mouse vector2 in space
            self.mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
            self.mouse.y = - (ev.clientY / window.innerHeight) * 2 + 1;

            // Get the items that fall along the raytraced line between the
            // camera and the mouse at +inf
            self.raycaster.setFromCamera(self.mouse, self.camera);

            // Perform the on-click as specified in props.
            // TODO: Allow layerwise behavior (i.e. ignore certain layers)
            self.onClick(self, ev, self.raycaster.intersectObjects(scene.children));
        });

        for (var i = 0; i < self.renderLayers.length; i++) {
            self.renderLayers[i].requestInit(self.scene);
        }
    }

    animate() {
        let self = this;
        requestAnimationFrame(self.animate);

        self.controls.update();

        for (var i = 0; i < self.renderLayers.length; i++) {
            self.renderLayers[i].requestRender(self.scene);
        }
        self.renderer.render(self.scene, self.camera);
    }

    triggerRender() {
        let self = this;

        self.init();
        self.animate();
    }

    render() {
        return (
            <div id="visualizer-target"></div>
        );
    }
}
