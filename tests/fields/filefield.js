function base_config_FileField(required) {
    let testfield = new FileField("contrat", "Ton Contrat");
    let accepted = ['.pdf, .doc, .docx'];
    testfield.setValidator(accepted, required);
    assertEqual(testfield.field.nodeName.toLowerCase(), "input");
    assertEqual(testfield.field.type, "file");
    return testfield;
}

function base_config_ImageField(required) {
    let testfield = new ImageField("contrat", "Ton Contrat");
    let accepted = ['image/*'];
    testfield.setValidator(accepted, required);
    assertEqual(testfield.field.nodeName.toLowerCase(), "input");
    assertEqual(testfield.field.type, "file");
    return testfield;
}


let tests_FileField = [
    function test_FileField() {
        let testfield = base_config_FileField(false);
        assertIsInstance(testfield, FileField);
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
    function test_FileField_required() {
        let testfield = base_config_FileField(true);
        assertIsInstance(testfield, FileField);
        testfield.field.value = "";
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "Merci de compléter ce champ.");
    },
]
