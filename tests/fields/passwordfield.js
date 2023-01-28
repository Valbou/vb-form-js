
function base_config_PasswordField(min, max, required, regex) {
    let testfield = new PasswordField("mdp", "Ton Mot de Passe");
    testfield.setInitial("", "M0t_d3#P45se");
    testfield.setValidator(min, max, required, regex);
    assertEqual(testfield.field.nodeName.toLowerCase(), "input");
    assertEqual(testfield.field.type, "password");
    return testfield;
}

function base_config_PasswordField_EN(min, max, required, regex) {
    let testfield = new PasswordField("name", "Your Name", "EN");
    testfield.setInitial("", "Name");
    testfield.setValidator(min, max, required, regex);
    return testfield;
}

let tests_PasswordField = [
    function test_PasswordField_ok() {
        let testfield = base_config_PasswordField(3, 90, false, "")
        testfield.field.value = "Valentin";
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
    function test_PasswordField_required_ko() {
        let testfield = base_config_PasswordField(3, 90, true, "")
        testfield.field.value = "";
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "Merci de compléter ce champ.");
    },
    function test_PasswordField_required_ok() {
        let testfield = base_config_PasswordField(3, 90, true, "")
        testfield.field.value = "Valentin";
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
    function test_PasswordField_not_enough_chars() {
        let testfield = base_config_PasswordField(3, 90, false, "")
        testfield.field.value = "V";
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "Vous devez saisir au moins 3 caractères.");
    },
    function test_PasswordField_too_much_chars() {
        let testfield = base_config_PasswordField(3, 90, false, "")
        testfield.field.value = "abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789";
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "La taille maximum ne peut exceder 90 caractères.");
    },
    function test_PasswordField_regex_ok() {
        let testfield = base_config_PasswordField(3, 90, false, "^[A-Za-z]*$")
        testfield.field.value = "Valentin";
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
    function test_PasswordField_regex_ko() {
        let testfield = base_config_PasswordField(3, 90, false, "^[A-Za-z]*$")
        testfield.field.value = "V4l3nt1n";
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "Votre saisie semble invalide.");
    },
    function test_PasswordField_lang_EN() {
        let testfield = base_config_PasswordField_EN(3, 90, false, "^[A-Za-z]*$")
        testfield.field.value = "V4l3nt1n";
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "It seems to be an invalid write.");
    },
    function test_PasswordField_error_slot_show() {
        let testfield = base_config_PasswordField(3, 90, true, "")
        testfield.field.value = "";
        testfield.validate();
        assertFalse(testfield.valid);
        assertGreaterEqual(testfield.error.length, 1);
        assertEqual(testfield.error_slot.innerText, testfield.error);
        assertEqual(testfield.error_slot.style.display, "");
    },
    function test_PasswordField_error_slot_hide() {
        let testfield = base_config_PasswordField(3, 90, true, "")
        testfield.field.value = "Valentin";
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error.length, 0);
        assertEqual(testfield.error_slot.innerText, testfield.error);
        assertEqual(testfield.error_slot.style.display, "none");
    },
    function test_PasswordField_min_required() {
        let testfield = base_config_PasswordField(0, 90, true, "")
        assertEqual(testfield.min, 1);
    },
]
