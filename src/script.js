import '/css/style.css'
import * as THREE from 'three';
import * as dat from 'dat.gui'


import Stats from 'stats.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { gsap } from "gsap"

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'


const gui = new dat.GUI()
gui.close()
const canvas = document.querySelector('canvas.webgl')


//////////////////////////////// Stats ////////////////////////////////
var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom )

//////////////////////////////// Scene ////////////////////////////////
const scene = new THREE.Scene()

//////////////////////////////// Sizes ////////////////////////////////
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//////////////////////////////// Camera ////////////////////////////////
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

//////////////////////////////// Renderer ////////////////////////////////
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.outputEncoding = THREE.sRGBEncoding;


const loadingBg = document.querySelector('.loading-screen')
const loadingAmount = document.querySelector('.loading-amount')

const manager = new THREE.LoadingManager()
manager.onLoad = ()=>{
    loadingBg.style.top = '100vh'
    loadingBg.style.opacity = '0'
    setTimeout(()=>{
        loadingBg.style.display = 'none'
    },5000)
    changeViewPoint()
}


const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const loader = new GLTFLoader(manager)
loader.setDRACOLoader(dracoLoader)

const city = new THREE.Group()
loader.load(
    // 'models/scene.glb',
    'gltf/scene.gltf',
    function (gltf) {

        gltf.scene.traverse(function (child) {
            if(child.type === "Mesh"){
                // child.scale.set(0.01, 0.01, 0.01)
                // child.rotation.x = - Math.PI * 0.5
                // city.add(child)
            } else if (child.type === "Object3D"){
                if(child.children.length) {
                    child.children.forEach((minichild)=> {
                        minichild.scale.set(0.0001, 0.0001, 0.0001)
                        city.add(minichild)
                    })
                }
            }else {
                console.log('other ',child)
            }
        })
        
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)
city.rotation.x = - Math.PI * 0.5
scene.add(city)

// gui.add(camera.position,'x').min(-5).max(5).step(0.01).listen()
// gui.add(camera.position,'y').min(-5).max(5).step(0.01).listen()
// gui.add(camera.position,'z').min(-5).max(5).step(0.01).listen()

camera.position.x = -2
camera.position.y = 0.7
camera.position.z = 0.8
let cameraLookAt = new THREE.Vector3(1.8,1.9,-4)

let cameraNextLook = {
    x:2,
    y:2,
    z:2
}
let cameraNextPos = {
    x:2,
    y:2,
    z:2
}
let position = 3
let lookDuration = 10
let PosDuration = 10
let animationPlaying = false
let lookEase = 'Power2.easeInOut'
let posEase = 'Power2.easeOut'

const actualPosHtml = document.querySelector('.actualPos')

const changeViewPoint = () => {
    if(animationPlaying == true){
        return
    }
    NextViewpointButton.classList.toggle('hidden')
    actualPosHtml.innerHTML = position

    console.log('case: ', position)
    animationPlaying = true

    switch(position){
        case 0:
            cameraNextPos.x = -0.58
            cameraNextPos.y = 1.7
            cameraNextPos.z = -0.47

            cameraNextLook.x = 0
            cameraNextLook.y = 0
            cameraNextLook.z = 2

            lookDuration = 5
            PosDuration = 8
            position = 1
            break;
        case 1:
            cameraNextPos.x = -2
            cameraNextPos.y = 0.7
            cameraNextPos.z = -0.7

            cameraNextLook.x = -2
            cameraNextLook.y = 0
            cameraNextLook.z = 2

            lookDuration = 8
            PosDuration = 13
            position = 2
            break;
        case 2:
            cameraNextPos.x = -2
            cameraNextPos.y = 0.7
            cameraNextPos.z = 0.8

            cameraNextLook.x = 1.8
            cameraNextLook.y = 1.9
            cameraNextLook.z = -4

            lookDuration = 8
            PosDuration = 7
            position = 3
            break;      
        case 3:
            cameraNextPos.x = 0.62
            cameraNextPos.y = 1.37
            cameraNextPos.z = 1.27

            cameraNextLook.x = -1
            cameraNextLook.y = 1.37
            cameraNextLook.z = -0.36

            lookDuration = 5
            PosDuration = 13
            position = 4
            break; 
        case 4:
            cameraNextPos.x = 0.62
            cameraNextPos.y = 1.7
            cameraNextPos.z = -1.55

            cameraNextLook.x = -1
            cameraNextLook.y = 1.37
            cameraNextLook.z = -0.36

            lookDuration = 10
            PosDuration = 15
            position = 5
            break;
        case 5:
            cameraNextPos.x = - 1.7
            cameraNextPos.y = 1.37
            cameraNextPos.z = -2

            cameraNextLook.x = -1
            cameraNextLook.y = 1.37
            cameraNextLook.z = -0.36

            lookDuration = 8
            PosDuration = 12
            position = 0
            break;
    }

    gsap.to(cameraLookAt, {
        x: cameraNextLook.x,
        y: cameraNextLook.y,
        z: cameraNextLook.z,
        duration: lookDuration,
        ease: lookEase
    })

    gsap.to( camera.position, {
        duration: PosDuration,
        x: cameraNextPos.x,
        y: cameraNextPos.y,
        z: cameraNextPos.z,
        ease: posEase
    })

    setTimeout(()=>{
        animationPlaying = false
        NextViewpointButton.classList.toggle('hidden')
    },(Math.max(lookDuration, PosDuration) * 1000) * 0.4)
}

const NextViewpointButton = document.querySelector('.nextViewpointButton')
NextViewpointButton.addEventListener('click', changeViewPoint)

// gui.add(cameraLookAt,'x').min(-5).max(5).step(0.01).listen()
// gui.add(cameraLookAt,'y').min(-5).max(5).step(0.01).listen()
// gui.add(cameraLookAt,'z').min(-5).max(5).step(0.01).listen()




//////////////////////////////// Animation ////////////////////////////////
const clock = new THREE.Clock()

const tick = () =>
{
    stats.begin()
    const elapsedTime = clock.getElapsedTime()

    
    cameraLookAt.x += Math.cos(elapsedTime * 0.33) * 0.0001
    cameraLookAt.y += Math.sin(elapsedTime * 0.5) * 0.0002
    cameraLookAt.z += Math.sin(elapsedTime * 0.85) * 0.0003
    
    camera.lookAt(cameraLookAt)
    // controls.update()

    renderer.render(scene, camera)
    stats.end()
    window.requestAnimationFrame(tick)
}

tick()