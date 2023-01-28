/************************
  Depend on vbfields.js
*************************/

class MultiCheckboxField {
    constructor(name="", label="", element='', lang="FR") {
        this.name = name;
        this.label = label;
        this.lang = lang;
        this.error = "";
        this.valid = true;
        this.observers = [];

        this.field_label = document.createElement('label');
        this.field_label.innerText = this.label;

        this.field = null;
        this.id_field = "id_" + this.name;
        if(element) {
            this.element = element;
            this.field = document.createElement(this.element);
            this.field.name = this.name;
            this.field.id = this.id_field;
            this.field.style.display = "none";
            this.field_label.htmlFor = this.id_field;
        }
        this.fields = [];

        this.setInitial();
        this.setBlock();
    }

    addSubscription(obs_id, func) {
        this.observers.push([obs_id, func]);
    }

    delSubscription(obs_id) {
        this.observers = this.observers.filter(([name, _]) => obs_id != name);
    }

    notify(value) {
        this.observers.forEach(([_, func]) => {
            func(value, this.id_field);
        });
    }

    addOption(object) {
        let field = new CheckboxField(this.name, object[this.label_name]);
        field.setInitial(object[this.value_name]);
        field.setId(this.fields.length);
        field.setValidator(false);
        field.addSubscription(this.id_field, this.reloadValidate.bind(this));
        this.fields.push(field);
    }

    setError(error) {
        this.error_slot.innerText = error;
        if (error.length == 0) {
            this.error_slot.style.display = "none";
            this.valid = true;
        }
        else {
            this.error_slot.style.display = "";
            this.valid = false;
        }
    }

    setOptions(all_options, label_name="label", value_name="value", filter_func=defaultFilterFunc, filter_value=null) {
        this.all_options = all_options;
        this.filter_func = filter_func;

        this.options = [...all_options];
        this.options = this.filter_func(all_options, filter_value);

        this.label_name = label_name;
        this.value_name = value_name;

        while (this.div_field && this.div_field.hasChildNodes()) {
            this.div_field.removeChild(this.div_field.firstChild);
            this.fields = [];
        }

        this.options.forEach(obj => {
            this.addOption(obj);            
        });

        this.values = [];
        this.setBlock(true);
    }

    reloadValidate(value, from) {
        this.values = this.fields.filter(f => f.field.checked).map(f => f.field.value);
        this.validate();
    }

    reloadField(value, from) {
        this.setOptions(this.all_options, this.label_name, this.value_name, this.filter_func, value);
        this.setValidator(this.min, this.max, this.required);
    }

    setInitial(values=[]) {
        this.values = values;

        let nb_values = this.values.length;
        let nb_fields = this.fields.length;
        if (nb_fields > 0) {
            for(let i=0; i < nb_values; ++i) {
                for(let j=0; j < nb_fields; ++j) {
                    if(this.fields[j].value == this.values[i]) {
                        this.fields[j].field.checked = true
                        break;
                    }
                }
            }
        }
    }

    validate(notify=true) {
        if(this.required && this.values.length < 1) {
            this.error = this.lang == "FR" ? "Merci de sélectionner au moins un élément." : "Please choose at least one element.";
            this.setError(this.error);
        }
        else if (this.values.length < this.min) {
            this.error = this.lang == "FR" ? "Vous devez choisir au moins "+this.min+" options." : "You have to choose at least "+this.min+" options.";
            this.setError(this.error);
        }
        else if (this.values.length > this.max) {
            this.error = this.lang == "FR" ? "Vous devez choisir au plus "+this.max+" options." : "You have to choose at most "+this.max+" options.";
            this.setError(this.error);
        }
        else {
            this.error = "";
            this.setError(this.error);
        }

        if (notify) {
            this.notify(this.values);
        }
    }

    setValidator(min=null, max=null, required=false) {
        this.min = min || 0;
        this.max = max || this.fields.length;
        this.required = required;
    }

