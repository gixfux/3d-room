<template>
  <div id="room-model">
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/Addons.js'
import GUI from 'lil-gui'
import { onMounted } from 'vue'
import { useAppsStore } from '../stores/appsStore'

let appsStore = useAppsStore()

// var
let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer
let scene2: THREE.Scene, renderer2: CSS3DRenderer

const gui = new GUI()

const myObject = {
  directionalLightStrength: 0.5,
  ambientLightStrength: 0,
  screenPos: {
    x: -3750,
    y: 3160,
    z: -620
  },
  directionalLightPos: {
    x: 5000,
    y: 5000,
    z: 1000
  },
  target: {
    x: 0,
    y: 0,
    z: 0
  }
}

// scene
scene = new THREE.Scene()
scene2 = new THREE.Scene()

// camera
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000)
camera.position.set(4000, 6000, 0)
camera.lookAt(0, 0, 0)

// renderer
renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputColorSpace = THREE.SRGBColorSpace

renderer2 = new CSS3DRenderer()
renderer2.setSize(window.innerWidth, window.innerHeight)
renderer2.domElement.id = 'css3DRenderer'
renderer2.domElement.style.position = 'absolute'
renderer2.domElement.style.top = '0'
appsStore.css3DRenderer = renderer2.domElement as HTMLDivElement

// plane
const planeTextureLoader = new THREE.TextureLoader()
const planeTexture = planeTextureLoader.load('/src/assets/1.jpg')
planeTexture.colorSpace = THREE.SRGBColorSpace
const plane = new THREE.Mesh(new THREE.PlaneGeometry(20000, 10000), new THREE.MeshBasicMaterial({ map: planeTexture }))
plane.rotateY(-Math.PI / 2)
plane.position.set(10000, 2000, 0)
scene.add(plane)

// orbitControl
const controls = new OrbitControls(camera, renderer2.domElement)
controls.update()
controls.enableDamping = true
controls.target = new THREE.Vector3(-4.0, 3.0, -0.8)

// raycaster
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()

function onMouseMove(event: MouseEvent) {
  // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
}

function onMouseClick(event: MouseEvent) {
  // 计算物体和射线的焦点
  const intersects = raycaster.intersectObjects(scene.children)
  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.name === 'pc') {
      console.log(intersects[i])

      controls.dispose()
      // camera.position.set(-3.0, 3.5, -0.4)
    }
  }
}

// screen
const windowElement = document.createElement('iframe')
windowElement.src = 'http://localhost:5174/'
windowElement.style.width = 1920 + 'px'
windowElement.style.height = 1080 + 'px'
windowElement.style.zIndex = '20'

const object = new CSS3DObject(windowElement)
scene2.add(object)
object.position.set(myObject.screenPos.x, myObject.screenPos.y, myObject.screenPos.z)

// baked texture
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('/src/assets/UV-baked-lights.jpg')
texture.flipY = false
texture.colorSpace = THREE.SRGBColorSpace

const bakedMaterial = new THREE.MeshBasicMaterial({ map: texture })

// model
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/public/draco/')
const loader = new GLTFLoader()
loader.setDRACOLoader(dracoLoader)
let text: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>
loader.load('/src/assets/final-model.glb', gltf => {
  console.log(gltf)
  gltf.scene.traverse(child => {
    if (child.isMesh) {
      child.material = bakedMaterial
    }
  })
  scene.add(gltf.scene)
  gltf.scene.scale.set(500, 500, 500)
  animate()
})

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer2.setSize(window.innerWidth, window.innerHeight)
})

window.addEventListener('mousemove', onMouseMove)
// window.addEventListener('click', onMouseClick)
function animate() {
  requestAnimationFrame(animate)
  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera(pointer, camera)

  controls.update()
  renderer.render(scene, camera)
  renderer2.render(scene2, camera)
}

onMounted(() => {
  const container = document.getElementById('room-model')!
  container.appendChild(renderer.domElement)
  container.appendChild(renderer2.domElement)
})
</script>

<style scoped>
#room-model {
  width: 100%;
  height: 100%;
}
</style>