/**
Invisible Sun system for Foundry VTT
Author: super12pl
*/
import { InvisibleSunVislaeActor } from "./module/actor/vislae.js";
import { InvisibleSunVislaeActorSheet } from "./module/actor/vislae-sheet.js";
import { InvisibleSunItem } from "./module/item/item.js";
import { InvisibleSunItemSheet } from "./module/item/item-sheet.js";


Hooks.once("init", async function () {
    //base classes
    CONFIG.Actor.documentClass = InvisibleSunVislaeActor
    CONFIG.Item.documentClass = InvisibleSunItem

    //sheets
    Actors.unregisterSheet("core", ActorSheet)
    Actors.registerSheet("invisiblesun", InvisibleSunVislaeActorSheet, {
        makeDefault: true,
        label: "invisiblesun.Sheet.Actor"
    })

    Items.unregisterSheet("core", ItemSheet)
    Items.registerSheet("invisiblesun", InvisibleSunItemSheet, {
        makeDefault: true,
        label: "invisiblesun.Sheet.Item"
    })

    //trackable attributes (on tokens)
    CONFIG.Actor.trackableAttributes = {
        vislae: {
            value: ["combat.damage.injuries", "combat.damage.anguish", "combat.damage.wounds"]
        }
    }
});