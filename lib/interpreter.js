/*
    This is a series of javascript functions that the UI uses to communicate with the Master contract
*/


// These functions are subject to change before their implementation

// -------------------------------------------------------------------------------------------------------------------

function tagIsReal(string tagName) { // function to provide search mechanism

  if(master.getTagAddressFromName(tagName.lower()) == 0) {

    return "We did not find a tag with the name: " + searchTerm + ", maybe a mispelling? ";

  }

  else {

    return true;

  }
}

// ---------------------------------------------------------------------------------------------------------------------

function searchEngine(string searchTerm) { // literal search function to find and return an existing tag if one with the given name is present

  if(tagIsReal(searchTerm) == true) {

    return searchTerm;

  }

  else {

    tagIsReal(searchTerm);

  }

}

// -------------------------------------------------------------------------------------------------------------------------

function getNumberOfAchievements(string tagName) { // function to return the number of achievements associated with a tag

  if(tagIsReal(tagName) == true) {

    return achievments[getTagAddressFromName(tagName.lower())];

  }

  else {

    return "We did not find a tag with the name: " + searchTerm + ", maybe a mispelling? ";

  }
}

// -----------------------------------------------------------------------------------------------------------------------

function makeTag(string tagName, var parents = [] ) { // function to create a tag with the master's addTag function


  var addresses = [];

  for(int i = 0; i <= parents.length(); i++) {

    addresses.push(master.getTagAddressFromName(parents[i]));

  }

  master.addTag(tagName, address[] parentList);

}

// ------------------------------------------------------------------------------------------------------------------------

function getGrade() { // function to get the score on the assessment



}

// ------------------------------------------------------------------------------------------------------------------------

function makeAssessment() { // function to set up the assessment with questions



}

// -------------------------------------------------------------------------------------------------------------------------
