import { ref, shallowRef } from 'vue'
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { useTextures } from '@/composables/useTextures'

// Zone types for city planning
export enum ZoneType {
  EMPTY = 'empty',
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  INDUSTRIAL = 'industrial',
  PARK = 'park',
  ROAD = 'road',
  WATER = 'water',
  SPECIAL = 'special'
}

// Building types
export enum BuildingType {
  NONE = 'none',
  HOUSE_SMALL = 'house_small',
  HOUSE_MEDIUM = 'house_medium',
  HOUSE_LARGE = 'house_large',
  APARTMENT = 'apartment',
  OFFICE_SMALL = 'office_small',
  OFFICE_MEDIUM = 'office_medium',
  OFFICE_LARGE = 'office_large',
  FACTORY = 'factory',
  SHOP = 'shop',
  PARK = 'park',
  ROAD_STRAIGHT = 'road_straight',
  ROAD_CORNER = 'road_corner',
  ROAD_INTERSECTION = 'road_intersection',
  ROAD_TJUNCTION = 'road_tjunction'
}

// Cell in the city grid
export interface GridCell {
  x: number;
  z: number;
  zoneType: ZoneType;
  buildingType: BuildingType;
  rotation: number; // 0, 90, 180, 270 degrees
  height: number;
  object?: THREE.Object3D;
  body?: CANNON.Body;
}