    organizeBlock() {
        this.div_field.appendChild(this.field_label);
        this.div_field.appendChild(this.error_slot);
        this.div_field.appendChild(this.second_div);
    }

    setBlock(re=false) {
        if (!re) {
            this.div_field = document.createElement('div');
            this.div_field.className = 'vbform_field field_' + this.name;
        }

        this.error_slot = document.createElement('p');
        this.error_slot.className = 'vbform_p errorlist';
        this.error_slot.style.display = "none";

        this.second_div = document.createElement('div');
        this.second_div.className = "vbform_subfields";
        let nb_fields = this.fields.length;
        for(let i=0; i < nb_fields; ++i) {
            this.second_div.appendChild(this.fields[i].getBlock());
        }

        this.organizeBlock();
    }

    getBlock() {
        return this.div_field;
    }
}


class MultiRadioField extends MultiCheckboxField {
    constructor(name="", label="", element='', lang="FR") {
        super(name, label, element, lang);
    }

    setValidator(required=false) {
        this.min = 1;
        this.max = 1;
        this.required = required;
    }

    addOption(object) {
        let field = new RadioField(this.name, object[this.label_name]);
        field.setInitial(object[this.value_name]);
        field.setId(this.fields.length);
        field.setValidator(false);
        field.addSubscription(this.id_field, this.reloadValidate.bind(this));
        this.fields.push(field);
    }
}


let defaultMappingObject = {
    id: "id",
    filter: "type_annonce",
    type: "type_champ",
    name: "nom",
    label: "label",
    min: "mini",
    max: "maxi",
    required: "obligatoire",
    initial: "defaut",
    placeholder: "exemple",
}


class JSONField {
    constructor(name="", label="", prefix="vbjsonf", lang="FR") {
        this.name = name;
        this.label = label;
        this.prefix = prefix+"_";
        this.lang = lang;
        this.error = "";
        this.valid = true;
        this.observers = [];
        this.data = {};

        this.id_field = "id_" + this.name;
        this.field_label = document.createElement('label');
        this.field_label.innerText = this.label;
        this.field_label.htmlFor = this.id_field;

        this.field = document.createElement('textarea');
        this.field.name = this.name;
        this.field.id = this.id_field;
        this.field.style.display = "none";

        this.fields = [];

        this.setBlock();
    }

    addSubscription(obs_id, func) {
        this.observers.push([obs_id, func]);
    }

    delSubscription(obs_id) {
        this.observers = this.observers.filter(([name, _]) => obs_id != name);
    }

    notify(value) {
        this.observers.forEach(([_, func]) => {
            func(value, this.id_field);
        });
    }

    addField(object) {
        let field;
        switch (object[this.mobj.type]) {
            case 1:
                field = new NumberField(this.prefix+object[this.mobj.name], object[this.mobj.label], this.lang);
                field.setInitial(object[this.mobj.initial] || null, object[this.mobj.placeholder] || null, 1);
                field.setValidator(object[this.mobj.min], object[this.mobj.max], object[this.mobj.required]);
                break;
            case 2:
                field = new NumberField(this.prefix+object[this.mobj.name], object[this.mobj.label], this.lang);
                field.setInitial(object[this.mobj.initial] || null, object[this.mobj.placeholder] || null, 0.1);
                field.setValidator(object[this.mobj.min], object[this.mobj.max], object[this.mobj.required]);
                break;
            case 3:
                if (object[this.mobj.max] <= 120) {
                    field = new CharField(this.prefix+object[this.mobj.name], object[this.mobj.label], this.lang);
                }
                else {
                    field = new TextField(this.prefix+object[this.mobj.name], object[this.mobj.label], this.lang);
                }
                field.setInitial(object[this.mobj.initial] || null, object[this.mobj.placeholder] || null);
                field.setValidator(object[this.mobj.min], object[this.mobj.max], object[this.mobj.required]);
                break;
            case 4:
                field = new CheckboxField(this.prefix+object[this.mobj.name], object[this.mobj.label], this.lang);
                field.setInitial(object[this.mobj.initial]||"true", object[this.mobj.initial] ? true : false);
                field.setValidator(object[this.mobj.required]);
                break;
            case 5:
                field = new DateField(this.prefix+object[this.mobj.name], object[this.mobj.label], this.lang);
                field.setInitial(object[this.mobj.initial] || null, object[this.mobj.placeholder] || null);
                field.setValidator(object[this.mobj.min], object[this.mobj.max], object[this.mobj.required]);
                break;
            case 6:
                field = new TimeField(this.prefix+object[this.mobj.name], object[this.mobj.label], this.lang);
                field.setInitial(object[this.mobj.initial] || null, object[this.mobj.placeholder] || null);
                field.setValidator(object[this.mobj.min], object[this.mobj.max], object[this.mobj.required]);
                break;
        }
        field.setId(this.fields.length);
        field.addSubscription(this.id_field, this.subValidate.bind(this));
        this.fields.push(field);
    }

