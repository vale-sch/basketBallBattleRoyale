namespace basketBallBattleRoyale {

  import fCore = FudgeCore;

  let cmpMeshFloorTiles: fCore.ComponentMesh[] = new Array(new fCore.ComponentMesh());
  let floorContainer: fCore.Node;
  let staticEnvContainer: fCore.Node;
  let collMeshesOfBasketStand: fCore.ComponentMesh[] = new Array(new fCore.ComponentMesh());
  let collMeshesOfBasketTrigger: fCore.ComponentMesh[] = new Array(new fCore.ComponentMesh());
  let rgdBdyEnemies: fCore.ComponentRigidbody[] = new Array(new fCore.ComponentRigidbody());
  let viewport: fCore.Viewport;

  let shot: fCore.Audio = new fCore.Audio("/basketBallBattleRoyale/Audio/shot.wav");
  let goal: fCore.Audio = new fCore.Audio("/basketBallBattleRoyale/Audio/goal.wav");
  let background: fCore.Audio = new fCore.Audio("/basketBallBattleRoyale/Audio/background.mp3");
  let win: fCore.Audio = new fCore.Audio("/basketBallBattleRoyale/Audio/win.wav");
  let loose: fCore.Audio = new fCore.Audio("/basketBallBattleRoyale/Audio/loose.wav");
  let death: fCore.Audio = new fCore.Audio("/basketBallBattleRoyale/Audio/death.mp3");
  export let cmpAudBackground: fCore.ComponentAudio = new fCore.ComponentAudio(background, true, true);
  export let cmpAudShot: fCore.ComponentAudio = new fCore.ComponentAudio(shot);
  export let cmpAudGoal: fCore.ComponentAudio = new fCore.ComponentAudio(goal);
  export let cmpAudWin: fCore.ComponentAudio = new fCore.ComponentAudio(win);
  export let cmpAudLoose: fCore.ComponentAudio = new fCore.ComponentAudio(loose);
  export let cmpAudDeath: fCore.ComponentAudio = new fCore.ComponentAudio(death);

  export let players: fCore.Node[] = new Array(new fCore.Node(""));
  export let avatarNode: fCore.Node;
  export let cmpCamera: fCore.ComponentCamera;
  export let cylFloor: fCore.Node;
  export let canvas: HTMLCanvasElement;
  export let playersContainer: fCore.Node;

  export async function init(): Promise<void> {
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
    //initialisation

    //get refrences of important tree hierachy objects
    staticEnvContainer = bskBallRoot.getChild(0);
    floorContainer = staticEnvContainer.getChild(0).getChild(0);
    //basketBalls
    // tslint:disable-next-line: no-unused-expression
    new BasketBallSpawner();
    playersContainer = basketBallContainer.getChild(0);
    for (let i: number = 0; i < playersContainer.getChildren().length; i++)
      players[i] = playersContainer.getChild(i).getChild(1);

    //create static Colliders and dynamic rigidbodies
    createandHandleRigidbodies();

    //initialize avatar
    // tslint:disable-next-line: no-unused-expression
    new AvatarController(players);


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
    //setup audio and connection to html elements
    setupAudio();
    Hud.start();
    //start loop
    fCore.Loop.addEventListener(fCore.EVENT.LOOP_FRAME, update);
    fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
    console.log("game has started succesfully - root graph underneath")
    console.log(bskBallRoot);
  }

  async function update(): Promise<void> {
    ƒ.Physics.world.simulate(fCore.Loop.timeFrameReal / 1000);

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

  function setupAudio(): void {
    let cmpListener: fCore.ComponentAudioListener = new fCore.ComponentAudioListener();
    cmpCamera.getContainer().addComponent(cmpListener);

    let audioNode: fCore.Node = new fCore.Node("audioNode");

    cmpAudBackground.volume = (parseInt(sliderAudio.value) / 100) / 1.25;
    cmpAudGoal.volume = (parseInt(sliderAudio.value) / 100) / 2.5;
    cmpAudShot.volume = (parseInt(sliderAudio.value) / 100);
    cmpAudDeath.volume = (parseInt(sliderAudio.value) / 100) * 2;
    cmpAudWin.volume = (parseInt(sliderAudio.value) / 100) * 2;
    cmpAudLoose.volume = (parseInt(sliderAudio.value) / 100) * 2;

    audioNode.addComponent(cmpAudBackground);
    audioNode.addComponent(cmpAudGoal);
    audioNode.addComponent(cmpAudShot);
    audioNode.addComponent(cmpAudWin);
    audioNode.addComponent(cmpAudLoose);
    audioNode.addComponent(cmpAudDeath);
    avatarNode.appendChild(audioNode);

    fCore.AudioManager.default.listenWith(cmpListener);
    fCore.AudioManager.default.listenTo(bskBallRoot);
  }

  function createandHandleRigidbodies(): void {
    //floorTiles
    let counterFloorTiles: number = 0;
    let staticRgdbdyTrigger: fCore.ComponentRigidbody = new fCore.ComponentRigidbody(
      0,
      fCore.PHYSICS_TYPE.STATIC,
      fCore.COLLIDER_TYPE.CYLINDER,
      fCore.PHYSICS_GROUP.TRIGGER
    );
    staticEnvContainer.getChild(1).getChild(0).addComponent(staticRgdbdyTrigger);
    staticEnvContainer.getChild(1).getChild(0).addComponent(new CheckOfOutRangeBalls(staticEnvContainer.getChild(1).getChild(0)));
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
            // add basketballtrigger script component
            meshAndTrigger.addComponent(new BasketBallBasketTrigger(meshAndTrigger));
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
