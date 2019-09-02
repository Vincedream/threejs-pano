import React, { Component } from 'react'
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import Stats from 'stats.js';

export default class Pano extends Component {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    step = 0;
    stats = new Stats();
    controls = new OrbitControls(this.camera, this.renderer.domElement);

    initStats() {
        this.stats.setMode(0); // 0: fps, 1: ms
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '0px';
        this.stats.domElement.style.top = '0px';
        document.getElementById("Stats-output").appendChild(this.stats.domElement);
        return this.stats;
    }

    componentDidMount() {
        this.initThree();
        this.initStats();
        // this.autoCamera();
        window.addEventListener('resize', this.onResize, false);
    }

    onResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.reRender();
    }

    initThree() {
        this.renderer.setClearColor();
        this.renderer.setClearColor(new THREE.Color(0xEEEEEE));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMapEnabled = true;

        // 辅助线
        const axes = new THREE.AxesHelper(1000);
        this.scene.add(axes);

        // 设置初始camera位置及朝向
        this.camera.position.set(0,0,1);

        // 创建一个正方体
        const cube = new THREE.BoxGeometry(50, 50, 50);
        let cubeMaterial=[];
        let imgList = [
            './1.jpg',
            './2.jpg',
            './3.jpg',
            './4.jpg',
            './5.jpg',
            './6.jpg',
        ]
        for(var i = 0; i < imgList.length; i++){
            let singleMaterial = new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture(imgList[i], {}, () => {
                    this.renderer.render(this.scene, this.camera);
                }),
            })
            singleMaterial.side = THREE.BackSide; 
            cubeMaterial.push(singleMaterial);
        }
        const mesh = new THREE.Mesh(cube, new THREE.MeshFaceMaterial(cubeMaterial));
        this.scene.add(mesh);

        document.getElementById("WebGL-output").appendChild(this.renderer.domElement);

        this.reRender()

        this.controls.addEventListener("change", this.reRender);
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.8
        this.controls.enableZoom = false
    }

    reRender = () => {
        this.stats.update();
        this.renderer.render(this.scene, this.camera);
    }

    autoCamera = () => {
        this.step = this.step + 0.1;
        const z = Math.sin(Math.PI / 180 * this.step);
        const x = Math.cos(Math.PI / 180 * this.step);
        this.camera.position.set(x,0,z);
        this.camera.lookAt(this.scene.position);
        this.reRender();

        if(this.step === 360){
            this.step = 0;
        }
        
        requestAnimationFrame(this.autoCamera);
    }
    render() {
        return (
            <div>
                <div id="WebGL-output" />
                <div id="Stats-output"/>
            </div>
        )
    }
}
