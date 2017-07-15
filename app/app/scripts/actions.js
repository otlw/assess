module.exports = {
  SHOW_CONCEPT_FORM: 'SHOW_CONCEPT_FORM',
  showConceptForm,
  UPDATE_FORM_DATA: 'UPDATE_FORM_DATA',
  updateFormData,
}


function showConceptForm () {
  return {
    type: this.SHOW_CONCEPT_FORM
  }
}

function updateFormData (key, value) {
  return {
    type: this.UPDATE_FORM_DATA,
    key,
    value,
  }
}
