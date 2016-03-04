/*
    This is a series of javascript functions that the UI uses to communicate with the Master contract
*/


// These functions are subject to change before their implementation

// -------------------------------------------------------------------------------------------------------------------

function tagIsReal(tagName) { // function to provide search mechanism

  if(master.getTagAddressFromName(tagName.lower()) == 0) {

    return false;

  }

  return true;

}

// ---------------------------------------------------------------------------------------------------------------------

function searchEngine(searchTerm) { // literal search function to find and return an existing tag if one with the given name is present

  if(tagIsReal(searchTerm) == true) {

    return searchTerm;

  }
  return "We did not find a tag with the name: " + searchTerm + ", maybe a mispelling? ";

}

// -------------------------------------------------------------------------------------------------------------------------

function getNumberOfAchievements(tagName) { // function to return the number of achievements associated with a tag

  if(tagIsReal(tagName) == true) {

    return achievments[getTagAddressFromName(tagName.lower())];

  }

  return "We did not find a tag with the name: " + searchTerm + ", maybe a mispelling? ";

}

// -----------------------------------------------------------------------------------------------------------------------

function makeTag(tagName, parents) { // function to create a tag with the master's addTag function



}

// ------------------------------------------------------------------------------------------------------------------------

function getGrade() { // function to get the score on the assessment



}

// ------------------------------------------------------------------------------------------------------------------------

function assessorConsent(consent) {

  if(consent == true) {

    // will be filled at a later date

  }

  else {

    // will be filled at a later date

  }
}

// ------------------------------------------------------------------------------------------------------------------------

function getAcountBalance() {



}
