function base_form_fixture(action="#", method="post", enctype="multipart/form-data") {
    let form = new Form(action, method, enctype);
    assertEqual(form.form.nodeName.toLowerCase(), "form");
    return form;
}

function base_form_template() {
    return `<form id="toreplace" action="#" method="post" enctype="multipart/form-data" class="form"><div class="vbform_field field_nom"><label for="id_nom">Ton Nom</label><p class="vbform_p error" style="display: none;"></p><input name="nom" id="id_nom" placeholder="Nom" type="text" minlength="3" maxlength="90" required=""></div><div class="vbform_field field_prenom"><label for="id_prenom">Ton Prénom</label><p class="vbform_p error" style="display: none;"></p><input name="prenom" id="id_prenom" placeholder="Prénom" type="text" minlength="3" maxlength="90" pattern="^[A-Za-z]*$"></div><fieldset><legend class="vertneg">Test FieldSet</legend><div class="gpform"><div class="vbform_field field_poids"><label for="id_poids">Ton poids</label><p class="vbform_p error" style="display: none;"></p><input name="poids" id="id_poids" step="0.1" type="number" min="10" max="1000"></div><div class="vbform_field field_age"><label for="id_age">Ton age</label><p class="vbform_p error" style="display: none;"></p><input name="age" id="id_age" step="1" type="number" min="18" max="85" required=""></div></fieldset><input type="submit" value="Enregistrer"></form>`;
}


let tests_Form = [
    function test_Form_tag() {
        let form = base_form_fixture("/test", "get");
        let form_tag = form.getForm();
        assertTrue(form_tag.action.startsWith("file:///"));
        assertEqual(form_tag.action, "file:///test");
        assertEqual(form_tag.method, "get");
    },
    function test_Form_invalid_method() {
        let form = base_form_fixture("#", "put");
        let form_tag = form.getForm();
        assertEqual(form_tag.method, "get");
    },
    function test_Form_submit() {
        let form = base_form_fixture("/test", "post");
        let value = "Valider"
        form.addSubmit(value);
        let submit = form.form.querySelector('[type="submit"]');
        assertNotNull(submit);
        assertEqual(submit.nodeName.toLowerCase(), "input");
        assertEqual(submit.value, value);
    },
    function test_Form_addfield() {
        let form = base_form_fixture("/test", "post");
        let testfield = base_config_CharField(0, 50, true);
        form.addField(testfield);
        let input = form.form.querySelector('[type="text"]');
        assertNotNull(input);
        assertEqual(input.nodeName.toLowerCase(), "input");
        assertEqual(input.maxLength, 50);
        assertTrue(input.required);
    },
    function test_Form_invalid_fields() {
        let form = base_form_fixture("#", "post");
        let testfield = base_config_CharField(0, 50, true);
        form.addField(testfield);
        form.addSubmit("Ko");
        let submit = form.form.querySelector('[type="submit"]');
        assertNotNull(submit);
        assertEqual(form.invalid_fields, 0);
        submit.click();
        assertEqual(form.invalid_fields, 1);
    },
    function test_Form_valid_fields() {
        let form = base_form_fixture("#", "post");
        let testfield = base_config_CharField(0, 50, false);
        form.addField(testfield);
        form.addSubmit("Ok");
        let submit = form.form.querySelector('[type="submit"]');
        assertNotNull(submit);
        assertEqual(form.invalid_fields, 0);
        submit.click();
        assertEqual(form.invalid_fields, 0);
    },
    function test_Form_fromHtml_preserve_fields() {
        const htmlform = base_form_template();
        let body = document.createElement('body');
        body.innerHTML = htmlform;
        let form = Form.fromHtml("#toreplace", body);

        assertNotNull(form);
        let submit = form.form.querySelector('[type="submit"]');
        assertNotNull(submit);
        let all_fields = form.form.querySelectorAll('input');
        assertEqual(all_fields.length, 5);
    },
    function test_Form_fromHtml_preserve_listeners() {
        const htmlform = base_form_template();
        let body = document.createElement('body');
        body.innerHTML = htmlform;
        let form = Form.fromHtml("#toreplace", body);
        let submit = form.form.querySelector('[type="submit"]');

        assertEqual(form.invalid_fields, 0);
        submit.click();
        assertEqual(form.invalid_fields, 2);
    },
    function test_Form_fromHtml_preserve_structure() {
        const htmlform = base_form_template();
        let body = document.createElement('body');
        body.innerHTML = htmlform;
        let form = Form.fromHtml("#toreplace", body);

        let fieldset = form.form.querySelector('fieldset');
        assertNotNull(fieldset);
        let legend = form.form.querySelector('legend');
        assertNotNull(legend);
        assertEqual(legend.innerText, "Test FieldSet")
    },
]
