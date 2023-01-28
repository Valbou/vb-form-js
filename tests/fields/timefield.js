
function base_config_TimeField(min, max, required, step) {
    let testfield = new TimeField("rdv", "Ton RDV");
    testfield.setInitial("", "HH:MM", step);
    testfield.setValidator(min, max, required);
    assertEqual(testfield.field.nodeName.toLowerCase(), "input");
    assertEqual(testfield.field.type, "time");
    return testfield;
}


let tests_TimeField = [
    function test_TimeField_ok() {
        let testfield = base_config_TimeField("08:00", "18:00", false, 1)
        testfield.field.value = "12:00";
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
    function test_TimeField_ko_required() {
        let testfield = base_config_TimeField("08:00", "18:00", true, 1)
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "Merci de compléter ce champ.");
    },
    function test_TimeField_ko_hack() {
        let testfield = base_config_TimeField("08:00", "18:00", true, 1)
        testfield.field.value = "26:70";
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "Merci de compléter ce champ.");
    },
    function test_TimeField_before_min() {
        let testfield = base_config_TimeField("08:00", "18:00", true, 1)
        testfield.field.value = "07:30";
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "La valeur doit être une heure entre 08:00 et 18:00.");
    },
    function test_TimeField_after_max() {
        let testfield = base_config_TimeField("08:00", "18:00", false, 1)
        testfield.field.value = "18:59";
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "La valeur doit être une heure entre 08:00 et 18:00.");
    },
    function test_TimeField_negative_time_ok() {
        let testfield = base_config_TimeField("18:00", "08:00", false, 1)
        testfield.field.value = "20:00";
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
    function test_TimeField_negative_time_ko() {
        let testfield = base_config_TimeField("18:00", "08:00", false, 1)
        testfield.field.value = "10:00";
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "La valeur doit être une heure entre 18:00 et 08:00.");
    },
]