    setFields(all_jsonfields, mapping_object=defaultMappingObject, filter_func=defaultFilterFunc, filter_value=null) {
        this.all_jsonfields = all_jsonfields;
        this.mobj = mapping_object;
        this.filter_func = filter_func;

        this.jsonfields = [...all_jsonfields];
        this.jsonfields = this.filter_func(all_jsonfields, filter_value);

        while (this.div_field && this.div_field.hasChildNodes()) {
            this.div_field.removeChild(this.div_field.firstChild);
            this.fields = [];
        }

        this.jsonfields.forEach(obj => {
            this.addField(obj);
        });

        this.values = [];
        this.setBlock(true);
    }

    setInitial(data) {
        if (typeof(data) == "string") {
            data = JSON.parse(data);
        }

        this.field.value = JSON.stringify(data);

        this.fields.forEach(field => {
            if (data[field.name.replace(this.prefix, "")]) {
                if (field instanceof CheckboxField || field instanceof RadioField) {
                    field.setInitial(data[field.name.replace(this.prefix, "")] || "true", !!data[field.name.replace(this.prefix, "")])
                }
                else {
                    field.setInitial(data[field.name.replace(this.prefix, "")] || "")
                }
            }
        });
    }

    subValidate(value, from) {
        let nb_fields = this.fields.length;
        this.data = {};
        for(let i=0; i < nb_fields; ++i) {
            let final_name = this.fields[i].field.name.replace(this.prefix, "");
            let final_value = this.fields[i].field.value;
            if((!(this.fields[i] instanceof CheckboxField) && this.fields[i].valid && final_value) 
                || (this.fields[i] instanceof CheckboxField && this.fields[i].valid && this.fields[i].field.checked)
                ) {
                this.data[final_name] = final_value;
            }
        }

        this.field.value = JSON.stringify(this.data);
        this.notify(this.data);
    }

    validate(notify=true) {
        this.fields.forEach(field => {
            field.validate();
        });
        this.valid = this.fields.every(field => field.valid === true);

        if (notify) {
            this.notify(this.valid);
        }
    }

    organizeBlock() {
        if(this.label) {
            this.div_field.appendChild(this.field_label);
        }
        this.div_field.appendChild(this.field);
        this.div_field.appendChild(this.error_slot);
        this.div_field.appendChild(this.second_div);
    }

    setBlock(re=false) {
        if (!re) {
            this.div_field = document.createElement('div');
            this.div_field.className = 'vbform_field field_' + this.name;
        }

        this.error_slot = document.createElement('p');
        this.error_slot.className = 'vbform_p errorlist';
        this.error_slot.style.display = "none";

        this.second_div = document.createElement('div');
        this.second_div.className = "vbform_subfields";
        let nb_fields = this.fields.length;
        for(let i=0; i < nb_fields; ++i) {
            this.second_div.appendChild(this.fields[i].getBlock());
        }

        this.organizeBlock();
    }

    getBlock() {
        return this.div_field;
    }
}
