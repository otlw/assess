/*
    This is a series of javascript functions that the UI uses to communicate with the Master contract
    Coded by Austen Goddu
*/


function TAG_IS_REAL(searchTerm) { // function to test whether or not a tag is already created

    if(master.getTagAddressFromName(searchTerm) === 0) {
        return false;

    } else {
        return true;

    }

}



function SEARCH_ENGINE (searchTerm) { // literal search function testing if a tag is real

    searchTerm = string(searchTerm);

    if(TAG_IS_REAL(searchTerm)) {
        return searchTerm;

    } else {
        return "Sorry, we did not find the specified tag, check mispelling grammar, punctuation, etc.";

    }

}


function ADD_TAG(tagName, immediateParents, description) { // function to add a tag

    var confirmedParents = [];

    if(immediateParents.constructor === Array) {

        for(var i = 0; i <= immediateParents.length; i++) {

            if(TAG_IS_REAL(immediateParents[i])) {
                confirmedParents.add(immediateParents[i]);

            } else {
                return "The parent tag: " + immediateParents[i] + " has not been added because we cannot find it. Please re-add afterwards. ";

            }
        }

    } else {
        confirmedParents.add(immediateParents);

    }

    master.addTag(tagName, confirmedParents, description);
    return "The tag: " + tagName + " has been added with all valid parents.";
}



function GET_TAG_DESCRIPTION (searchTerm) { // function to get the description of a tag

    if (TAG_IS_REAL(searchTerm)) {
          return master.getTagDescription(searchTerm);

    } else {
          return "Sorry, we did not find the specified tag, check mispelling grammar, punctuation, etc.";

    }

}
