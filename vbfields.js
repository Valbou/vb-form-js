
function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}


class FabricField {
    static getInputElement(field, field_label) {
        let new_field = null;
        let lang = navigator.language.toUpperCase() || 'FR';

        switch (field.nodeName.toLowerCase()) {
            case 'input':
                switch (field.type) {
                    case 'hidden':
                        new_field = new HiddenField(field.name, field.value);
                        break;
                    case 'number':
                        new_field = new NumberField(field.name, field_label.innerText, lang);
                        new_field.setInitial(field.value, field.placeholder, (field.step || 1));
                        new_field.setValidator(field.min, field.max, field.required);
                        new_field.field.disabled = field.disabled;
                        break;
                    case 'text':
                        new_field = new CharField(field.name, field_label.innerText, lang);
                        new_field.setInitial(field.value, field.placeholder);
                        new_field.setValidator(field.minLength, field.maxLength, field.required, field.pattern);
                        new_field.field.disabled = field.disabled;
                        break;
                    case 'password':
                        new_field = new PasswordField(field.name, field_label.innerText, lang);
                        new_field.setInitial(field.value, field.placeholder);
                        new_field.setValidator(field.minLength, field.maxLength, field.required, field.pattern);
                        new_field.field.disabled = field.disabled;
                        break;
                    case 'email':
                        new_field = new EmailField(field.name, field_label.innerText, lang);
                        new_field.setInitial(field.value, field.placeholder);
                        new_field.setValidator(field.minLength, field.maxLength, field.required, field.pattern);
                        new_field.field.disabled = field.disabled;
                        break;
                    case 'url':
                        new_field = new UrlField(field.name, field_label.innerText, lang);
                        new_field.setInitial(field.value, field.placeholder);
                        new_field.setValidator(field.minLength, field.maxLength, field.required, field.pattern);
                        new_field.field.disabled = field.disabled;
                        break;
                    case 'tel':
                        new_field = new TelField(field.name, field_label.innerText, lang);
                        new_field.setInitial(field.value, field.placeholder);
                        new_field.setValidator(field.minLength, field.maxLength, field.required, field.pattern);
                        new_field.field.disabled = field.disabled;
                        break;
                    case 'checkbox':
                        new_field = new CheckboxField(field.name, field_label.innerText, lang);
                        new_field.setInitial(field.value, field.checked);
                        new_field.setValidator(field.required);
                        new_field.field.disabled = field.disabled;
                        break;
                    case 'radio':
                        new_field = new RadioField(field.name, field_label.innerText, lang);
                        new_field.setInitial(field.value, field.checked);
                        new_field.setValidator(field.required);
                        new_field.field.disabled = field.disabled;
                        break;
                    case 'date':
                        new_field = new DateField(field.name, field_label.innerText, lang);
                        new_field.setInitial(field.value);
                        new_field.setValidator(field.min, field.max, field.required);
                        new_field.field.disabled = field.disabled;
                        break;
                    case 'time':
                        new_field = new TimeField(field.name, field_label.innerText, lang);
                        new_field.setInitial(field.value);
                        new_field.setValidator(field.min, field.max, field.required);
                        new_field.field.disabled = field.disabled;
                        break;
                    case 'file':
                        new_field = new FileField(field.name, field_label.innerText, lang);
                        new_field.setValidator([field.accept], field.required, field.capture);
                        new_field.field.disabled = field.disabled;
                        break;
                }
                break;
            case 'textarea':
                new_field = new TextField(field.name, field_label.innerText, lang);
                new_field.setInitial(field.value, field.placeholder, field.rows, field.cols, field.spellcheck);
                new_field.setValidator(field.minLength, field.maxLength, field.required);
                new_field.field.disabled = field.disabled;
                break;
            case 'select':
                new_field = new SelectField(field.name, field_label.innerText, lang);
                let options = [];
                let option_tags = field.querySelectorAll('option');
                option_tags.forEach(el => {
                    options.push({label: el.innerText || el.label || '---', value: el.value});
                });
                new_field.setOptions(options);
                new_field.setValidator(field.required);
                new_field.setInitial(field.value);
                new_field.field.disabled = field.disabled;
                break;
        }
        return new_field;
    }

