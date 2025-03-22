/**
@extends {ActorSheet}
*/
export class InvisibleSunVislaeActorSheet extends ActorSheet {
    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["invisiblesun", "sheet", "actor"],
            template: "systems/invisiblesun/module/actor/vislae-sheet-template.hbs",
            width: 600,
            height: 600,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "features" }]
        });
    }
    /** @override */
    getData() {
        const context = super.getData()
        const actorData = context.data
        context.system = actorData.system
        context.flags = actorData.flags.invisiblesun || {}
        return context
    }
    /** @override */
    activateListeners(html){
        
    }
}