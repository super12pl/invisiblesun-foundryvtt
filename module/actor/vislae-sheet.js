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
export class InvisibleSunVislaeActorSheet extends ActorSheet {
    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["invisiblesun", "sheet", "actor"],
            template: "systems/invisiblesun/module/actor/vislae-sheet-template.hbs",
            width: 600,
            height: 700,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "features" }]
        });
    }
    /** @override */
    getData() {
        const context = super.getData()
        const actorData = context.data
        context.system = actorData.system
        context.flags = actorData.flags.invisiblesun || {}
        context.rollData = context.actor.getRollData();
        if (actorData.type == "vislae") {
            const gear = [];
            // Iterate through items, allocating to containers
            for (let i of context.items) {
                i.img = i.img || DEFAULT_TOKEN;
                // Append to gear.
                if (i.type === 'item') {
                    gear.push(i);
                }
            }

            // Assign and return
            context.gear = gear;
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
        const itemData = {
            name: name,
            type: type,
            data: data
        };
        // Remove the type from the dataset since it's in the itemData.type prop.
        delete itemData.data["type"];

        // Finally, create the item!
        return await Item.create(itemData, { parent: this.actor });
    }
    async _onRoll(event) {
        event.preventDefault()
        const element = event.currentTarget
        const dataset = element.dataset

        rollEngineForm({ actor: this.actor, dataset: dataset, sheet: this })

    }

    /** @override */
    activateListeners(html) {
        //pool buttons
        html.find(".resource").each(function () {
            let resourceValue = $(this).find(".value")
            let resourceMax = $(this).find(".max")
            $(this).find(".add").click(clickEvent => {
                if (Number(resourceValue.val()) < Number(resourceMax.val())) { //check if not already max
                    resourceValue.val(Number(resourceValue.val()) + 1)
                }

            })
            $(this).find(".substract").click(clickEvent => {
                if (Number(resourceValue.val()) > 0) { // check if more than zero
                    resourceValue.val(Number(resourceValue.val()) - 1)
                }
            })
            $(this).find(".reset").click(clickEvent => {
                resourceValue.val(resourceMax.val())
            })
        })

        // Create Inventory Item
        html.on('click', '.item-create', this._onItemCreate.bind(this));

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
                content: `<div class="grid grid-2col"><img src="${item.img}"></img><div><h4 class="item-name">${item.name}, Level ${item.system.level}</h4><div>${item.system.description}</div></div></div>`
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



        if (this.actor.isOwner) {
            let handler = (ev) => this._onDragStart(ev);
            html.find('li.item').each((i, li) => {
                if (li.classList.contains('inventory-header')) return;
                li.setAttribute('draggable', true);
                li.addEventListener('dragstart', handler, false);
            });
        }
    }
}