import React, { Component } from 'react'
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols'

export default class Pano2 extends Component {
    // constructor(props){
    //     super(props);
    //     // this.renderScene = this.renderScene.bind(this);
    // }
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    step = 0;
    controls = new OrbitControls(this.camera, this.renderer.domElement);

    componentDidMount() {
        this.initThree();
        window.addEventListener('resize', this.onResize, false);
    }

    onResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.render(this.scene, this.camera);
    }

    initThree() {
        this.renderer.setClearColor();
        this.renderer.setClearColor(new THREE.Color(0xEEEEEE));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMapEnabled = true;


        const axes = new THREE.AxesHelper(1000);
        this.scene.add(axes);



        this.camera.position.set(0,0,1);

        const spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;
        this.scene.add(spotLight)

        const geometry = new THREE.BoxGeometry(50, 50, 50);
        let material=[];
        let imgList = [
            './1.jpg',
            './2.jpg',
            './3.jpg',
            './4.jpg',
            './5.jpg',
            './6.jpg',
        ]
        for(var i = 0; i < imgList.length; i++){
            let mmm = new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture(imgList[i],//图片的路径
                {}, () => {
                        this.renderer.render(this.scene, this.camera);
                    }),
            })
            mmm.side = THREE.BackSide; 
            material.push(mmm);
        }
        const mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(material));
        this.scene.add(mesh);

        // this.scene.fog = new THREE.Fog(0xffffff, 0.015, 100);

        document.getElementById("WebGL-output").appendChild(this.renderer.domElement);

        const renderScene = () => {
            this.renderer.render(this.scene, this.camera);
        }
        renderScene()

        this.controls.addEventListener("change", renderScene);
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.25
        this.controls.enableZoom = false
    }
    render() {
        return (
            <div id="WebGL-output" />
        )
    }
}
