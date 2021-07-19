namespace basketBallBattleRoyale {

  import fCore = FudgeCore;
  window.addEventListener("load", start);

  let hitsCounterAvatar: number = 10;
  let hitsCounterEnemyBlue: number = 10;
  let hitsCounterEnemyRed: number = 10;
  let hitsCounterEnemyMagenta: number = 10;
  let allCounters: number[] = Array<number>(4);
  let parentToRemove: fCore.Node;
  let isRemoving: boolean = false;
  let removingTime: number = 0.75;
  let rgdBdyToRemove: fCore.ComponentRigidbody;

  export function hndTriggerAvatar(_event: fCore.EventPhysics): void {
    if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab") {
      _event.cmpRigidbody.getContainer().getComponent(BasketBallsController).isInUse = false;
      // tslint:disable-next-line: no-use-before-declare
      basketBalls.forEach(basketBall => {
        if (basketBall.getParent() == _event.cmpRigidbody.getContainer().getParent()) {
          parentToRemove = _event.cmpRigidbody.getContainer().getParent();
        }
      });
      rgdBdyToRemove = _event.cmpRigidbody;
      gameState.hitsAvatar = "Avatar Leben: " + --hitsCounterAvatar;
      isRemoving = true;

    }
  }

  export function hndTriggerEnemyBlue(_event: fCore.EventPhysics): void {
    if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab") {
      _event.cmpRigidbody.getContainer().getComponent(BasketBallsController).isInUse = false;


      // tslint:disable-next-line: no-use-before-declare
      basketBalls.forEach(basketBall => {
        if (basketBall.getParent() == _event.cmpRigidbody.getContainer().getParent()) {
          parentToRemove = _event.cmpRigidbody.getContainer().getParent();
        }
      });
      rgdBdyToRemove = _event.cmpRigidbody;
      gameState.hitsEnemyBlue = "EnemyBlue Leben: " + --hitsCounterEnemyBlue;
      isRemoving = true;
    }
  }

  export function hndTriggerEnemyRed(_event: fCore.EventPhysics): void {
    if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab") {
      _event.cmpRigidbody.getContainer().getComponent(BasketBallsController).isInUse = false;

      // tslint:disable-next-line: no-use-before-declare
      basketBalls.forEach(basketBall => {
        if (basketBall.getParent() == _event.cmpRigidbody.getContainer().getParent()) {
          parentToRemove = _event.cmpRigidbody.getContainer().getParent();
        }
      });
      rgdBdyToRemove = _event.cmpRigidbody;
      gameState.hitsEnemyRed = "EnemyRed Leben: " + --hitsCounterEnemyRed;
      isRemoving = true;
    }
  }

  export function hndTriggerEnemyMagenta(_event: fCore.EventPhysics): void {
    if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab") {
      _event.cmpRigidbody.getContainer().getComponent(BasketBallsController).isInUse = false;

      // tslint:disable-next-line: no-use-before-declare
      basketBalls.forEach(basketBall => {
        if (basketBall.getParent() == _event.cmpRigidbody.getContainer().getParent()) {
          parentToRemove = _event.cmpRigidbody.getContainer().getParent();
        }
      });
      rgdBdyToRemove = _event.cmpRigidbody;
      gameState.hitsEnemyMagenta = "EnemyMagenta Leben: " + --hitsCounterEnemyMagenta;
      isRemoving = true;
    }
  }


  export let players: fCore.Node[] = new Array(new fCore.Node(""));
  export let avatarNode: fCore.Node;
  export let cmpCamera: fCore.ComponentCamera;
  export let cylFloor: fCore.Node;
  export let canvas: HTMLCanvasElement;

  let cmpMeshFloorTiles: fCore.ComponentMesh[] = new Array(new fCore.ComponentMesh());


  let floorContainer: fCore.Node;
  let staticEnvContainer: fCore.Node;
  export let playersContainer: fCore.Node;

  let collMeshesOfBasketStand: fCore.ComponentMesh[] = new Array(new fCore.ComponentMesh());
  let collMeshesOfBasketTrigger: fCore.ComponentMesh[] = new Array(new fCore.ComponentMesh());
  let rgdBdyEnemies: fCore.ComponentRigidbody[] = new Array(new fCore.ComponentRigidbody());



  let viewport: fCore.Viewport;


  async function start(_event: Event): Promise<void> {
    //initialisation
    await fCore.Project.loadResourcesFromHTML();

    bskBallRoot = <fCore.Graph>(
      fCore.Project.resources["Graph|2021-06-02T10:15:15.171Z|84209"]
    );
    cmpCamera = new fCore.ComponentCamera();
    cmpCamera.clrBackground = fCore.Color.CSS("BLACK");
    cmpCamera.mtxPivot.translateY(2.5);

    canvas = document.querySelector("canvas");
    viewport = new fCore.Viewport();
    viewport.initialize("Viewport", bskBallRoot, cmpCamera, canvas);


    for (let i: number = 0; i < allCounters.length; i++)

      //get refrences of important tree hierachy objects
      staticEnvContainer = bskBallRoot.getChild(0);
    floorContainer = staticEnvContainer.getChild(0).getChild(0);



    let response: Response = await fetch("./JSON/Config.json");
    let textResponse: string = await response.text();
    console.log(textResponse);


    //basketBalls
    // tslint:disable-next-line: no-unused-expression
    new BasketBallSpawner();
    playersContainer = basketBallContainer.getChild(0);
    for (let i: number = 0; i < playersContainer.getChildren().length; i++)
      players[i] = playersContainer.getChild(i).getChild(1);

    //create static Colliders and dynamic rigidbodies
    createandHandleRigidbodies();


    //initialize avatar
    let avatarController: AvatarController = new AvatarController(playersContainer, collMeshesOfBasketTrigger, players);

    avatarController.start();
    fCore.Physics.adjustTransforms(bskBallRoot, true);

    //deactivate pre build meshes from editor, only colliders were needed
    for (let collMeshBasket of collMeshesOfBasketStand) {
      collMeshBasket.activate(false);
      collMeshBasket.getContainer().getParent().getChild(0).activate(false);
    }

    for (let collMeshTrigger of collMeshesOfBasketTrigger)
      collMeshTrigger.activate(false);
    for (let cmpMeshFloorTile of cmpMeshFloorTiles)
      cmpMeshFloorTile.activate(false);
    Hud.start();
    setGameState();


    fCore.Loop.addEventListener(fCore.EVENT.LOOP_FRAME, update);
    fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);

    console.log(bskBallRoot);
  }

  function setGameState(): void {
    gameState.hitsAvatar = "Avatar Leben: " + hitsCounterAvatar;
    gameState.hitsEnemyBlue = "EnemyBlue Leben: " + hitsCounterEnemyBlue;
    gameState.hitsEnemyRed = "EnemyRed Leben: " + hitsCounterEnemyRed;
    gameState.hitsEnemyMagenta = "EnemyMagenta Leben: " + hitsCounterEnemyMagenta;
  }

  async function update(): Promise<void> {
    ƒ.Physics.world.simulate(fCore.Loop.timeFrameReal / 1000);
    for (let i: number = 0; i < allCounters.length; i++) {
      switch (i) {
        case 0: allCounters[0] = hitsCounterAvatar;
        case 1: allCounters[1] = hitsCounterEnemyBlue;
        case 2: allCounters[2] = hitsCounterEnemyRed;
        case 3: allCounters[3] = hitsCounterEnemyMagenta;
      }
      if (allCounters[i] <= 0)
        switch (i) {
          case (0): console.log("Avatar is going to bed");
          case (1): console.log("EnemyBlue is going to bed");
          case (2): console.log("EnemyRed is going to bed");
          case (3): console.log("EnemyMagenta is going to bed");
        }
    }



    //sub functionality of triggers
    if (isRemoving) {
      removingTime -= fCore.Loop.timeFrameReal / 1000;
      if (removingTime <= 0) {
        basketBalls.splice(basketBalls.indexOf(parentToRemove.getChild(0)), 1);
        rgdBdyToRemove.getContainer().removeComponent(rgdBdyToRemove);
        basketBallContainer.getChild(1).removeChild(parentToRemove);

        isRemoving = false;
        removingTime = 0.75;
      }
    }
    //debug keyboard events
    if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.T]))
      fCore.Physics.settings.debugMode =
        fCore.Physics.settings.debugMode ==
          fCore.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER
          ? fCore.PHYSICS_DEBUGMODE.PHYSIC_OBJECTS_ONLY
          : fCore.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;
    if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.Y]))
      fCore.Physics.settings.debugDraw = !fCore.Physics.settings.debugDraw;

    viewport.draw();
  }


  function createandHandleRigidbodies(): void {
    //floorTiles
    let counterFloorTiles: number = 0;
    for (let cylinderFloorAndWallColl of floorContainer.getChildren()) {
      if (counterFloorTiles == 0) {
        let staticRgdbdy: fCore.ComponentRigidbody = new fCore.ComponentRigidbody(
          0,
          fCore.PHYSICS_TYPE.STATIC,
          fCore.COLLIDER_TYPE.CYLINDER,
          fCore.PHYSICS_GROUP.DEFAULT
        );
        cylFloor = cylinderFloorAndWallColl;
        cylinderFloorAndWallColl.addComponent(staticRgdbdy);
      } else {
        cmpMeshFloorTiles[counterFloorTiles] = cylinderFloorAndWallColl.getComponent(fCore.ComponentMesh);
        let staticRgdbdy: fCore.ComponentRigidbody = new fCore.ComponentRigidbody(
          0,
          fCore.PHYSICS_TYPE.STATIC,
          fCore.COLLIDER_TYPE.CUBE,
          fCore.PHYSICS_GROUP.DEFAULT
        );
        cylinderFloorAndWallColl.addComponent(staticRgdbdy);
      }
      counterFloorTiles++;
    }

    //Basket, Stand and other Colliders of Players 
    let counterStand: number = 0;
    let counterTrigger: number = 0;
    for (let player of playersContainer.getChildren()) {
      for (let containerOfMeshAndTrigger of player.getChildren()) {
        for (let meshAndTrigger of containerOfMeshAndTrigger.getChildren()) {
          if (meshAndTrigger.name == "Mesh") {
            for (let meshChild of meshAndTrigger.getChild(1).getChildren()) {
              let staticRgdbdy: fCore.ComponentRigidbody = new fCore.ComponentRigidbody(
                0,
                fCore.PHYSICS_TYPE.STATIC,
                fCore.COLLIDER_TYPE.CUBE,
                fCore.PHYSICS_GROUP.DEFAULT
              );
              meshChild.addComponent(staticRgdbdy);
            }

            collMeshesOfBasketStand[counterStand] = meshAndTrigger.getChild(0).getChild(1).getComponent(fCore.ComponentMesh);
            counterStand++;
            let staticRgdbdy: fCore.ComponentRigidbody = new fCore.ComponentRigidbody(
              0,
              fCore.PHYSICS_TYPE.STATIC,
              fCore.COLLIDER_TYPE.CUBE,
              fCore.PHYSICS_GROUP.DEFAULT
            );
            let staticRgdbdy1: fCore.ComponentRigidbody = new fCore.ComponentRigidbody(
              0,
              fCore.PHYSICS_TYPE.STATIC,
              fCore.COLLIDER_TYPE.CUBE,
              fCore.PHYSICS_GROUP.DEFAULT
            );
            meshAndTrigger.getChild(0).addComponent(staticRgdbdy);
            meshAndTrigger.getChild(0).getChild(0).addComponent(staticRgdbdy1);
            let staticRgdbdy2: fCore.ComponentRigidbody = new fCore.ComponentRigidbody(
              0,
              fCore.PHYSICS_TYPE.STATIC,
              fCore.COLLIDER_TYPE.CUBE,
              fCore.PHYSICS_GROUP.DEFAULT
            );
            meshAndTrigger.getChild(0).getChild(1).addComponent(staticRgdbdy2);
            meshAndTrigger.getChild(0).getChild(1).mtxWorld.translateZ(-2);
          }
          if (meshAndTrigger.name == "Trigger") {
            collMeshesOfBasketTrigger[counterTrigger] = meshAndTrigger.getComponent(fCore.ComponentMesh);
            let staticTrigger: fCore.ComponentRigidbody = new fCore.ComponentRigidbody(
              0,
              fCore.PHYSICS_TYPE.STATIC,
              fCore.COLLIDER_TYPE.CUBE,
              fCore.PHYSICS_GROUP.TRIGGER
            );

            meshAndTrigger.addComponent(staticTrigger);
            switch (counterTrigger) {
              case (0):
                meshAndTrigger.getComponent(fCore.ComponentRigidbody).addEventListener(fCore.EVENT_PHYSICS.TRIGGER_ENTER, hndTriggerAvatar);
                break;
              case (1):
                meshAndTrigger.getComponent(fCore.ComponentRigidbody).addEventListener(fCore.EVENT_PHYSICS.TRIGGER_ENTER, hndTriggerEnemyBlue);
                break;
              case (2):
                meshAndTrigger.getComponent(fCore.ComponentRigidbody).addEventListener(fCore.EVENT_PHYSICS.TRIGGER_ENTER, hndTriggerEnemyRed);
                break;
              case (3):
                meshAndTrigger.getComponent(fCore.ComponentRigidbody).addEventListener(fCore.EVENT_PHYSICS.TRIGGER_ENTER, hndTriggerEnemyMagenta);
                break;
            }
            counterTrigger++;
          }
        }
      }
    }

    //enemies rigidbodys
    let counterRgdBdy: number = 0;
    for (let player of playersContainer.getChildren()) {
      if (player.name != "AvatarsContainer") {

        let body: fCore.Node = player.getChild(1);
        let dynamicEnemyRgdbdy: fCore.ComponentRigidbody = new fCore.ComponentRigidbody(
          75,
          fCore.PHYSICS_TYPE.DYNAMIC,
          fCore.COLLIDER_TYPE.CYLINDER,
          fCore.PHYSICS_GROUP.DEFAULT
        );
        dynamicEnemyRgdbdy.restitution = 0.1;
        dynamicEnemyRgdbdy.rotationInfluenceFactor = fCore.Vector3.Y(1);
        dynamicEnemyRgdbdy.friction = 1;
        body.addComponent(dynamicEnemyRgdbdy);

        // tslint:disable-next-line: no-unused-expression
        player.addComponent(new EnemiesController(player.getChild(1), dynamicEnemyRgdbdy, collMeshesOfBasketTrigger));
        rgdBdyEnemies[counterRgdBdy] = dynamicEnemyRgdbdy;
        counterRgdBdy++;
      }
    }
  }
}
