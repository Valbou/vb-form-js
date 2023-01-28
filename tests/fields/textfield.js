
function base_config_TextField(min, max, required) {
    let testfield = new TextField("message", "Ton Message");
    testfield.setInitial("", "Message...");
    testfield.setValidator(min, max, required);
    assertEqual(testfield.field.nodeName.toLowerCase(), "textarea");
    assertTrue(testfield.field.spellcheck);
    return testfield;
}

let tests_TextField = [
    function test_TextField_ok() {
        let testfield = base_config_TextField(3, 90, false)
        testfield.field.value = "Valentin";
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
    function test_TextField_required_ko() {
        let testfield = base_config_TextField(3, 90, true)
        testfield.field.value = "";
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "Merci de compléter ce champ.");
    },
    function test_TextField_required_ok() {
        let testfield = base_config_TextField(3, 90, true)
        testfield.field.value = "Valentin";
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
    function test_TextField_not_enough_chars() {
        let testfield = base_config_TextField(3, 90, false)
        testfield.field.value = "V";
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "Vous devez saisir au moins 3 caractères.");
    },
    function test_TextField_too_much_chars() {
        let testfield = base_config_TextField(3, 90, false)
        testfield.field.value = "abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789";
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "La taille maximum ne peut exceder 90 caractères.");
    },
    function test_TextField_error_slot_show() {
        let testfield = base_config_TextField(3, 90, true)
        testfield.field.value = "";
        testfield.validate();
        assertFalse(testfield.valid);
        assertGreaterEqual(testfield.error.length, 1);
        assertEqual(testfield.error_slot.innerText, testfield.error);
        assertEqual(testfield.error_slot.style.display, "");
    },
    function test_TextField_error_slot_hide() {
        let testfield = base_config_TextField(3, 90, true)
        testfield.field.value = "Valentin";
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error.length, 0);
        assertEqual(testfield.error_slot.innerText, testfield.error);
        assertEqual(testfield.error_slot.style.display, "none");
    },
    function test_TextField_min_required() {
        let testfield = base_config_CharField(0, 90, true)
        assertEqual(testfield.min, 1);
    },
]