    static fromBlock(divElement) {
        let field_label = divElement.querySelector('label');
        let field = divElement.querySelector('input') || divElement.querySelector('textarea') || divElement.querySelector('select');
        let new_field = FabricField.getInputElement(field, field_label);

        if (new_field) {
            // Replace in place backend node to frontend node
            divElement.parentNode.replaceChild(new_field.getBlock(), divElement);
        }
        return new_field;
    }
}


class HiddenField {
    constructor(name="", value="") {
        this.name = name;
        this.valid = true;
        this.value = value;
        this.id_field = "id_" + this.name;

        this.field = document.createElement('input');
        this.field.name = this.name;
        this.field.id = this.id_field;
        this.field.value = value;
        this.field.type = "hidden";
    }

    getBlock() {
        return this.field;
    }
}


class Field {
    constructor(element='input', name="", label="", lang="FR") {
        this.name = name;
        this.label = label;
        this.lang = lang;
        this.element = element;
        this.error = "";
        this.valid = true;
        this.observers = [];

        this.id_field = "id_" + this.name;
        this.field_label = document.createElement('label');
        this.field_label.htmlFor = this.id_field;
        this.field_label.innerText = this.label;

        this.field = document.createElement(this.element);
        this.field.name = this.name;
        this.field.id = this.id_field;

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
        if(this.valid) {
            this.observers.forEach(([_, func]) => {
                func(value, this.id_field);
            });
        }
    }

    setId(indice) {
        this.id_field = "id_" + this.name + "_" + indice;
        this.field_label.htmlFor = this.id_field;
        this.field.id = this.id_field;
    }

    setInitial(defaultValue="", placeholder='') {
        if (defaultValue || defaultValue == 0) {
            this.field.value = defaultValue;
        }

        if (placeholder) {
            this.field.placeholder = placeholder;
        }
    }

    organizeBlock() {
        this.div_field.appendChild(this.field_label);
        this.div_field.appendChild(this.error_slot);
        this.div_field.appendChild(this.field);
    }

    setBlock() {
        this.div_field = document.createElement('div');
        this.div_field.className = 'vbform_field field_' + this.name;

        this.error_slot = document.createElement('p');
        this.error_slot.className = 'vbform_p errorlist';
        this.error_slot.style.display = "none";

        this.organizeBlock();
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

    getLabel() {
        return this.field_label;
    }

    getField() {
        return this.field;
    }

    getBlock() {
        return this.div_field;
    }
}


class NumberField extends Field {
    constructor(name="", label="", lang="FR") {
        super('input', name, label, lang);
        this.field.type = "number";
    }

    setInitial(defaultValue="", placeholder=null, step=1) {
        this.step = step;
        this.field.step = this.step;
        super.setInitial(defaultValue, placeholder);
    }

    validate(notify=true) {
        let local_value = Number.parseFloat(this.field.value);
        this.error = "";
        if (this.field.value.length > 0 && Number.isNaN(local_value)) {
            this.error = this.lang == "FR" ? "La valeur doit être de type numérique." : "The value must be a numeric type.";
            super.setError(this.error);
        }
        else if ((this.required && Number.isInteger(this.step) && Number.isInteger(local_value)) || (Number.isInteger(this.step) && Number.isInteger(local_value))) {
            if (local_value < this.min) {
                this.error = this.lang == "FR" ? "La valeur doit être un entier supérieur ou égal à "+ this.min +"." : "The value must be an integer greater than or equal to " + this.min +".";
                super.setError(this.error);
            }
            else if (local_value > this.max) {
                this.error = this.lang == "FR" ? "La valeur doit être un entier inférieur ou égal à "+ this.max +"." : "The value must be an integer lower than or equal to " + this.max +".";
                super.setError(this.error);
            }
            else {
                this.error = "";
                super.setError(this.error);
            }
        }
        else if (Number.isInteger(this.step) && isFloat(local_value)) {
            this.error = this.lang == "FR" ? "La valeur doit être un nombre entier." : "The value must be an integer.";
            super.setError(this.error);
        }
        else if (this.required && isFloat(this.step) && isFloat(local_value) || (isFloat(local_value) || Number.isInteger(local_value))) {
            if (local_value < this.min) {
                this.error = this.lang == "FR" ? "La valeur doit être un nombre supérieur ou égal à "+ this.min +"." : "The value must be a number greater than or equal to " + this.min +".";
                super.setError(this.error);
            }
            else if (local_value > this.max) {
                this.error = this.lang == "FR" ? "La valeur doit être un nombre inférieur ou égal à "+ this.max +"." : "The value must be a number lower than or equal to " + this.max +".";
                super.setError(this.error);
            }
            else {
                this.error = "";
                super.setError(this.error);
            }
        }
        else if (this.required) {
            this.error = this.lang == "FR" ? "Merci de compléter ce champ." : "This field is mandatory. Thanks.";
            super.setError(this.error);
        }
        else {
            this.error = "";
            super.setError(this.error);
        }

        if (notify) {
            this.notify(local_value);
        }
    }

