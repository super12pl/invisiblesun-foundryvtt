/**
* @extends {ActorSheet}
*/
import {
    rollEngineForm
} from "../roll-engine/roll-engine-form.js";
window.Handlebars.registerHelper('select', function (value, options) {
    var $el = $('<select />').html(options.fn(this));
    $el.find('[value="' + value + '"]').attr({ 'selected': 'selected' });
    return $el.html();
});
window.Handlebars.registerHelper('sum', function (num1, num2) {
    return num1 + num2
})
window.Handlebars.registerHelper("eq", function (str1, str2) {
    return str1 == str2
})
window.Handlebars.registerHelper("greq", function (num1, num2) {
    return num1 >= num2
})
window.Handlebars.registerHelper("capitalize", function (str) {
    return str.capitalize()
})
window.Handlebars.registerHelper("leeq", function (num1, num2) {
    return num1 <= num2
})

//vance diagram sizes
window.Handlebars.registerHelper("diagramSize", function (degree) {
    if (degree == 1 || degree == 2) {
        return "width:320px;height:320px;border:2px dashed rgb(102, 56, 149)"
    }
    else if (degree == 3 || degree == 4) {
        return "width:640px;height:320px;border:2px dashed rgb(225, 132, 41)"
    }
    else {
        return "width:640px;height:640px;border:2px dashed rgb(138, 37, 36)"
    }
})
//vance spell sizes
window.Handlebars.registerHelper("spellSize", function (spellClass, halfSize) {
    switch (spellClass) {
        case "alpha":
            if (halfSize) {
                return "width:160px;height:80px"
            }
            else {
                return "width:320px;height:160px"
            }
        case "beta":
            if (halfSize) {
                return "width:160px;height:160px"
            }
            else {
                return "width:320px;height:320px"
            }
        case "gamma":
            if (halfSize) {
                return "width:320px;height:160px"
            }
            else {
                return "width:640px;height:320px"
            }
        case "omega":
            if (halfSize) {
                return "width:320px;height:320px"
            }
            else {
                return "width:640px;height:640px"
            }
    }
})



