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

function EVERYTHING_IS_REAL(tagList, startPoint) { // recursive function to test whether or not all of the tags in an array are real (can be done with iteration, more effective with recursiveness)

      if(tagList < startPoint){

        if(master.getTagAddressFromName(tagList[startPoint]) === 0) {

            EVERYTHING_IS_REAL(tagList, startPoint + 1)

        } else {
            return "There is no tag with the name: " + tagList[startPoint];

        }


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

    if(immediateParents.constructor === Array) {

        if(EVERYTHING_IS_REAL) {

            master.addTag(tagName, immediateParents, description)

        } else if(immediateParents.constructor === String) {

            var parents = [immediateParents];
            master.addTag(tagName, parents, description);

        } else {
            return "This is not a valid parent entry, please retry."

        }


    }

}


function GET_TAG_DESCRIPTION (searchTerm) { // function to get the description of a tag

    if (TAG_IS_REAL(searchTerm)) {
          return master.getTagDescription(searchTerm);

    } else {
          return "Sorry, we did not find the specified tag, check mispelling grammar, punctuation, etc.";

    }

}