    setValidator(min, max, required=false) {
        this.min = min;
        this.max = max;
        this.required = required;

        this.field.min = this.min;
        this.field.max = this.max;
        this.field.required = this.required;

        this.field.addEventListener('input', this.validate.bind(this), {capture: true, once: false});
    }
}


class CharField extends Field {
    constructor(name="", label="", lang="FR") {
        super('input', name, label, lang);
        this.field.type = "text";
    }

    setInitial(defaultValue="", placeholder="", size=20) {
        super.setInitial(defaultValue, placeholder);
        this.field.size = size;
    }

    validate(notify=true) {
        let local_value = this.field.value.length;
        this.error = "";
        if ((this.required && local_value > 0) || local_value > 0) {
            if (local_value < this.min) {
                this.error = this.lang == "FR" ? "Vous devez saisir au moins "+ this.min +" caractères." : "You must write at least " + this.min +" characters.";
                super.setError(this.error);
            }
            else if (local_value > this.max) {
                this.error = this.lang == "FR" ? "La taille maximum ne peut exceder "+ this.max +" caractères." : "Max size of " + this.max +" characters.";
                super.setError(this.error);
            }
            else {
                if (this.regex.length > 0 && this.field.value.match(this.regex) == null) {
                    this.error = this.lang == "FR" ? "Votre saisie semble invalide." : "It seems to be an invalid write.";
                    super.setError(this.error);
                }
                else {
                    this.error = "";
                    super.setError(this.error);
                }
            }
        }
        else if (this.required) {
            this.error = this.lang == "FR" ? "Merci de compléter ce champ." : "This field is mandatory. Thanks.";
            super.setError(this.error);
        }
        else {
            this.error = "";
            super.setError(this.error);
        }

        if (notify) {
            this.notify(this.field.value);
        }
    }

    setValidator(min, max, required=false, regex="") {
        this.min = min;
        this.max = max;
        this.regex = regex;
        this.required = required;
        if (this.min == 0 && this.required) {
            this.min = 1;
        }

        this.field.minLength = this.min;
        this.field.maxLength = this.max;
        this.field.required = this.required;

        if (regex.length > 0) {
            this.field.pattern = regex;
        }

        this.field.addEventListener('input', this.validate.bind(this), {capture: true, once: false});
    }
}


class PasswordField extends CharField {
    constructor(name="", label="", lang="FR") {
        super(name, label, lang);
        this.field.type = "password";
    }

    setValidator(min, max, required=false, regex="^.{8,}$") {
        super.setValidator(min, max, required, regex);
    }
}


class TelField extends CharField {
    constructor(name="", label="", lang="FR") {
        super(name, label, lang);
        this.field.type = "tel";
    }

    setValidator(min, max, required=false, regex="^\+{1}|0{0,2}[()0-9 .-]+$") {
        super.setValidator(min, max, required, regex);
    }
}


class EmailField extends CharField {
    constructor(name="", label="", lang="FR") {
        super(name, label, lang);
        this.field.type = "email";
    }

    setValidator(min, max, required=false, regex="^[\w.-]+@[\w.-]+\.[\w]+$") {
        super.setValidator(min, max, required, regex);
    }
}


class UrlField extends CharField {
    constructor(name="", label="", lang="FR") {
        super(name, label, lang);
        this.field.type = "url";
    }

    setValidator(min, max, required=false, regex="^https?:\/\/[\w.-]+\.[\w]+$") {
        super.setValidator(min, max, required, regex);
    }
}


class TextField extends Field {
    constructor(name="", label="", lang="FR") {
        super('textarea', name, label, lang);
    }

