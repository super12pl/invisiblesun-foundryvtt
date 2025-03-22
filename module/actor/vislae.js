/**@extends {Actor} */

export class InvisibleSunVislaeActor extends Actor {
    /** @override */
    prepareDerivedData() {
        const actorData = this
        const systemData = actorData.system
        if (actorData.type == "vislae") {
            console.log("Vislae!")
            for (let [key, pool] of Object.entries(systemData.pools)) {
                console.log(pool)
                pool.value = Math.min(pool.value, pool.max) //make sure pool value is not over maximum
                if (pool.value < 0) {
                    pool.value = 0
                }
            }
        }

        super.prepareDerivedData()
    }
}