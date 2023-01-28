
class Form {
    constructor(action, method, enctype) {
        this.fields = [];
        this.form = document.createElement('form');
        this.form.action = action;
        this.form.method = method;
        this.form.enctype = enctype;
        this.invalid_fields = 0;
        this.override_default = {}
    }

    static fromHtml(selector, baseElement=document, submitSeletor='input[type="submit"]', blocksSeletor="div.vbform_field") {
        let form = baseElement.querySelector(selector);
        let submit = form.querySelector(submitSeletor);
        let new_form;
        try {
            new_form = new Form(form.action, form.method, form.enctype);
        }
        catch (e) {
            console.error("Error during parse form : "+e.message);
        }
        let blocks = form.querySelectorAll(blocksSeletor);
        blocks.forEach(el => {
            new_form.addField(FabricField.fromBlock(el));
        })
        new_form.addSubmit(submit.value);
        form.parentNode.replaceChild(new_form.form, form);
        return new_form;
    }

    getForm() {
        return this.form;
    }

    getParentNotForm(node, i=0) {
        let parent = node.parentNode;
        ++i;
        if(parent != null && parent.nodeName.toLowerCase() != "form" && i < 5) {
            return this.getParentNotForm(parent, i);
        }
        return node;
    }

    addField(field) {
        this.fields.push(field);
        let parent = this.getParentNotForm(field.getBlock());
        this.form.appendChild(parent);
    }

    addSubmit(value, id="", className="") {
        let divSubmit = document.createElement('div');
        divSubmit.className = "vbform_submit";
        let submit = document.createElement('input');
        submit.type = 'submit';
        submit.value = value;
        if (className) {
            submit.className = className;
        }
        if (id) {
            submit.id = id;
        }
        divSubmit.appendChild(submit);
        this.form.appendChild(divSubmit);

        submit.addEventListener('click', this.validate.bind(this), {capture: true, once: false});
    }

    validate(event) {
        this.invalid_fields = 0;
        this.fields.forEach(field => {
            field.validate();
            if (!field.valid) {
                ++this.invalid_fields;
            }
        });

        // To change native behavior please override onclick event on input submit
        if (this.invalid_fields > 0) {
            event.preventDefault();
        }

        return this.invalid_fields;
    }
}


function mod(n, m) {
    return ((n % m) + m) % m
}

function disableEnterKey(event) {
    if (event.code == "Enter") {
        event.preventDefault();
    }
}


class SteppedForm extends Form {
    constructor(action, method, enctype) {
        super(action, method, enctype);
        this.index = 0;
        this.steps = [];
    }

    next(event) {
        event.preventDefault();
        let valid_step = true;
        this.fields[this.index].forEach(field => {
            field.validate(false);
            if (!field.valid) {
                valid_step = false;
            }
        });

        if(valid_step) {
            ++this.index;
            this.showStep();
        }
    }

    prev() {
        --this.index;
        this.showStep();
    }

    showStep() {
        const nb_elem = this.steps.length
        this.index = mod(this.index, nb_elem)

        for(let i=0; i<nb_elem; i++) {
            if(i==this.index) {
                this.steps[i][0].style.display = "";
            }
            else {
                this.steps[i][0].style.display = "none";
            }
        }
    }

    addStep(next_button="Valider", prev_button="Retour") {
        let step = document.createElement('div')
        step.className = "vbform_step";
        step.addEventListener("keydown", disableEnterKey);

        let div = null;
        if(next_button.length > 0 || prev_button.length > 0) {
            div = document.createElement('div');
            div.className = "vbform_nav";
            if(prev_button.length > 0) {
                let prev_b = document.createElement('span');
                prev_b.className = "vbform_prev";
                prev_b.innerText = prev_button;
                prev_b.addEventListener('click', this.prev.bind(this), {capture: true, once: false});
                div.appendChild(prev_b);
            }
            if(next_button.length > 0) {
                let next_b = document.createElement('span');
                next_b.className = "vbform_next";
                next_b.innerText = next_button;
                next_b.addEventListener('click', this.next.bind(this), {capture: true, once: false});
                div.appendChild(next_b);
            }
            step.appendChild(div);
        }

        this.steps.push([step, div]);
        return this.steps.length - 1;
    }

    addField(field, step) {
        if(this.fields[step] == undefined) {
            this.fields[step] = [];
        }
        this.fields[step].push(field);
        let parent = this.getParentNotForm(field.getBlock());
        this.steps[step][0].appendChild(parent);
    }

    addSubmit(value, id="", className="") {
        let divSubmit = document.createElement('div');
        divSubmit.className = "vbform_submit";
        let submit = document.createElement('input');
        submit.type = 'submit';
        submit.value = value;
        if (className) {
            submit.className = className;
        }
        if (id) {
            submit.id = id;
        }
        divSubmit.appendChild(submit);
        this.steps[this.steps.length - 1][0].appendChild(divSubmit);
        this.steps[this.steps.length - 1][0].removeEventListener('keydown', disableEnterKey);

        submit.addEventListener('click', this.validate.bind(this), {capture: true, once: false});
    }

    getForm(submit) {
        this.steps.forEach(([step, div]) => {
            step.appendChild(div);
            this.form.appendChild(step);
        })
        this.addSubmit(submit);
        this.showStep();
        return this.form;
    }
}
