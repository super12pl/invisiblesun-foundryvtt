/**
* Extend the basic ActorSheet with some very simple modifications
* @extends {FormApplication}
*/
window.Handlebars.registerHelper('select', function (value, options) {
    var $el = $('<select />').html(options.fn(this));
    $el.find('[value="' + value + '"]').attr({ 'selected': 'selected' });
    return $el.html();
});

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
            width: 745,
            height: false,
            resizable: false
        });
    }
    getData() {
        // Basic data
        const data = super.getData().object;
        data.skill = data.tool = 0
        data.difficulty = 0
        data.pool = ""
        data.magic = false
        data.circuimstance = 0
        console.log(data)
        switch (data.dataset.type) {
            case "skill":
                data.skill = parseInt(data.dataset.level)
                break
            case "item":
                data.tool = parseInt(data.dataset.level)
                break
            case "pool":
                if (data.dataset.pool == "sortilege") {
                    data.magic = true
                }
                else {
                    data.pool = data.dataset.pool
                }
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
        data.circuimstance = formData.circuimstance
        data.difficulty = formData.difficulty
    }
    activateListeners(html) {
        super.activateListeners(html)
        let data = this.object
        html.find(".rollBtn").click(async () => {
            let venture = data.skill + data.tool + data.circuimstance + (data.pool.length > 0)
            let roll = new Roll((data.magic + 1) + "d10k+" + (venture - 1), data.actor.getRollData());
            await roll.evaluate()
            let successes = 0
            let fluxes = 0
            for (const [index, die] of roll.dice[0].results.entries()) {
                if (die.result == 1 && index != 0) {
                    fluxes += 1
                }
                if ((die.result + venture - 1) >= data.difficulty) {
                    successes += 1
                }
            }
            if (data.pool.length > 0) {
                game.actors.get(data.actor._id).system.pools[data.pool].value -= 1
            }
            roll.toMessage({
                speaker: ChatMessage.getSpeaker({ actor: data.actor }),
                flavor: `<div class='flexcolcenter'><h1>Difficulty: ${data.difficulty}<h1><h2>${successes} successes</h2><h2>${"Magical Flux!".repeat(fluxes)}</h2><h3>Venture: ${venture}</h3></div>`,
                rollMode: game.settings.get('core', 'rollMode'),
            });
            data.sheet.render()
            this.close()
        })
    }
}