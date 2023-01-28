function base_config_SelectField(required, options=null) {
    let testfield = new SelectField("genre", "Ton Genre");
    options = options || [
        {id: 1, label: "a", type: 1},
        {id: 2, label: "b", type: 4},
        {id: 3, label: "d", type: 2},
        {id: 4, label: "e", type: 4},
        {id: 5, label: "f", type: 1},
        {id: 8, label: "g", type: 1},
        {id: 9, label: "h", type: 2},
    ];
    testfield.setOptions(options, 'label', 'id');
    testfield.setValidator(required);
    testfield.setInitial(2);
    assertEqual(testfield.field.nodeName.toLowerCase(), "select");
    let option_tags = testfield.field.querySelectorAll('option');
    assertEqual(option_tags.length, Object.keys(options).length);
    return testfield;
}

let tests_SelectField = [
    function test_SelectField_ok() {
        let testfield = base_config_SelectField();
        testfield.field.value = 4;
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
    function test_SelectField_ko() {
        let testfield = base_config_SelectField(true);
        testfield.field.value = 6;
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "Merci de compléter ce champ.");
    },
    function test_SelectField_ko_with_hack() {
        let testfield = base_config_SelectField(true);
        let new_option = document.createElement('option');
        new_option.innerText = "Hack !";
        new_option.value = 6;
        testfield.field.appendChild(new_option);
        testfield.field.value = 6;
        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "Le choix 6 ne fait pas partie de la liste des choix possibles.");
    },
    function test_SelectField_optionnal() {
        let testfield = base_config_SelectField();
        testfield.field.value = "";
        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.error, "");
    },
]
