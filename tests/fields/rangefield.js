function base_config_RangeField(min, max, required, step) {
    let testfield = new RangeField("niveau", "Ton Niveau");
    testfield.setInitial(18, "", step);
    testfield.setValidator(min, max, required);
    assertEqual(testfield.field.nodeName.toLowerCase(), "input");
    assertEqual(testfield.field.type, "range");
    return testfield;
}

let tests_RangeField = [
    function test_RangeField_ok() {
        let testfield = base_config_RangeField(3, 90, false, 1)
        testfield.field.value = 30;
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
    function test_RangeField() {
        let testfield = base_config_RangeField(3, 90, false, 0.1)
        testfield.field.value = 30;
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
    function test_RangeField_lower() {
        let testfield = base_config_RangeField(3, 90, false, 1.5)
        testfield.field.value = 2;
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.field.value, "3");
    },
    function test_RangeField_greater() {
        let testfield = base_config_RangeField(3, 90, false, 1.5)
        testfield.field.value = 150;
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.field.value, "90");
    },
    function test_RangeField() {
        let testfield = base_config_RangeField(3, 90, true, 1)
        testfield.field.value = null;
        testfield.validate();
        assertTrue(testfield.valid);
        // Default = round(min/2 + max/2)
        assertEqual(testfield.field.value, "47");
    },
]
