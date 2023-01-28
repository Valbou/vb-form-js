function base_config_CheckboxField(required, checked) {
    let testfield = new CheckboxField("optin", "Newsletter");
    testfield.setValidator(required);
    testfield.setInitial("value", checked);
    assertEqual(testfield.field.nodeName.toLowerCase(), "input");
    assertEqual(testfield.field.type, "checkbox");
    return testfield;
}

let tests_CheckboxField = [
    function test_CheckboxField_ok() {
        let testfield = base_config_CheckboxField(false, true);
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
    function test_CheckboxField_ko() {
        let testfield = base_config_CheckboxField(true, false);
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "Merci de cocher ce champ pour continuer.");
    },
    function test_CheckboxField_ok_required() {
        let testfield = base_config_CheckboxField(true, true);
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
    function test_CheckboxField_ok_optionnal() {
        let testfield = base_config_CheckboxField(false, false);
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
    function test_CheckboxField_hacked_required() {
        let testfield = base_config_CheckboxField(true, true);
        testfield.field.value = "hack";
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "La valeur n'est pas conforme.");
    },
]
