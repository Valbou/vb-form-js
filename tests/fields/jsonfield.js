function base_config_JSONField(fields_data) {
    let testfield = new JSONField("specificites");
    testfield.setFields(fields_data);
    assertEqual(testfield.field.nodeName.toLowerCase(), "textarea");
    assertEqual(testfield.fields.length, json_fields_data.length);
    return testfield;
}

let tests_JSONField = [
    function test_JSONField() {
        let testfield = base_config_JSONField(json_fields_data);

        assertEqual(testfield.fields[0].name, "vbjsonf_marque_modele");
        assertEqual(testfield.fields[0].id_field, "id_vbjsonf_marque_modele_0");
        testfield.fields[0].field.value = "Test";
        assertTrue(testfield.fields[0].valid);

        testfield.validate();
        assertFalse(testfield.valid);
        assertEqual(testfield.error, "");
        assertEqual(testfield.field.value, JSON.stringify({"marque_modele":"Test"}));
    },
    function test_JSONField_valid() {
        let testfield = base_config_JSONField(json_fields_data);

        assertEqual(testfield.fields[1].name, "vbjsonf_Dimensions_max");
        assertEqual(testfield.fields[1].id_field, "id_vbjsonf_Dimensions_max_1");
        testfield.fields[1].field.value = "Dimension max";
        assertTrue(testfield.fields[1].valid);

        assertEqual(testfield.fields[3].name, "vbjsonf_Volume_d_affaires_max");
        assertEqual(testfield.fields[3].id_field, "id_vbjsonf_Volume_d_affaires_max_3");
        testfield.fields[3].field.value = "5";
        assertTrue(testfield.fields[3].valid);

        assertEqual(testfield.fields[4].name, "vbjsonf_Unites_volumes_d_affaires");
        assertEqual(testfield.fields[4].id_field, "id_vbjsonf_Unites_volumes_d_affaires_4");
        testfield.fields[4].field.value = "Volume d'Affaire";
        assertTrue(testfield.fields[4].valid);

        testfield.validate();
        assertTrue(testfield.valid);
        assertEqual(testfield.field.value, JSON.stringify({"Dimensions_max":"Dimension max","Volume_d_affaires_max":"5","Unites_volumes_d_affaires":"Volume d'Affaire"}));
    }
]
