/*
    This is a series of javascript functions that the UI uses to communicate with the Master contract
    Coded by Austen Goddu
*/


function TAG_IS_REAL(searchTerm) {

    if(getTagAddressFromName(searchTerm) == 0) {
        return false;

    } else {
        return true;

    }

}


function SEARCH_ENGINE (searchTerm) {

    searchTerm = string(searchTerm);

    if(TAG_IS_REAL(searchTerm)) {
        return searchTerm;

    } else {
        return "Sorry, we did not find the specified tag, check mispelling grammar, punctuation, etc.";

    }

}


function ADD_TAG(tagName) {

    // will be finished at a later date, need to figure out how to pass arrays as arguments

}


function GET_TAG_DESCRIPTION (searchTerm) {

    if (TAG_IS_REAL(searchTerm)) {
          return master.getTagDescription(searchTerm);

    } else {
          return "Sorry, we did not find the specified tag, check mispelling grammar, punctuation, etc.";

    }

}
