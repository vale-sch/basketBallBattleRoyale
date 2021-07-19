namespace basketBallBattleRoyale {
    import fCore = FudgeCore;

    export let bskBallRoot: fCore.Graph;

    export let basketBalls: fCore.Node[] = new Array(new fCore.Node(""));
    export let basketBallContainer: fCore.Node;
    export let basketBallGraphInstance: fCore.Graph;

    export class BasketBallSpawner {

        private isSpawning: boolean;
        constructor() {
            this.start();
        }
        private async start(): Promise<void> {

            basketBallContainer = bskBallRoot.getChild(1);
            basketBallGraphInstance = <fCore.Graph>fCore.Project.resources["Graph|2021-06-10T09:58:39.176Z|64274"];
            fCore.Loop.addEventListener(fCore.EVENT.LOOP_FRAME, this.update);
            fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
        }

        private update = (): void => {
            if (players.length > this.checkBasketBallsAmount() && !this.isSpawning) {
                let rndPos: fCore.Vector3 = new fCore.Vector3(new fCore.Random().getRange(-15, 15), new fCore.Random().getRange(30, 60), new fCore.Random().getRange(-15, 15));
                this.spawnBalls(rndPos);
            }
        }

        private async spawnBalls(_rndPos: fCore.Vector3): Promise<void> {
            this.isSpawning = true;
            let basketBallCloneGraph: fCore.GraphInstance = await fCore.Project.createGraphInstance(basketBallGraphInstance);
            let dynamicRgdbdy: fCore.ComponentRigidbody = new fCore.ComponentRigidbody(
                25,
                fCore.PHYSICS_TYPE.DYNAMIC,
                fCore.COLLIDER_TYPE.SPHERE,
                fCore.PHYSICS_GROUP.GROUP_2
            );
            dynamicRgdbdy.friction = 1;
            dynamicRgdbdy.rotationInfluenceFactor = new fCore.Vector3(1, 1, 1);

            basketBallCloneGraph.getChild(0).addComponent(dynamicRgdbdy);
            basketBallContainer.getChild(1).appendChild(basketBallCloneGraph);

            dynamicRgdbdy.setPosition(_rndPos);
            this.isSpawning = false;
        }

        private checkBasketBallsAmount(): number {
            let i: number = 0;
            basketBalls = new Array(new fCore.Node(""));
            basketBallContainer.getChild(1).getChildren().forEach(basketBallGraphInstance => {
                basketBalls[i] = basketBallGraphInstance.getChild(0);
                i++;
            });
            return i;
        }
    }
}