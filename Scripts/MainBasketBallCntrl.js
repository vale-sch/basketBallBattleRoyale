"use strict";
var basketBallBattleRoyale;
(function (basketBallBattleRoyale) {
    var fCore = FudgeCore;
    window.addEventListener("load", start);
    basketBallBattleRoyale.players = new Array(new fCore.Node(""));
    let cmpMeshFloorTiles = new Array(new fCore.ComponentMesh());
    let floorContainer;
    let staticEnvContainer;
    let collMeshesOfBasketStand = new Array(new fCore.ComponentMesh());
    let collMeshesOfBasketTrigger = new Array(new fCore.ComponentMesh());
    let rgdBdyEnemies = new Array(new fCore.ComponentRigidbody());
    let viewport;
    async function start(_event) {
        //initialisation
        await fCore.Project.loadResourcesFromHTML();
        basketBallBattleRoyale.bskBallRoot = (fCore.Project.resources["Graph|2021-06-02T10:15:15.171Z|84209"]);
        basketBallBattleRoyale.cmpCamera = new fCore.ComponentCamera();
        basketBallBattleRoyale.cmpCamera.clrBackground = fCore.Color.CSS("BLACK");
        basketBallBattleRoyale.cmpCamera.mtxPivot.translateY(2.5);
        basketBallBattleRoyale.canvas = document.querySelector("canvas");
        viewport = new fCore.Viewport();
        viewport.initialize("Viewport", basketBallBattleRoyale.bskBallRoot, basketBallBattleRoyale.cmpCamera, basketBallBattleRoyale.canvas);
        //get refrences of important tree hierachy objects
        staticEnvContainer = basketBallBattleRoyale.bskBallRoot.getChild(0);
        floorContainer = staticEnvContainer.getChild(0).getChild(0);
        let response = await fetch("./JSON/Config.json");
        let textResponse = await response.text();
        console.log(textResponse);
        //basketBalls
        // tslint:disable-next-line: no-unused-expression
        new basketBallBattleRoyale.BasketBallSpawner();
        basketBallBattleRoyale.playersContainer = basketBallBattleRoyale.basketBallContainer.getChild(0);
        for (let i = 0; i < basketBallBattleRoyale.playersContainer.getChildren().length; i++)
            basketBallBattleRoyale.players[i] = basketBallBattleRoyale.playersContainer.getChild(i).getChild(1);
        //create static Colliders and dynamic rigidbodies
        createandHandleRigidbodies();
        //initialize avatar
        let avatarController = new basketBallBattleRoyale.AvatarController(basketBallBattleRoyale.playersContainer, collMeshesOfBasketTrigger, basketBallBattleRoyale.players);
        avatarController.start();
        fCore.Physics.adjustTransforms(basketBallBattleRoyale.bskBallRoot, true);
        //deactivate pre build meshes from editor, only colliders were needed
        for (let collMeshBasket of collMeshesOfBasketStand) {
            collMeshBasket.activate(false);
            collMeshBasket.getContainer().getParent().getChild(0).activate(false);
        }
        for (let collMeshTrigger of collMeshesOfBasketTrigger)
            collMeshTrigger.activate(false);
        for (let cmpMeshFloorTile of cmpMeshFloorTiles)
            cmpMeshFloorTile.activate(false);
        basketBallBattleRoyale.Hud.start();
        fCore.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
        console.log(basketBallBattleRoyale.bskBallRoot);
    }
    async function update() {
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
    function createandHandleRigidbodies() {
        //floorTiles
        let counterFloorTiles = 0;
        for (let cylinderFloorAndWallColl of floorContainer.getChildren()) {
            if (counterFloorTiles == 0) {
                let staticRgdbdy = new fCore.ComponentRigidbody(0, fCore.PHYSICS_TYPE.STATIC, fCore.COLLIDER_TYPE.CYLINDER, fCore.PHYSICS_GROUP.DEFAULT);
                basketBallBattleRoyale.cylFloor = cylinderFloorAndWallColl;
                cylinderFloorAndWallColl.addComponent(staticRgdbdy);
            }
            else {
                cmpMeshFloorTiles[counterFloorTiles] = cylinderFloorAndWallColl.getComponent(fCore.ComponentMesh);
                let staticRgdbdy = new fCore.ComponentRigidbody(0, fCore.PHYSICS_TYPE.STATIC, fCore.COLLIDER_TYPE.CUBE, fCore.PHYSICS_GROUP.DEFAULT);
                cylinderFloorAndWallColl.addComponent(staticRgdbdy);
            }
            counterFloorTiles++;
        }
        //Basket, Stand and other Colliders of Players 
        let counterStand = 0;
        let counterTrigger = 0;
        for (let player of basketBallBattleRoyale.playersContainer.getChildren()) {
            for (let containerOfMeshAndTrigger of player.getChildren()) {
                for (let meshAndTrigger of containerOfMeshAndTrigger.getChildren()) {
                    if (meshAndTrigger.name == "Mesh") {
                        for (let meshChild of meshAndTrigger.getChild(1).getChildren()) {
                            let staticRgdbdy = new fCore.ComponentRigidbody(0, fCore.PHYSICS_TYPE.STATIC, fCore.COLLIDER_TYPE.CUBE, fCore.PHYSICS_GROUP.DEFAULT);
                            meshChild.addComponent(staticRgdbdy);
                        }
                        collMeshesOfBasketStand[counterStand] = meshAndTrigger.getChild(0).getChild(1).getComponent(fCore.ComponentMesh);
                        counterStand++;
                        let staticRgdbdy = new fCore.ComponentRigidbody(0, fCore.PHYSICS_TYPE.STATIC, fCore.COLLIDER_TYPE.CUBE, fCore.PHYSICS_GROUP.DEFAULT);
                        let staticRgdbdy1 = new fCore.ComponentRigidbody(0, fCore.PHYSICS_TYPE.STATIC, fCore.COLLIDER_TYPE.CUBE, fCore.PHYSICS_GROUP.DEFAULT);
                        meshAndTrigger.getChild(0).addComponent(staticRgdbdy);
                        meshAndTrigger.getChild(0).getChild(0).addComponent(staticRgdbdy1);
                        let staticRgdbdy2 = new fCore.ComponentRigidbody(0, fCore.PHYSICS_TYPE.STATIC, fCore.COLLIDER_TYPE.CUBE, fCore.PHYSICS_GROUP.DEFAULT);
                        meshAndTrigger.getChild(0).getChild(1).addComponent(staticRgdbdy2);
                        meshAndTrigger.getChild(0).getChild(1).mtxWorld.translateZ(-2);
                    }
                    if (meshAndTrigger.name == "Trigger") {
                        collMeshesOfBasketTrigger[counterTrigger] = meshAndTrigger.getComponent(fCore.ComponentMesh);
                        let staticTrigger = new fCore.ComponentRigidbody(0, fCore.PHYSICS_TYPE.STATIC, fCore.COLLIDER_TYPE.CUBE, fCore.PHYSICS_GROUP.TRIGGER);
                        meshAndTrigger.addComponent(staticTrigger);
                        meshAndTrigger.addComponent(new basketBallBattleRoyale.BasketBallBasketTrigger(meshAndTrigger));
                        counterTrigger++;
                    }
                }
            }
        }
        //enemies rigidbodys
        let counterRgdBdy = 0;
        for (let player of basketBallBattleRoyale.playersContainer.getChildren()) {
            if (player.name != "AvatarsContainer") {
                let body = player.getChild(1);
                let dynamicEnemyRgdbdy = new fCore.ComponentRigidbody(75, fCore.PHYSICS_TYPE.DYNAMIC, fCore.COLLIDER_TYPE.CYLINDER, fCore.PHYSICS_GROUP.DEFAULT);
                dynamicEnemyRgdbdy.restitution = 0.1;
                dynamicEnemyRgdbdy.rotationInfluenceFactor = fCore.Vector3.Y(1);
                dynamicEnemyRgdbdy.friction = 1;
                body.addComponent(dynamicEnemyRgdbdy);
                // tslint:disable-next-line: no-unused-expression
                player.addComponent(new basketBallBattleRoyale.EnemiesController(player.getChild(1), dynamicEnemyRgdbdy, collMeshesOfBasketTrigger));
                rgdBdyEnemies[counterRgdBdy] = dynamicEnemyRgdbdy;
                counterRgdBdy++;
            }
        }
    }
})(basketBallBattleRoyale || (basketBallBattleRoyale = {}));
//# sourceMappingURL=MainBasketBallCntrl.js.map