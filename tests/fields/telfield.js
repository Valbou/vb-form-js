
function base_config_TelField(min, max, required, regex) {
    let testfield = new TelField("tel", "Ton Téléphone");
    testfield.setInitial("", "+33 6 XX XX XX XX");
    testfield.setValidator(min, max, required, regex);
    assertEqual(testfield.field.nodeName.toLowerCase(), "input");
    assertEqual(testfield.field.type, "tel");
    return testfield;
}

function base_config_TelField_EN(min, max, required, regex) {
    let testfield = new TelField("tel", "Your Phone Number", "EN");
    testfield.setInitial("", "+2 XXX XXX XXX");
    testfield.setValidator(min, max, required, regex);
    return testfield;
}

let tests_TelField = [
    function test_TelField_ok() {
        let testfield = base_config_TelField(3, 90, false, "")
        testfield.field.value = "Valentin";
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
    function test_TelField_required_ko() {
        let testfield = base_config_TelField(3, 90, true, "")
        testfield.field.value = "";
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "Merci de compléter ce champ.");
    },
    function test_TelField_required_ok() {
        let testfield = base_config_TelField(3, 90, true, "")
        testfield.field.value = "Valentin";
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
    function test_TelField_not_enough_chars() {
        let testfield = base_config_TelField(3, 90, false, "")
        testfield.field.value = "V";
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "Vous devez saisir au moins 3 caractères.");
    },
    function test_TelField_too_much_chars() {
        let testfield = base_config_TelField(3, 90, false, "")
        testfield.field.value = "abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789";
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "La taille maximum ne peut exceder 90 caractères.");
    },
    function test_TelField_regex_ok() {
        let testfield = base_config_TelField(3, 90, false, "^[A-Za-z]*$")
        testfield.field.value = "Valentin";
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
    function test_TelField_regex_ko() {
        let testfield = base_config_TelField(3, 90, false, "^[A-Za-z]*$")
        testfield.field.value = "V4l3nt1n";
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "Votre saisie semble invalide.");
    },
    function test_TelField_lang_EN() {
        let testfield = base_config_TelField_EN(3, 90, false, "^[A-Za-z]*$")
        testfield.field.value = "V4l3nt1n";
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "It seems to be an invalid write.");
    },
    function test_TelField_error_slot_show() {
        let testfield = base_config_TelField(3, 90, true, "")
        testfield.field.value = "";
        testfield.validate();
        assertFalse(testfield.valid);
        assertGreaterEqual(testfield.error.length, 1);
        assertEqual(testfield.error_slot.innerText, testfield.error);
        assertEqual(testfield.error_slot.style.display, "");
    },
    function test_TelField_error_slot_hide() {
        let testfield = base_config_TelField(3, 90, true, "")
        testfield.field.value = "Valentin";
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error.length, 0);
        assertEqual(testfield.error_slot.innerText, testfield.error);
        assertEqual(testfield.error_slot.style.display, "none");
    },
    function test_TelField_min_required() {
        let testfield = base_config_TelField(0, 90, true, "")
        assertEqual(testfield.min, 1);
    },
]