    setInitial(defaultValue="", placeholder="", rows=10, cols=70, spellcheck=true) {
        super.setInitial(defaultValue, placeholder);
        this.field.rows = rows;
        this.field.cols = cols;
        this.field.spellcheck = spellcheck;
    }

    validate(notify=true) {
        let local_value = this.field.value.length;
        this.error = "";
        if ((this.required && local_value > 0) || local_value > 0) {
            if (local_value < this.min) {
                this.error = this.lang == "FR" ? "Vous devez saisir au moins "+ this.min +" caractères." : "You must write at least " + this.min +" characters.";
                super.setError(this.error);
            }
            else if (local_value > this.max) {
                this.error = this.lang == "FR" ? "La taille maximum ne peut exceder "+ this.max +" caractères." : "Max size of " + this.max +" characters.";
                super.setError(this.error);
            }
            else {
                this.error = "";
                super.setError(this.error);
            }
        }
        else if (this.required) {
            this.error = this.lang == "FR" ? "Merci de compléter ce champ." : "This field is mandatory. Thanks.";
            super.setError(this.error);
        }
        else {
            this.error = "";
            super.setError(this.error);
        }

        if (notify) {
            this.notify(this.field.value);
        }
    }

    setValidator(min, max, required=false) {
        this.min = min;
        this.max = max;
        this.required = required;
        if (this.min == 0 && this.required) {
            this.min = 1;
        }

        this.field.minLength = this.min;
        this.field.maxLength = this.max;
        this.field.required = this.required;

        this.field.addEventListener('input', this.validate.bind(this), {capture: true, once: false});
    }
}


function defaultFilterFunc(options, value) {
    return options;
}


class SelectField extends Field {
    constructor(name="", label="", lang="FR") {
        super('select', name, label, lang);
    }

    setInitial(defaultValue="") {
        this.field.value = defaultValue.toString();
    }

    validate(notify=true) {
        let local_value = this.field.value;
        this.error = "";
        if ((this.required && local_value != "") || local_value != "") {
            if (this.options.filter(el => el[this.value_name] == local_value).length == 0) {
                this.error = this.lang == "FR" ? "Le choix "+local_value+" ne fait pas partie de la liste des choix possibles." : "The choice "+local_value+" is not a possible choice.";
                super.setError(this.error);
            }
            else {
                this.error = "";
                super.setError(this.error);
            }
        }
        else if (this.required) {
            this.error = this.lang == "FR" ? "Merci de compléter ce champ." : "This field is mandatory. Thanks.";
            super.setError(this.error);
        }
        else {
            this.error = "";
            super.setError(this.error);
        }

        if (notify) {
            this.notify(local_value);
        }
    }

    addOption(object) {
        let option = document.createElement('option');
        option.innerText = object[this.label_name];
        option.value = object[this.value_name];
        option.selected = this.field.value == option.value;
        this.field.appendChild(option);
    }

    setOptions(all_options, label_name="label", value_name="value", filter_func=defaultFilterFunc, filter_value=null) {
        this.all_options = all_options;
        this.filter_func = filter_func;

        this.options = [...all_options];
        this.options = this.filter_func(all_options, filter_value);

        this.label_name = label_name;
        this.value_name = value_name;

        while (this.field.hasChildNodes()) {
            this.field.removeChild(this.field.firstChild);
        }

        this.options.forEach(obj => {
            obj[this.value_name] = obj[this.value_name].toString();
            this.addOption(obj);
        });

        this.field.value = this.options[0][this.value_name];
    }

    setValidator(required=false) {
        this.required = required;
        this.field.required = this.required;

        this.field.addEventListener('change', this.validate.bind(this));
    }

    reloadField(value, from) {
        this.setOptions(this.all_options, this.label_name, this.value_name, this.filter_func, value);
        this.setValidator(this.required);
    }
}


class CheckboxField extends Field {
    constructor(name="", label="", lang="FR") {
        super('input', name, label, lang);
        this.field.type = "checkbox";
    }

    setInitial(defaultValue="", checked=false) {
        this.value = defaultValue.toString();
        this.field.value = this.value;
        this.field.checked = checked;
    }