export function useCityGrid(
  gridSize: { width: number; height: number } = { width: 20, height: 20 },
  cellSize: number = 1
) {
  // Get textures
  const { grassTexture, roadTexture, concreteTexture, buildingTextures } = useTextures();
  
  // Grid data
  const grid = ref<GridCell[][]>([]);
  const gridObjects = shallowRef<THREE.Group>(new THREE.Group());
  
  // Initialize an empty grid
  const initializeGrid = () => {
    const newGrid: GridCell[][] = [];
    
    for (let x = 0; x < gridSize.width; x++) {
      newGrid[x] = [];
      for (let z = 0; z < gridSize.height; z++) {
        newGrid[x][z] = {
          x,
          z,
          zoneType: ZoneType.EMPTY,
          buildingType: BuildingType.NONE,
          rotation: 0,
          height: 0
        };
      }
    }
    
    grid.value = newGrid;
    return grid.value;
  };
  
  // Get world position from grid coordinates
  const gridToWorld = (x: number, z: number): THREE.Vector3 => {
    // Center the grid around the origin
    const offsetX = (gridSize.width * cellSize) / 2;
    const offsetZ = (gridSize.height * cellSize) / 2;
    
    return new THREE.Vector3(
      x * cellSize - offsetX + cellSize / 2,
      0,
      z * cellSize - offsetZ + cellSize / 2
    );
  };
  
  // Get grid coordinates from world position
  const worldToGrid = (position: THREE.Vector3): { x: number, z: number } => {
    const offsetX = (gridSize.width * cellSize) / 2;
    const offsetZ = (gridSize.height * cellSize) / 2;
    
    const x = Math.floor((position.x + offsetX) / cellSize);
    const z = Math.floor((position.z + offsetZ) / cellSize);
    
    return { x, z };
  };
  
  // Set zone type for a cell
  const setZoneType = (x: number, z: number, type: ZoneType) => {
    if (x >= 0 && x < gridSize.width && z >= 0 && z < gridSize.height) {
      grid.value[x][z].zoneType = type;
    }
  };
  
  // Set building type for a cell
  const setBuildingType = (x: number, z: number, type: BuildingType, rotation: number = 0) => {
    if (x >= 0 && x < gridSize.width && z >= 0 && z < gridSize.height) {
      grid.value[x][z].buildingType = type;
      grid.value[x][z].rotation = rotation;
    }
  };
  
  // Get cell at grid coordinates
  const getCell = (x: number, z: number): GridCell | null => {
    if (x >= 0 && x < gridSize.width && z >= 0 && z < gridSize.height) {
      return grid.value[x][z];
    }
    return null;
  };
  
  // Create a visual grid for reference
  const createVisualGrid = (scene: THREE.Scene) => {
    const gridHelper = new THREE.GridHelper(
      Math.max(gridSize.width, gridSize.height) * cellSize,
      Math.max(gridSize.width, gridSize.height)
    );
    scene.add(gridHelper);
    
    return gridHelper;
  };
  
  // Create a ground plane with texture
  const createGround = (
    scene: THREE.Scene,
    world: CANNON.World,
    textureUrl: string = ''
  ) => {
    // Physics ground
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({
      mass: 0, // static body
      shape: groundShape,
    });
    
    // Rotate the ground plane to make it horizontal
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.addBody(groundBody);
    
    // Visual ground
    const width = gridSize.width * cellSize;
    const height = gridSize.height * cellSize;
    
    const groundGeometry = new THREE.PlaneGeometry(width, height);
    let groundMaterial;
    
    if (textureUrl) {
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(textureUrl);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(gridSize.width, gridSize.height);
      
      groundMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.8,
        metalness: 0.2
      });
    } else {
      // Use the grass texture
      const texture = grassTexture;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(gridSize.width, gridSize.height);
      
      groundMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.8,
        metalness: 0.2
      });
    }
    
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);
    
    return { body: groundBody, mesh: groundMesh };
  };
  
  // Create a building at grid position
  const createBuilding = (
    x: number,
    z: number,
    buildingType: BuildingType,
    scene: THREE.Scene,
    world: CANNON.World,
    rotation: number = 0
  ) => {
    const cell = getCell(x, z);
    if (!cell) return null;
    
    // Remove existing building if any
    if (cell.object) {
      scene.remove(cell.object);
      if (cell.body) {
        world.removeBody(cell.body);
      }
    }
    
    // Get world position
    const position = gridToWorld(x, z);
    
    // Building properties based on type
    let width = cellSize;
    let height = 1;
    let depth = cellSize;
    let color = 0xcccccc;
    let buildingZoneType = ZoneType.RESIDENTIAL; // Default zone type
    
    switch (buildingType) {
      case BuildingType.HOUSE_SMALL:
        height = 1;
        color = 0x88aaff;
        buildingZoneType = ZoneType.RESIDENTIAL;
        break;
      case BuildingType.HOUSE_MEDIUM:
        height = 1.5;
        color = 0x7799ee;
        buildingZoneType = ZoneType.RESIDENTIAL;
        break;
      case BuildingType.HOUSE_LARGE:
        height = 2;
        color = 0x6688dd;
        buildingZoneType = ZoneType.RESIDENTIAL;
        break;
      case BuildingType.APARTMENT:
        height = 4;
        color = 0x5577cc;
        buildingZoneType = ZoneType.RESIDENTIAL;
        break;
      case BuildingType.OFFICE_SMALL:
        height = 2;
        color = 0xaaddff;
        buildingZoneType = ZoneType.COMMERCIAL;
        break;
      case BuildingType.OFFICE_MEDIUM:
        height = 3;
        color = 0x99ccee;
        buildingZoneType = ZoneType.COMMERCIAL;
        break;
      case BuildingType.OFFICE_LARGE:
        height = 5;
        color = 0x88bbdd;
        buildingZoneType = ZoneType.COMMERCIAL;
        break;
      case BuildingType.FACTORY:
        height = 1.5;
        color = 0xffaa88;
        buildingZoneType = ZoneType.INDUSTRIAL;
        break;
      case BuildingType.SHOP:
        height = 1;
        color = 0xffdd88;
        buildingZoneType = ZoneType.COMMERCIAL;
        break;
      case BuildingType.PARK:
        height = 0.1;
        color = 0x88ff88;
        buildingZoneType = ZoneType.PARK;
        break;
      case BuildingType.ROAD_STRAIGHT:
      case BuildingType.ROAD_CORNER:
      case BuildingType.ROAD_INTERSECTION:
      case BuildingType.ROAD_TJUNCTION:
        height = 0.1;
        color = 0x444444;
        buildingZoneType = ZoneType.ROAD;
        break;
      default:
        return null;
    }
    
    // Create physics body
    const boxSize = new CANNON.Vec3(width / 2, height / 2, depth / 2);
    const boxShape = new CANNON.Box(boxSize);
    const boxBody = new CANNON.Body({
      mass: 0, // static body
      shape: boxShape,
    });
    
    boxBody.position.set(position.x, height / 2, position.z);
    boxBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), (rotation * Math.PI) / 180);
    world.addBody(boxBody);
    
    // Create visual mesh
    let geometry;
    let materials = [];
    
    // Create different geometries based on building type
    if (buildingType === BuildingType.ROAD_STRAIGHT || 
        buildingType === BuildingType.ROAD_CORNER || 
        buildingType === BuildingType.ROAD_INTERSECTION || 
        buildingType === BuildingType.ROAD_TJUNCTION) {
      // Road geometries
      geometry = new THREE.BoxGeometry(width, height, depth);
      
      // Use road texture
      const material = new THREE.MeshStandardMaterial({ 
        color,
        map: roadTexture,
        roughness: 0.9,
        metalness: 0.1
      });
      
      materials = [material, material, material, material, material, material];
    } else if (buildingType === BuildingType.PARK) {
      // Park geometry
      geometry = new THREE.BoxGeometry(width, height, depth);
      const material = new THREE.MeshStandardMaterial({ color });
      materials = [material, material, material, material, material, material];
    } else {
      // Building geometries
      const buildingWidth = width * 0.8;
      const buildingDepth = depth * 0.8;
      
      geometry = new THREE.BoxGeometry(buildingWidth, height, buildingDepth);
      
      // Select the appropriate building texture based on zone type
      let buildingTexture;
      switch (buildingZoneType) {
        case ZoneType.RESIDENTIAL:
          buildingTexture = buildingTextures.residential;
          break;
        case ZoneType.COMMERCIAL:
          buildingTexture = buildingTextures.commercial;
          break;
        case ZoneType.INDUSTRIAL:
          buildingTexture = buildingTextures.industrial;
          break;
        default:
          buildingTexture = concreteTexture;
      }
      
      // Create materials for each face of the building
      // We'll use the building texture for all sides
      const sideMaterial = new THREE.MeshStandardMaterial({
        color,
        map: buildingTexture,
        roughness: 0.7,
        metalness: 0.3
      });
      
      // Top and bottom can use concrete texture
      const topBottomMaterial = new THREE.MeshStandardMaterial({
        color,
        map: concreteTexture,
        roughness: 0.8,
        metalness: 0.2
      });
      
      // Order: right, left, top, bottom, front, back
      materials = [
        sideMaterial.clone(), // right
        sideMaterial.clone(), // left
        topBottomMaterial.clone(), // top
        topBottomMaterial.clone(), // bottom
        sideMaterial.clone(), // front
        sideMaterial.clone()  // back
      ];
      
      // Adjust texture repeat based on building height
      materials.forEach(mat => {
        if (mat.map) {
          mat.map.repeat.set(1, height / 2);
          mat.map.needsUpdate = true;
        }
      });
    }
    
    // Create mesh with materials
    const mesh = new THREE.Mesh(geometry, materials.length === 1 ? materials[0] : materials);
    mesh.position.set(position.x, height / 2, position.z);
    mesh.rotation.y = (rotation * Math.PI) / 180;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    scene.add(mesh);
    
    // Update cell data
    cell.object = mesh;
    cell.body = boxBody;
    cell.buildingType = buildingType;
    cell.rotation = rotation;
    cell.height = height;
    
    return { body: boxBody, object: mesh };
  };
  
  // Create a city block with multiple buildings
  const createCityBlock = (
    startX: number,
    startZ: number,
    blockWidth: number,
    blockHeight: number,
    scene: THREE.Scene,
    world: CANNON.World,
    zoneType: ZoneType = ZoneType.RESIDENTIAL
  ) => {
    // Create roads around the block
    for (let x = startX; x < startX + blockWidth; x++) {
      createBuilding(x, startZ - 1, BuildingType.ROAD_STRAIGHT, scene, world, 90);
      createBuilding(x, startZ + blockHeight, BuildingType.ROAD_STRAIGHT, scene, world, 90);
    }
    
    for (let z = startZ; z < startZ + blockHeight; z++) {
      createBuilding(startX - 1, z, BuildingType.ROAD_STRAIGHT, scene, world, 0);
      createBuilding(startX + blockWidth, z, BuildingType.ROAD_STRAIGHT, scene, world, 0);
    }
    
    // Create corner roads
    createBuilding(startX - 1, startZ - 1, BuildingType.ROAD_CORNER, scene, world, 0);
    createBuilding(startX + blockWidth, startZ - 1, BuildingType.ROAD_CORNER, scene, world, 90);
    createBuilding(startX - 1, startZ + blockHeight, BuildingType.ROAD_CORNER, scene, world, 270);
    createBuilding(startX + blockWidth, startZ + blockHeight, BuildingType.ROAD_CORNER, scene, world, 180);
    
    // Fill the block with buildings based on zone type
    for (let x = startX; x < startX + blockWidth; x++) {
      for (let z = startZ; z < startZ + blockHeight; z++) {
        // Set zone type
        setZoneType(x, z, zoneType);
        
        // Create random buildings based on zone type
        let buildingType = BuildingType.NONE;
        const rotation = Math.floor(Math.random() * 4) * 90;
        
        switch (zoneType) {
          case ZoneType.RESIDENTIAL:
            const residentialTypes = [
              BuildingType.HOUSE_SMALL,
              BuildingType.HOUSE_MEDIUM,
              BuildingType.HOUSE_LARGE,
              BuildingType.APARTMENT
            ];
            buildingType = residentialTypes[Math.floor(Math.random() * residentialTypes.length)];
            break;
            
          case ZoneType.COMMERCIAL:
            const commercialTypes = [
              BuildingType.OFFICE_SMALL,
              BuildingType.OFFICE_MEDIUM,
              BuildingType.OFFICE_LARGE,
              BuildingType.SHOP
            ];
            buildingType = commercialTypes[Math.floor(Math.random() * commercialTypes.length)];
            break;
            
          case ZoneType.INDUSTRIAL:
            buildingType = BuildingType.FACTORY;
            break;
            
          case ZoneType.PARK:
            buildingType = BuildingType.PARK;
            break;
            
          default:
            continue;
        }
        
        createBuilding(x, z, buildingType, scene, world, rotation);
      }
    }
  };
  
  // Create a simple city layout
  const createSimpleCity = (scene: THREE.Scene, world: CANNON.World) => {
    initializeGrid();
    createVisualGrid(scene);
    createGround(scene, world);
    
    // Create residential blocks
    createCityBlock(1, 1, 4, 4, scene, world, ZoneType.RESIDENTIAL);
    createCityBlock(7, 1, 3, 4, scene, world, ZoneType.RESIDENTIAL);
    
    // Create commercial blocks
    createCityBlock(1, 7, 4, 3, scene, world, ZoneType.COMMERCIAL);
    
    // Create industrial blocks
    createCityBlock(7, 7, 3, 3, scene, world, ZoneType.INDUSTRIAL);
    
    // Create a park
    createCityBlock(12, 1, 2, 2, scene, world, ZoneType.PARK);
  };
  
  return {
    grid,
    gridObjects,
    initializeGrid,
    gridToWorld,
    worldToGrid,
    setZoneType,
    setBuildingType,
    getCell,
    createVisualGrid,
    createGround,
    createBuilding,
    createCityBlock,
    createSimpleCity
  };
} 