//maker buttons
window.Handlebars.registerHelper("showStart", function (stage) {
    return stage == 0
})
window.Handlebars.registerHelper("showDone", function (stage) {
    return stage == 1 || stage == 3 || stage == 5 || stage == 7 || stage == 9 || stage == 10 || stage == 13 || stage == 14 || stage == 16
})
window.Handlebars.registerHelper("showTrueFalse", function (stage) {
    return stage == 2 || stage == 4 || stage == 6 || stage == 11 || stage == 12 || stage == 15
})
window.Handlebars.registerHelper("makertext", function (stage) {
    switch (stage) {
        case 1:
            return "Add material, Level: " + this.actor.system.maker.desiredLevel
        case 2:
            return "Attempt Challenge Level " + this.actor.system.maker.x
        case 3:
            return "Add Catalyst Level " + (this.actor.system.maker.x - 1)
        case 4:
            return "Attempt Challenge Level " + (this.actor.system.maker.x + 1)
        case 5:
            return "Add Stabilizer Level " + (this.actor.system.maker.x - 1)
        case 6:
            return "Attempt Challenge Level " + (this.actor.system.maker.x + 1)
        case 7:
            return "Mishap :("
        case 8:
            return "Add Major Side Effect"
        case 9:
            return "Add Minor Side Effect"
        case 10:
            return "Add Ingredient Level " + (this.actor.system.maker.x - 1)
        case 11:
            return "Continue?"
        case 14:
            return "Add Power Source Level " + (this.actor.system.maker.x)
        case 13:
            return "Item Created with Random Effect of Level " + (this.actor.system.maker.x)
        case 15:
            return "Attempt Challenge Level " + (this.actor.system.maker.x + 1)
        case 16:
            return "Desired Item Created :)"
    }
})
export class InvisibleSunVislaeActorSheet extends ActorSheet {
    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["invisiblesun", "sheet", "actor"],
            width: 800,
            height: 1000,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body" }]
        });
    }
    /** @override */
    get template() {
        const path = 'systems/invisiblesun/module/actor';
        console.log(`${path}/${this.actor.type}-sheet-template.hbs`)
        return `${path}/${this.actor.type}-sheet-template.hbs`;
    }
    /** @override */
    getData() {
        const context = super.getData()
        const actorData = context.data
        context.system = actorData.system
        context.flags = actorData.flags
        context.rollData = context.actor.getRollData();
        if (actorData.type == "vislae") {
            const gear = [];
            const abilities = [];
            const skills = [[], [], []];
            const ephemera = []
            const objectsOfPower = []
            const attacks = []
            const armors = []
            const vanceSpells = []
            const placedVanceSpells = []
            const weaverAggregates = []
            const weaverSpells = []
            var totalArmor = 0
            // Iterate through items, allocating to containers
            for (let i of context.items) {
                i.img = i.img || DEFAULT_TOKEN;
                // Append to gear.
                switch (i.type) {
                    case "item":
                        gear.push(i);
                        break
                    case "ability":
                        abilities.push(i)
                        break
                    case "skill":
                        switch (i.system.skillType) {
                            case "action":
                                skills[0].push(i)
                                break
                            case "narrative":
                                skills[1].push(i)
                                break
                            case "development":
                                skills[2].push(i)
                                break
                        }
                        break
                    case "attack":
                        attacks.push(i)
                        break
                    case "incantation":
                    case "ephemera":
                        ephemera.push(i)
                        break
                    case "objectOfPower":
                        objectsOfPower.push(i)
                        break
                    case "armor":
                        totalArmor += i.system.value
                        armors.push(i)
                        break
                    case "vanceSpell":
                        vanceSpells.push(i)
                        if (i.system.placed) {
                            placedVanceSpells.push(i)
                        }
                        break
                    case "weaverAggregate":
                        weaverAggregates.push(i)
                        break
                    case "weaverSpell":
                        weaverSpells.push(i)
                        break
                }
            }
            // Assign and return
            context.gear = gear;
            context.abilities = abilities
            context.skills = skills
            context.ephemera = ephemera
            context.objectsOfPower = objectsOfPower
            context.attacks = attacks
            context.armors = armors
            context.totalArmor = totalArmor
            context.totalCrux = Math.min(context.system.stats.joy, context.system.stats.despair)
            context.vanceSpells = vanceSpells
            context.placedVanceSpells = placedVanceSpells
            context.weaverAggregates = weaverAggregates
            context.weaverSpells = weaverSpells
        }
        if (actorData.type == "npc") {
            const items = []
            for (let i of context.items) {
                i.img = i.img || DEFAULT_TOKEN;
                items.push(i)
            }
            context.items = items
        }
        return context
    }
    async _onItemCreate(event) {
        event.preventDefault();
        const header = event.currentTarget;
        // Get the type of item to create.
        const type = header.dataset.type;
        // Grab any data associated with this control.
        const data = duplicate(header.dataset);
        // Initialize a default name.
        const name = `New ${type.capitalize()}`;
        // Prepare the item object.
        var icon = ""
        switch (type) {
            case "item":
                icon = "icons/svg/item-bag.svg"
                break
            case "attack":
                icon = "icons/svg/sword.svg"
                break
            case "armor":
                icon = "icons/svg/shield.svg"
                break
            case "weaverAggregate":
                icon = "systems/invisiblesun/icons/weaverSpell.png"
                break
            default:
                icon = `systems/invisiblesun/icons/${type}.png`
        }
        const itemData = {
            name: name,
            img: icon,
            type: type,
            data: data
        };

        // Finally, create the item!
        return await Item.create(itemData, { parent: this.actor });
    }
    async _onRoll(event) {
        event.preventDefault()
        const element = event.currentTarget
        const dataset = element.dataset
        if (Object.hasOwn(dataset, "depletion")) {
            let roll = new Roll("d10-1", this.actor.getRollData());
            await roll.evaluate()
            var depleted = false
            if (this.actor.items.get(dataset.itemId).system.depletion.split(",").includes(roll.total.toString())) {
                depleted = true
            }
            roll.toMessage({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: `<div class='flexcolcenter'><h1>${this.actor.items.get(dataset.itemId).name} depletion roll</h1><h2>${depleted ? 'Depleted!' : "Not depleted!"}</h2></div>`,
                rollMode: game.settings.get('core', 'rollMode'),
            });
        }
        else {
            rollEngineForm({ actor: this.actor, dataset: dataset, sheet: this })
        }


    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        //pool buttons
        html.find(".resource").each(function () {
            let resourceValue = $(this).find(".value")
            let resourceMax = $(this).find(".max")
            $(this).find(".add").click(clickEvent => {
                // if (Number(resourceValue.val()) < Number(resourceMax.val())) { //check if not already max
                resourceValue.val(Number(resourceValue.val()) + 1)
                // }

            })
            $(this).find(".substract").click(clickEvent => {
                // if (Number(resourceValue.val()) > 0) { // check if more than zero
                resourceValue.val(Number(resourceValue.val()) - 1)
                // }
            })
            $(this).find(".reset").click(clickEvent => {
                resourceValue.val(resourceMax.val())
            })
        })

        // Create Inventory Item
        html.on('click', '.item-create', (ev) => {
            this._onItemCreate(ev).then((item) => {
                item.sheet.render(true);
            })

        });

        html.on("click", '.item-edit', (ev) => {
            const li = $(ev.currentTarget).parents('.item');
            const item = this.actor.items.get(li.data('itemId'));
            item.sheet.render(true);
        })
        // Delete Inventory Item
        html.on('click', '.item-delete', (ev) => {
            const li = $(ev.currentTarget).parents('.item');
            const item = this.actor.items.get(li.data('itemId'));
            item.delete();
            li.slideUp(200, () => this.render(false));
        });
        html.on("click", '.item-chat', (ev) => {
            const li = $(ev.currentTarget).parents('.item');
            const item = this.actor.items.get(li.data('itemId'));
            ChatMessage.create({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                content: `<div class="grid grid-3col"><img src="${item.img}"></img><div style="grid-column: 2 / span 2" class='flexcolcenter'><h3 class="item-name">${item.name}</h3><h4><b>Level:</b> ${item.system.level}</h4>${item.system.color ? `<h4><b>Color:</b> ${item.system.color}</h4>` : ""}${item.system.depletion ? `<h4><b>Depletion:</b> ${item.system.depletion}</h4>` : ""}${item.system.range ? `<h4><b>Range:</b> ${item.system.range}</h4>` : ""}${item.system.duration ? `<h4><b>Duration:</b> ${item.system.duration}${item.system.targets ? `<h4><b>Targets:</b> ${item.system.targets}</h4>` : ""}</h4>` : ""}</div></div><hr><div colspan='2'>${item.system.description}</div>`
            });
        })

        html.on("click", ".quantity-add", (ev) => {
            const li = $(ev.currentTarget).parents('.item');
            const item = this.actor.items.get(li.data('itemId'));
            item.update({ "system.quantity.value": item.system.quantity.value + 1 })

        })
        html.on("click", ".quantity-substract", (ev) => {
            const li = $(ev.currentTarget).parents('.item');
            const item = this.actor.items.get(li.data('itemId'));
            item.update({ "system.quantity.value": item.system.quantity.value - 1 })
        })

        html.on('click', '.rollable', this._onRoll.bind(this));
        html.on('click', '.sleep', (ev) => {
            html.find(".resource").each(function () {
                let resourceValue = $(this).find(".value")
                let resourceMax = $(this).find(".max")
                resourceValue.val(resourceMax.val())
            })
            html.find(".recovery").each(function () {
                $(this)[0].checked = false
            })
        })


        if (this.actor.isOwner) {
            let handler = (ev) => this._onDragStart(ev);
            html.find('li.item').each((i, li) => {
                if (li.classList.contains('inventory-header')) return;
                li.setAttribute('draggable', true);
                li.addEventListener('dragstart', handler, false);
            });
        }
        //making vance spells draggable using jquery-ui
        $(".vance-diagram").draggable({ cancel: ".vance-diagram" })
        $(".vance-spell").draggable({ snap: true })

        //placing and removing
        html.on('click', ".item-vance-place", (ev) => {
            const item = this.actor.items.get($(ev.currentTarget).data('itemId'))
            item.update({ "system.placed": true })
        })
        html.on("contextmenu", ".vance-spell", (ev) => {
            const item = this.actor.items.get($(ev.currentTarget).data('itemId'))
            item.update({ "system.placed": false, "system.left": "10px", "system.top": "600px" })
        })
        html.on("mouseup", ".vance-spell", (ev) => {
            const item = this.actor.items.get($(ev.currentTarget).data('itemId'))
            item.update({ "system.left": $(ev.currentTarget)[0].style.left, "system.top": $(ev.currentTarget)[0].style.top })
        })

        //maker matrix buttons
        html.on('click', ".makermakestart", (ev) => {
            this.actor.update({ "system.maker.stage": 1 })
        })
        html.on('click', ".makermakedone", (ev) => {
            if (this.actor.system.maker.stage == 1) {
                this.actor.update({ "system.maker.stage": 2 })
            }
            if (this.actor.system.maker.stage == 3) {
                this.actor.update({ "system.maker.stage": 4 })
            }
            if (this.actor.system.maker.stage == 5) {
                this.actor.update({ "system.maker.stage": 6 })
            }
            if (this.actor.system.maker.stage == 7 || this.actor.system.maker.stage == 13 || this.actor.system.maker.stage == 16) {
                this.actor.update({ "system.maker.stage": 0, "system.maker.x": 1 })
            }
            if (this.actor.system.maker.stage == 8 || this.actor.system.maker.stage == 9) {
                this.actor.update({ "system.maker.stage": 10, "system.maker.x": this.actor.system.maker.x + 1 })
            }
            if (this.actor.system.maker.stage == 10) {
                this.actor.update({ "system.maker.stage": 11 })
            }
            if (this.actor.system.maker.stage == 14) {
                this.actor.update({ "system.maker.stage": 15 })
            }
        })
        html.on('click', ".makermaketrue", (ev) => {
            if (this.actor.system.maker.stage == 2) {
                this.actor.update({ "system.maker.stage": 10, "system.maker.x": this.actor.system.maker.x + 1 })
            }
            if (this.actor.system.maker.stage == 4) {
                this.actor.update({ "system.maker.stage": 9 })
            }
            if (this.actor.system.maker.stage == 6) {
                this.actor.update({ "system.maker.stage": 8 })
            }
            if (this.actor.system.maker.stage == 11) {
                this.actor.update({ "system.maker.stage": 2 })
            }
            if (this.actor.system.maker.stage == 15) {
                this.actor.update({ "system.maker.stage": 16 })
            }
        })
        html.on('click', ".makermakefalse", (ev) => {
            if (this.actor.system.maker.stage == 2) {
                this.actor.update({ "system.maker.stage": 3, "system.maker.x": this.actor.system.maker.x + 1 })
            }
            if (this.actor.system.maker.stage == 4) {
                this.actor.update({ "system.maker.stage": 5, "system.maker.x": this.actor.system.maker.x + 1 })
            }
            if (this.actor.system.maker.stage == 6 || this.actor.system.maker.stage == 15) {
                this.actor.update({ "system.maker.stage": 7 })
            }
            if (this.actor.system.maker.stage == 11) {
                if (this.actor.system.maker.x == this.actor.system.maker.desiredLevel) {
                    this.actor.update({ "system.maker.stage": 14 })
                }
                else {
                    this.actor.update({ "system.maker.stage": 13 })
                }

            }
        })
    }
}