    validate(notify=true) {
        let local_value = this.field.value;
        this.error = "";
        if ((this.required && this.field.checked) || this.field.checked) {
            if (local_value != this.value) {
                this.error = this.lang == "FR" ? "La valeur n'est pas conforme." : "The value is invalid.";
                super.setError(this.error);
            }
            else {
                this.error = "";
                super.setError(this.error);
            }
        }
        else if (this.required) {
            this.error = this.lang == "FR" ? "Merci de cocher ce champ pour continuer." : "Please, check this field to continue.";
            super.setError(this.error);
        }
        else {
            this.error = "";
            super.setError(this.error);
        }

        if (notify) {
            this.notify(local_value);
        }
    }

    setValidator(required=false) {
        this.required = required;
        this.field.required = this.required;

        this.field.addEventListener('change', this.validate.bind(this));
    }

    organizeBlock() {
        this.div_field.appendChild(this.error_slot);
        this.field_label.prepend(this.field);
        this.div_field.appendChild(this.field_label);
    }

    reloadField(value, from) {
        this.setInitial(this.value, !!value);
        this.setValidator(this.required);
    }
}


class RadioField extends CheckboxField {
    constructor(name="", label="", lang="FR") {
        super(name, label, lang);
        this.field.type = "radio";
    }
}


class DateField extends NumberField {
    constructor(name="", label="", lang="FR") {
        super(name, label, lang);
        this.field.type = "date";
    }

    validate(notify=true) {
        let local_value = Date.parse(this.field.value);
        this.error = "";
        if (this.required && isNaN(local_value)) {
            this.error = this.lang == "FR" ? "Merci de compléter ce champ." : "This field is mandatory. Thanks.";
            super.setError(this.error);
        }
        else if ((this.required && local_value) || local_value) {
            if (local_value < Date.parse(this.min)) {
                this.error = this.lang == "FR" ? "La valeur doit être une date supérieure ou égale à "+ this.min +"." : "The value must be a date greater than or equal to " + this.min +".";
                super.setError(this.error);
            }
            else if (local_value > Date.parse(this.max)) {
                this.error = this.lang == "FR" ? "La valeur doit être une date inférieure ou égale à "+ this.max +"." : "The value must be a date lower than or equal to " + this.max +".";
                super.setError(this.error);
            }
            else {
                this.error = "";
                super.setError(this.error);
            }
        }
        else {
            this.error = "";
            super.setError(this.error);
        }

        if (notify) {
            this.notify(this.field.value);
        }
    }
}


class TimeField extends NumberField {
    constructor(name="", label="", lang="FR") {
        super(name, label, lang);
        this.field.type = "time";
    }

    toFloat(value) {
        let array = value.split(':').map(a => Number.parseInt(a))
        if (this.field.value == "") {
            return null;
        }
        else if(!Array.isArray(array)) {
            return -1;
        }
        return array[0] + (array[1] / 60)
    }

    validate(notify=true) {
        let local_value = this.toFloat(this.field.value);
        let local_min = this.toFloat(this.min);
        let local_max = this.toFloat(this.max);
        this.error = "";
        if (this.required && !local_value) {
            this.error = this.lang == "FR" ? "Merci de compléter ce champ." : "This field is mandatory. Thanks.";
            super.setError(this.error);
        }
        else if ((this.required && local_value) || local_value) {
            if (local_value >= 24 && local_value < 0) {
                // Seems to be not used - invalid value for navigator
                this.error = this.lang == "FR" ? "La valeur doit être une heure entre 00:00 et 23:59." : "The value must be a time between 00:00 et 23:59.";
                super.setError(this.error);
            }
            else if ((local_min < local_max && (local_value < local_min || local_value > local_max))
                || (local_min > local_max && ((local_value > local_min && local_value < local_max) || (local_value < local_min && local_value > local_max)))
                || (local_min == local_max && local_value != local_min)) {
                this.error = this.lang == "FR" ? "La valeur doit être une heure entre "+this.min+" et "+this.max+"." : "The value must be a hour between "+this.min+" et "+this.max+".";
                super.setError(this.error);
            }
            else {
                this.error = "";
                super.setError(this.error);
            }
        }
        else {
            this.error = "";
            super.setError(this.error);
        }

        if (notify) {
            this.notify(this.field.value);
        }
    }
}


class RangeField extends NumberField {
    constructor(name="", label="", lang="FR") {
        super(name, label, lang);
        this.field.type = "range";
    }
}


class ColorField extends Field {
    constructor(name="", label="", lang="FR") {
        super('input', name, label, lang);
        this.field.type = "color";
    }

