"use strict";
var basketBallBattleRoyale;
(function (basketBallBattleRoyale) {
    var fCore = FudgeCore;
    basketBallBattleRoyale.basketBalls = new Array(new fCore.Node(""));
    class BasketBallSpawner {
        constructor() {
            this.update = () => {
                if (basketBallBattleRoyale.players.length > this.checkBasketBallsAmount() && !this.isSpawning) {
                    let rndPos = new fCore.Vector3(new fCore.Random().getRange(-15, 15), new fCore.Random().getRange(30, 60), new fCore.Random().getRange(-15, 15));
                    this.spawnBalls(rndPos);
                }
            };
            this.start();
        }
        async start() {
            basketBallBattleRoyale.basketBallContainer = basketBallBattleRoyale.bskBallRoot.getChild(1);
            basketBallBattleRoyale.basketBallGraphInstance = fCore.Project.resources["Graph|2021-06-10T09:58:39.176Z|64274"];
            fCore.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
        }
        async spawnBalls(_rndPos) {
            this.isSpawning = true;
            let basketBallCloneGraph = await fCore.Project.createGraphInstance(basketBallBattleRoyale.basketBallGraphInstance);
            let dynamicRgdbdy = new fCore.ComponentRigidbody(25, fCore.PHYSICS_TYPE.DYNAMIC, fCore.COLLIDER_TYPE.SPHERE, fCore.PHYSICS_GROUP.GROUP_2);
            dynamicRgdbdy.friction = 1;
            dynamicRgdbdy.rotationInfluenceFactor = new fCore.Vector3(1, 1, 1);
            basketBallCloneGraph.getChild(0).addComponent(dynamicRgdbdy);
            basketBallBattleRoyale.basketBallContainer.getChild(1).appendChild(basketBallCloneGraph);
            dynamicRgdbdy.setPosition(_rndPos);
            this.isSpawning = false;
        }
        checkBasketBallsAmount() {
            let i = 0;
            basketBallBattleRoyale.basketBalls = new Array(new fCore.Node(""));
            basketBallBattleRoyale.basketBallContainer.getChild(1).getChildren().forEach(basketBallGraphInstance => {
                basketBallBattleRoyale.basketBalls[i] = basketBallGraphInstance.getChild(0);
                i++;
            });
            return i;
        }
    }
    basketBallBattleRoyale.BasketBallSpawner = BasketBallSpawner;
})(basketBallBattleRoyale || (basketBallBattleRoyale = {}));
//# sourceMappingURL=BasketBallSpawner.js.map