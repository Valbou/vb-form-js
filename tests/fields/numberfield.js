function base_config_NumberField_integer(min, max, required, step) {
    let testfield = new NumberField("age", "Ton Age");
    testfield.setInitial(18, "Age", step);
    testfield.setValidator(min, max, required);
    assertEqual(testfield.field.nodeName.toLowerCase(), "input");
    assertEqual(testfield.field.type, "number");
    return testfield;
}

function base_config_NumberField_float(min, max, required, step) {
    let testfield = new NumberField("poids", "Ton Poids");
    testfield.setInitial(50, "Poids", step);
    testfield.setValidator(min, max, required);
    return testfield;
}


let tests_NumberField = [
    function test_NumberField_ok() {
        let testfield = base_config_NumberField_integer(3, 90, false, 1)
        testfield.field.value = 30;
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
    function test_NumberField_integer_float() {
        let testfield = base_config_NumberField_integer(3, 90, false, 1)
        testfield.field.value = 30.1;
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "La valeur doit être un nombre entier.");
    },
    function test_NumberField_float_integer() {
        let testfield = base_config_NumberField_float(3, 90, false, 0.1)
        testfield.field.value = 30;
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
    function test_NumberField_NaN() {
        let testfield = base_config_NumberField_integer(3, 90, false, 1)
        testfield.field.value = "Val";
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.field.value, "")
        assertEqual(testfield.error, "");
    },
    function test_NumberField_int_lower() {
        let testfield = base_config_NumberField_integer(3, 90, false, 1)
        testfield.field.value = 2;
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "La valeur doit être un entier supérieur ou égal à 3.");
    },
    function test_NumberField_int_greater() {
        let testfield = base_config_NumberField_integer(3, 90, false, 1)
        testfield.field.value = 150;
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "La valeur doit être un entier inférieur ou égal à 90.");
    },
    function test_NumberField_float_lower_int() {
        let testfield = base_config_NumberField_float(3, 90, false, 0.1)
        testfield.field.value = 2;
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "La valeur doit être un nombre supérieur ou égal à 3.");
    },
    function test_NumberField_float_lower() {
        let testfield = base_config_NumberField_float(3, 90, false, 0.1)
        testfield.field.value = 2.2;
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "La valeur doit être un nombre supérieur ou égal à 3.");
    },
    function test_NumberField_float_greater_int() {
        let testfield = base_config_NumberField_float(3, 90, false, 0.1)
        testfield.field.value = 150;
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "La valeur doit être un nombre inférieur ou égal à 90.");
    },
    function test_NumberField_float_greater() {
        let testfield = base_config_NumberField_float(3, 90, false, 0.1)
        testfield.field.value = 150.9;
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "La valeur doit être un nombre inférieur ou égal à 90.");
    },
    function test_NumberField_integer() {
        let testfield = base_config_NumberField_integer(3, 90, true, 1)
        testfield.field.value = null;
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "Merci de compléter ce champ.");
    },
    function test_NumberField_float() {
        let testfield = base_config_NumberField_float(3, 90, true, 0.1)
        testfield.field.value = "";
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "Merci de compléter ce champ.");
    },
    function test_NumberField_0_integer() {
        let testfield = base_config_NumberField_integer(-90, 90, true, 1)
        testfield.field.value = "0";
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
    function test_NumberField_0_float() {
        let testfield = base_config_NumberField_float(-90, 90, true, 0.1)
        testfield.field.value = 0;
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
]