    setInitial(defaultValue="") {
        super.setInitial(defaultValue);
    }

    validate(notify=true) {
        let local_value = this.field.value;
        this.error = "";

        if (notify) {
            this.notify(local_value);
        }
    }

    setValidator() {
        this.field.addEventListener('input', this.validate.bind(this), {capture: true, once: false});
    }
}


class FileField {
    constructor(name="", label="", lang="FR") {
        this.name = name;
        this.label = label;
        this.lang = lang;
        this.element = 'input';
        this.error = "";
        this.valid = true;
        this.observers = [];

        this.field_label = document.createElement('label');
        this.field_label.htmlFor = "id_" + this.name;
        this.field_label.innerText = this.label;

        this.field = document.createElement(this.element);
        this.field.name = this.name;
        this.field.id = "id_"+this.name;
        this.field.type = 'file';

        this.setBlock();
    }

    addSubscription(obs_name, func) {
        this.observers.push([obs_name, func]);
    }

    delSubscription(obs_name) {
        this.observers = this.observers.filter(([name, _]) => obs_name != name);
    }

    notify() {
        if(this.valid) {
            this.observers.forEach(([_, func]) => {
                func(this.valid, this.name);
            });
        }
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

    organizeBlock() {
        this.div_field.appendChild(this.field_label);
        this.div_field.appendChild(this.error_slot);
        this.div_field.appendChild(this.field);
    }

    setBlock() {
        this.div_field = document.createElement('div');
        this.div_field.className = 'vbform_field field_' + this.name;

        this.error_slot = document.createElement('p');
        this.error_slot.className = 'vbform_p errorlist';
        this.error_slot.style.display = "none";

        this.organizeBlock();
    }

    getLabel() {
        return this.field_label;
    }

    getField() {
        return this.field;
    }

    getBlock() {
        return this.div_field;
    }

    validate(notify=true) {
        let local_value = this.field.value;
        if (this.required && !local_value) {
            this.error = this.lang == "FR" ? "Merci de compléter ce champ." : "This field is mandatory. Thanks.";
            this.setError(this.error);
        }
        else {
            this.error = "";
            this.setError(this.error);
        }

        if (notify) {
            this.notify(local_value);
        }
    }

    setValidator(accepts=[], required=false, capture=null) {
        if (accepts.length > 0) {
            this.field.accept = accepts.join(', ');
        }
        this.required = required;
        this.field.required = this.required;
        if(capture) {
            this.field.capture = capture;
        }

        this.field.addEventListener('change', this.validate.bind(this), {capture: true, once: false});
    }
}


class ImageField extends FileField {
    constructor(name="", label="", lang="FR") {
        super(name, label, lang);
    }

    setInitial(defaultSrc="") {
        this.img_preview.src = defaultSrc;
    }

    organizeBlock() {
        this.field_label.appendChild(this.img_preview);
        this.div_field.appendChild(this.field_label);
        this.div_field.appendChild(this.error_slot);
        this.div_field.appendChild(this.field);
    }

    setBlock() {
        this.div_field = document.createElement('div');
        this.div_field.className = 'vbform_field field_' + this.name;

        this.error_slot = document.createElement('p');
        this.error_slot.className = 'vbform_p errorlist';
        this.error_slot.style.display = "none";

        this.img_preview = document.createElement('img');
        this.img_preview.className = "vbpreview_upload";
        this.img_preview.alt = (this.lang == "FR" ? "Prévisualisation de l'image choisie." : "Uploaded image previsualization");

        this.organizeBlock();
    }

    validate(notify=true) {
        if (this.field.files.length > 0) {
            if ('srcObject' in this.img_preview) {
                this.img_preview.srcObject = this.field.files[0];
            }
            else {
                this.img_preview.src = URL.createObjectURL(this.field.files[0]);
            }
        }
        super.validate(notify);
    }
}
