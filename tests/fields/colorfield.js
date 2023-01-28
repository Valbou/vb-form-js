
function base_config_ColorField() {
    let testfield = new ColorField("color", "Ta Couleur Préférée");
    testfield.setInitial("", "#000000");
    testfield.setValidator();
    assertEqual(testfield.field.nodeName.toLowerCase(), "input");
    assertEqual(testfield.field.type, "color");
    return testfield;
}

let tests_ColorField = [
    function test_ColorField_ok() {
        let testfield = base_config_ColorField()
        testfield.field.value = "#FF00FF";
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
    function test_ColorField_required() {
        let testfield = base_config_ColorField()
        testfield.field.value = "";
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.field.value, "#000000")
    },
    function test_ColorField_required_ok() {
        let testfield = base_config_ColorField()
        testfield.field.value = "#AA5656";
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
    function test_ColorField_not_enough_chars() {
        let testfield = base_config_ColorField()
        testfield.field.value = "#12";
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.field.value, "#000000")
    },
    function test_ColorField_too_much_chars() {
        let testfield = base_config_ColorField()
        testfield.field.value = "#12345678";
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.field.value, "#000000")
    },
    function test_ColorField_regex_ko() {
        let testfield = base_config_ColorField()
        testfield.field.value = "#123YYZ";
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.field.value, "#000000")
    },
    function test_ColorField_error_slot_show() {
        let testfield = base_config_ColorField()
        testfield.field.value = "";
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.field.value, "#000000")
        assertGreaterEqual(testfield.error.length, 0);
    },
    function test_ColorField_error_slot_hide() {
        let testfield = base_config_ColorField()
        testfield.field.value = "#999999";
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error.length, 0);
        assertEqual(testfield.error_slot.innerText, testfield.error);
        assertEqual(testfield.error_slot.style.display, "none");
    },
]
