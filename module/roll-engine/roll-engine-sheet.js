/**
* Extend the basic ActorSheet with some very simple modifications
* @extends {FormApplication}
*/
window.Handlebars.registerHelper('select', function (value, options) {
    var $el = $('<select />').html(options.fn(this));
    $el.find('[value="' + value + '"]').attr({ 'selected': 'selected' });
    return $el.html();
});
function getNum(val) {
    val = +val || 0
    return val;
}
export class RollEngineDialogSheet extends FormApplication {
    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["invisiblesun", "sheet"],
            template: "systems/invisiblesun/module/roll-engine/roll-engine-sheet-template.hbs",
            title: "Time to roll!",
            closeOnSubmit: false,
            submitOnChange: true,
            submitOnClose: false,
            width: 800,
            height: 200,
            resizable: false
        });
    }
    getData() {
        // Basic data
        const data = super.getData().object;
        data.label = game.actors.get(data.actor._id).items.get(data.dataset.itemId).name
        data.pool = ""
        data.spell = false
        data.sortilege = false
        switch (data.dataset.type) {
            case "skill":
                data.skill = parseInt(data.dataset.level)
                break
            case "item":
                data.tool = parseInt(data.dataset.level)
                break
            case "pool":
                if (data.dataset.pool == "sortilege") {
                    data.sortilege = true
                }
                else {
                    data.pool = data.dataset.pool
                }
                break
            case "ability":
                data.spell = true
                break
        }
        return data
    }
    _updateObject(event, formData) {
        let data = this.object
        data.skill = formData.skill
        data.tool = formData.tool
        data.pool = formData.pool
        data.magic = formData.magic
        data.sortilege = formData.sortilege
        data.circuimstance = formData.circuimstance
        data.spell = formData.spell
        data.difficulty = formData.difficulty
        data.beneTask = formData.beneTask
        data.beneEffect = formData.beneEffect
    }
    activateListeners(html) {
        super.activateListeners(html)
        let data = this.object
        html.find(".rollBtn").click(async () => {
            var difficulty = getNum(data.difficulty)
            let venture = getNum(data.skill) + getNum(data.tool) + getNum(data.circuimstance) + getNum(data.magic) + getNum(data.beneTask)
            let roll = new Roll((data.sortilege + data.spell + 1) + "d10k+" + (venture - 1), data.actor.getRollData());
            await roll.evaluate()
            let successes = 0
            let fluxes = 0
            for (const [index, die] of roll.dice[0].results.entries()) {
                if (die.result == 1 && index != 0) {
                    fluxes += 1
                }
                if ((die.result + venture - 1) >= difficulty) {
                    successes += 1
                }
            }
            if (data.pool.length > 0) {
                game.actors.get(data.actor._id).system.pools[data.pool].value -= (data.beneTask + data.beneEffect)
            }
            roll.toMessage({
                speaker: ChatMessage.getSpeaker({ actor: data.actor }),
                flavor: `<div class='flexcolcenter'><h1>${data.label}</h1><h2>Difficulty: ${difficulty}<h2><h2>${successes} successes</h2>${data.beneEffect ? `<h2>Bene used for effect: ${data.beneEffect}</h2>` : ""}<h2>${"Magical Flux!".repeat(fluxes)}</h2><h3>Venture: ${venture}</h3></div>`,
                rollMode: game.settings.get('core', 'rollMode'),
            });
            data.sheet.render()
            this.close()
        })
    }
}