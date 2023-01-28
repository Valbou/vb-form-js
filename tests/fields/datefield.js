
function base_config_DateField(min, max, required, step) {
    let testfield = new DateField("naissance", "Ta Date de Naissance");
    testfield.setInitial("", "YYYY-MM-JJ", step);
    testfield.setValidator(min, max, required);
    assertEqual(testfield.field.nodeName.toLowerCase(), "input");
    assertEqual(testfield.field.type, "date");
    return testfield;
}


let tests_DateField = [
    function test_DateField_ok() {
        let testfield = base_config_DateField("2021-01-01", "2022-12-31", false, 1)
        testfield.field.value = "2022-01-01";
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
    function test_DateField_ko() {
        let testfield = base_config_DateField("2021-01-01", "2022-12-31", true, 1)
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "Merci de compléter ce champ.");
    },
    function test_DateField_before_min() {
        let testfield = base_config_DateField("2021-01-01", "2022-12-31", true, 1)
        testfield.field.value = "2020-01-01";
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "La valeur doit être une date supérieure ou égale à 2021-01-01.");
    },
    function test_DateField_after_max() {
        let testfield = base_config_DateField("2021-01-01", "2022-12-31", false, 1)
        testfield.field.value = "2023-01-01";
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "La valeur doit être une date inférieure ou égale à 2022-12-31.");
    },
]
