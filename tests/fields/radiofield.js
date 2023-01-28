function base_config_RadioField(required, checked) {
    let testfield = new RadioField("optin", "Newsletter");
    testfield.setValidator(required);
    testfield.setInitial("value", checked);
    assertEqual(testfield.field.nodeName.toLowerCase(), "input");
    assertEqual(testfield.field.type, "radio");
    return testfield;
}

let tests_RadioField = [
    function test_RadioField_ok() {
        let testfield = base_config_RadioField(false, true);
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
    function test_RadioField_ko() {
        let testfield = base_config_RadioField(true, false);
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "Merci de cocher ce champ pour continuer.");
    },
    function test_RadioField_ok_required() {
        let testfield = base_config_RadioField(true, true);
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
    function test_RadioField_ok_optionnal() {
        let testfield = base_config_RadioField(false, false);
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
    function test_RadioField_hacked_required() {
        let testfield = base_config_RadioField(true, true);
        testfield.field.value = "hack";
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "La valeur n'est pas conforme.");
    },
]
