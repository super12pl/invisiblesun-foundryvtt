const { HTMLField, NumberField, SchemaField, StringField,BooleanField } = foundry.data.fields;

/* -------------------------------------------- */
/*  Actor Models                                */
/* -------------------------------------------- */

class ActorDataModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        // Actually a pc data model, make it slimmer later
        return {
            basic: new SchemaField({
                foundation: new StringField({ required: true, blank: true }),
                heart: new StringField({ required: true, blank: true }),
                order: new StringField({ required: true, blank: true }),
                forte: new StringField({ required: true, blank: true }),
                degree: new NumberField({ required: true, integer: true, initial: 1 }),
                acumen: new NumberField({ required: true, integer: true, initial: 0 }),
                crux: new NumberField({ required: true, integer: true, initial: 0 }),
            }),
            stats: new SchemaField({
                certes: new NumberField({ required: true, integer: true, initial: 0 }),
                qualia: new NumberField({ required: true, integer: true, initial: 0 }),
                hiddenKnowledge: new NumberField({ required: true, integer: true, initial: 0 }),
            }),
            pools: new SchemaField({
                certesPools: new SchemaField({
                    accurancy: new SchemaField({
                        value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
                        max: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
                    }),
                    movement: new SchemaField({
                        value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
                        max: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
                    }),
                    physicality: new SchemaField({
                        value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
                        max: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
                    }),
                    perception: new SchemaField({
                        value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
                        max: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
                    }),
                }),
                qualiaPools: new SchemaField({
                    sorcery: new SchemaField({
                        value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
                        max: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
                    }),
                    interaction: new SchemaField({
                        value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
                        max: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
                    }),
                    intellect: new SchemaField({
                        value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
                        max: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
                    }),
                    sortilege: new SchemaField({
                        value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
                        max: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
                    }),
                })
            }),
            combat:new SchemaField({
                recoveries:new SchemaField({
                    oneAction: new BooleanField({initial:false}),
                    tenMinutes: new BooleanField({initial:false}),
                    oneHour: new BooleanField({initial:false}),
                    tenHours: new BooleanField({initial:false}),
                }),
                damage:new SchemaField({
                    injuries:new NumberField({initial:0,integer:true,required:true,min:0}),
                    wounds:new NumberField({initial:0,integer:true,required:true,max:3,min:0}),
                    anguish:new NumberField({initial:0,integer:true,required:true,max:3,min:0})
                }),
                armor:new NumberField({initial:0,integer:true,required:true,min:0})
            }),
            equipment:new SchemaField({
                ephemeraLimit:new NumberField({initial:2,integer:true,required:true})
            })
        };
    }
}

// The pawn does not have any different data to the base ActorDataModel, but we
// still define a data model for it, in case we have any special logic we want
// to perform only for pawns.
export class PawnDataModel extends ActorDataModel { }

/* -------------------------------------------- */
/*  Item Models                                 */
/* -------------------------------------------- */

class ItemDataModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            rarity: new StringField({
                required: true,
                blank: false,
                options: ["common", "uncommon", "rare", "legendary"],
                initial: "common"
            }),
            price: new NumberField({ required: true, integer: true, min: 0, initial: 20 })
        };
    }
}

export class WeaponDataModel extends ItemDataModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),
            damage: new NumberField({ required: true, integer: true, positive: true, initial: 5 })
        };
    }
}

export class SpellDataModel extends ItemDataModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),
            cost: new NumberField({ required: true, integer: true, positive: true, initial: 2 })
        };
    }
}