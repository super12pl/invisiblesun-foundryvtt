/**
Invisible Sun system for Foundry VTT
Author: super12pl
*/
import { InvisibleSunVislaeActor } from "./module/actor/vislae.js";
import { InvisibleSunVislaeActorSheet } from "./module/actor/vislae-sheet.js";


Hooks.once("init", async function () {
    //base classes
    CONFIG.Actor.documentClass = InvisibleSunVislaeActor

    //sheets
    Actors.unregisterSheet("core", ActorSheet)
    Actors.registerSheet("invisiblesun", InvisibleSunVislaeActorSheet, {
        makeDefault: true,
        label: "invisiblesun.Sheet.Actor"
    })

    //trackable attributes (on tokens)
    CONFIG.Actor.trackableAttributes = {
        vislae: {
            value: ["combat.damage.injuries", "combat.damage.anguish", "combat.damage.wounds"]
        }
    }
});